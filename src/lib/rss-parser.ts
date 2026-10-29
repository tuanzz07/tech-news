import { XMLParser } from 'fast-xml-parser';
import { Article, FeedSource } from '@/types/news';
import { estimateReadingTime, generateArticleId, stripHtml } from './utils';

// In-memory feed cache to avoid repeated network calls
interface CacheEntry {
  articles: Article[];
  timestamp: number;
}

const feedCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: true,
  parseAttributeValue: false,
  cdataPropName: '__cdata',
});

/**
 * Extract image URL from XML item nodes or HTML description
 */
function extractImage(item: any, htmlContent?: string): string | undefined {
  // 1. Check media:content
  if (item['media:content']?.['@_url']) {
    return item['media:content']['@_url'];
  }
  if (Array.isArray(item['media:content'])) {
    const imgObj = item['media:content'].find((m: any) =>
      m['@_medium'] === 'image' || (m['@_type'] && m['@_type'].startsWith('image/'))
    );
    if (imgObj?.['@_url']) return imgObj['@_url'];
    if (item['media:content'][0]?.['@_url']) return item['media:content'][0]['@_url'];
  }

  // 2. Check media:thumbnail
  if (item['media:thumbnail']?.['@_url']) {
    return item['media:thumbnail']['@_url'];
  }
  if (Array.isArray(item['media:thumbnail']) && item['media:thumbnail'][0]?.['@_url']) {
    return item['media:thumbnail'][0]['@_url'];
  }

  // 3. Check enclosure
  if (item.enclosure?.['@_url'] && (!item.enclosure['@_type'] || item.enclosure['@_type'].startsWith('image/'))) {
    return item.enclosure['@_url'];
  }
  if (Array.isArray(item.enclosure)) {
    const encImg = item.enclosure.find((e: any) => e['@_type']?.startsWith('image/'));
    if (encImg?.['@_url']) return encImg['@_url'];
  }

  // 4. Fallback: Parse <img> tag from HTML content / description
  if (htmlContent) {
    const imgMatch = htmlContent.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }

  return undefined;
}

/**
 * Normalize CDATA or string text
 */
function extractText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (node.__cdata) return String(node.__cdata);
  if (node['#text']) return String(node['#text']);
  return '';
}

/**
 * Fetch and parse a single RSS/Atom feed
 */
export async function fetchFeed(source: FeedSource): Promise<Article[]> {
  const cached = feedCache.get(source.id);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.articles;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'TechPulseNewsBot/1.0 (+https://techpulsenews.vercel.app; Mozilla/5.0 Chrome/120.0)',
        Accept: 'application/rss+xml, application/xml, text/xml, application/atom+xml, text/html;q=0.9',
      },
      next: { revalidate: 300 }, // Next.js ISR cache: 5 minutes
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[RSS] Failed to fetch feed ${source.id}: ${res.status} ${res.statusText}`);
      return cached ? cached.articles : [];
    }

    const xmlText = await res.text();
    const parsed = xmlParser.parse(xmlText);

    let rawItems: any[] = [];

    // Support RSS 2.0 (<rss><channel><item>)
    if (parsed.rss?.channel?.item) {
      rawItems = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item];
    }
    // Support Atom 1.0 (<feed><entry>)
    else if (parsed.feed?.entry) {
      rawItems = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry];
    }
    // Support RDF (<rdf:RDF><item>)
    else if (parsed['rdf:RDF']?.item) {
      rawItems = Array.isArray(parsed['rdf:RDF'].item)
        ? parsed['rdf:RDF'].item
        : [parsed['rdf:RDF'].item];
    }

    const articles: Article[] = [];

    for (const item of rawItems) {
      const rawTitle = extractText(item.title);
      if (!rawTitle) continue;

      // Extract Link
      let link = '';
      if (item.link) {
        if (typeof item.link === 'string') {
          link = item.link;
        } else if (item.link['@_href']) {
          link = item.link['@_href'];
        } else if (item.link['#text']) {
          link = item.link['#text'];
        } else if (Array.isArray(item.link)) {
          const alternate = item.link.find((l: any) => l['@_rel'] === 'alternate');
          link = alternate?.['@_href'] || item.link[0]?.['@_href'] || item.link[0];
        }
      }

      if (!link) {
        link = extractText(item.guid) || extractText(item.id);
      }
      if (!link || !link.startsWith('http')) continue;

      // Extract Description & Content
      const rawDesc = extractText(item.description) || extractText(item.summary);
      const rawContent = extractText(item['content:encoded']) || extractText(item.content);
      const combinedHtml = rawContent || rawDesc;

      const cleanSummary = stripHtml(rawDesc || rawContent).slice(0, 320);

      // Extract Date
      const rawDate =
        extractText(item.pubDate) ||
        extractText(item.published) ||
        extractText(item.updated) ||
        extractText(item['dc:date']);

      const parsedDate = rawDate ? new Date(rawDate) : new Date();
      const timestamp = !isNaN(parsedDate.getTime()) ? parsedDate.getTime() : Date.now();
      const pubDate = new Date(timestamp).toISOString();

      // Extract Author
      let author =
        extractText(item['dc:creator']) ||
        extractText(item.author?.name) ||
        extractText(item.author) ||
        source.name;

      // Extract Thumbnail
      const thumbnail = extractImage(item, combinedHtml);

      // Estimate Reading Time
      const readingMinutes = estimateReadingTime(cleanSummary, source.language === 'vi');

      // Tags / Categories
      let tags: string[] = [];
      if (item.category) {
        if (Array.isArray(item.category)) {
          tags = item.category
            .map((c: any) => extractText(c))
            .filter((c: string) => c.length > 0 && c.length < 30)
            .slice(0, 4);
        } else {
          const cat = extractText(item.category);
          if (cat) tags = [cat];
        }
      }

      articles.push({
        id: generateArticleId(link, rawTitle),
        title: stripHtml(rawTitle),
        link,
        description: cleanSummary,
        pubDate,
        timestamp,
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: source.website,
        category: source.category,
        author,
        thumbnail,
        readingTimeMinutes: readingMinutes,
        tags,
      });
    }

    feedCache.set(source.id, {
      articles,
      timestamp: Date.now(),
    });

    return articles;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`[RSS] Error fetching feed ${source.id}:`, err);
    return cached ? cached.articles : [];
  }
}

/**
 * Fetch articles from multiple sources concurrently
 */
export async function fetchAllArticles(sources: FeedSource[]): Promise<Article[]> {
  const activeSources = sources.filter((s) => s.enabled);
  const results = await Promise.allSettled(activeSources.map((source) => fetchFeed(source)));

  const allArticles: Article[] = [];
  for (const res of results) {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      allArticles.push(...res.value);
    }
  }

  // Sort descending by publication timestamp (latest first)
  allArticles.sort((a, b) => b.timestamp - a.timestamp);

  // De-duplicate by normalized title/link
  const seenLinks = new Set<string>();
  const uniqueArticles: Article[] = [];

  for (const article of allArticles) {
    const normalized = article.link.split('?')[0].toLowerCase();
    if (!seenLinks.has(normalized)) {
      seenLinks.add(normalized);
      uniqueArticles.push(article);
    }
  }

  return uniqueArticles;
}
