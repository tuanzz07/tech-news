import * as cheerio from 'cheerio';
import { ReaderData } from '@/types/news';
import { estimateReadingTime, stripHtml } from './utils';

/**
 * Fetch and extract clean article content for Reader Mode
 */
export async function extractArticleContent(
  url: string,
  fallbackInfo?: { title?: string; description?: string; author?: string; thumbnail?: string }
): Promise<ReaderData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
      },
      next: { revalidate: 3600 }, // Cache article extraction for 1 hour
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // 1. Extract metadata
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      fallbackInfo?.title ||
      'Không có tiêu đề';

    const author =
      $('meta[name="author"]').attr('content') ||
      $('meta[property="article:author"]').attr('content') ||
      $('.author').first().text().trim() ||
      $('[rel="author"]').first().text().trim() ||
      fallbackInfo?.author ||
      '';

    const publishedTime =
      $('meta[property="article:published_time"]').attr('content') ||
      $('time[datetime]').first().attr('datetime') ||
      $('time').first().text().trim() ||
      '';

    const siteName =
      $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="application-name"]').attr('content') ||
      new URL(url).hostname;

    const heroImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      fallbackInfo?.thumbnail ||
      '';

    // 2. Remove unwanted elements
    const unwantedSelectors = [
      'script',
      'style',
      'noscript',
      'svg',
      'iframe',
      'nav',
      'header',
      'footer',
      'aside',
      'form',
      'button',
      '.advertisement',
      '.ad',
      '.ads',
      '.banner',
      '.social-share',
      '.share-box',
      '.comments',
      '#comments',
      '.related-articles',
      '.recommended',
      '.sidebar',
      '.newsletter-signup',
      '.popup',
      '.modal',
      '.tags-list',
      '[role="complementary"]',
      '[role="banner"]',
      '[role="navigation"]',
    ];

    unwantedSelectors.forEach((selector) => {
      $(selector).remove();
    });

    // 3. Locate candidate article containers
    const candidateSelectors = [
      'article',
      '[itemprop="articleBody"]',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.story-body',
      '.detail-content',
      '.fck_detail', // Common in VnExpress
      '.content-detail',
      'main',
      '[role="main"]',
      '.main-content',
    ];

    let contentContainer: cheerio.Cheerio<any> | null = null;

    for (const selector of candidateSelectors) {
      const match = $(selector);
      if (match.length > 0 && match.text().trim().length > 300) {
        contentContainer = match.first();
        break;
      }
    }

    // Fallback: If no candidate container found, evaluate all <div> tags for paragraph density
    if (!contentContainer) {
      let maxScore = 0;
      $('div').each((_, el) => {
        const textLen = $(el).children('p').text().trim().length;
        if (textLen > maxScore) {
          maxScore = textLen;
          contentContainer = $(el);
        }
      });
    }

    let cleanHtml = '';
    let textContent = '';

    if (contentContainer && contentContainer.length > 0) {
      // Resolve relative image URLs to absolute
      contentContainer.find('img').each((_, img) => {
        const src = $(img).attr('src') || $(img).attr('data-src');
        if (src) {
          try {
            const absoluteSrc = new URL(src, url).href;
            $(img).attr('src', absoluteSrc);
            $(img).removeAttr('srcset');
            $(img).removeAttr('loading');
            $(img).addClass('rounded-xl my-6 max-w-full h-auto shadow-md mx-auto');
          } catch {
            // Keep original if parsing fails
          }
        }
      });

      // Format headings, paragraphs and blockquotes
      contentContainer.find('p').addClass('mb-6 leading-relaxed');
      contentContainer.find('h2, h3, h4').addClass('font-bold mt-8 mb-4 tracking-tight');
      contentContainer.find('blockquote').addClass('border-l-4 border-blue-500 pl-4 py-1 my-6 italic');
      contentContainer.find('pre, code').addClass('bg-slate-100 dark:bg-slate-800 rounded px-2 py-1 text-sm');

      // Strip risky attributes
      contentContainer.find('*').each((_, el) => {
        const attribs = el.attribs || {};
        Object.keys(attribs).forEach((attr) => {
          if (attr.startsWith('on') || attr === 'style' || attr === 'id') {
            $(el).removeAttr(attr);
          }
        });
      });

      cleanHtml = contentContainer.html() || '';
      textContent = contentContainer.text().trim();
    }

    // 4. Fallback if content was too short (anti-scraping / paywall / SPA)
    if (!cleanHtml || textContent.length < 250) {
      return createFallbackReader(url, fallbackInfo);
    }

    const readingTime = estimateReadingTime(textContent);

    return {
      title,
      byline: author,
      content: cleanHtml,
      textContent,
      length: textContent.length,
      excerpt: stripHtml(textContent).slice(0, 240) + '...',
      siteName,
      originalUrl: url,
      publishedTime,
      heroImage: heroImage || undefined,
      readingTimeMinutes: readingTime,
      isFallback: false,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[Reader] Could not extract from ${url}:`, error);
    return createFallbackReader(url, fallbackInfo);
  }
}

/**
 * Generate a clean fallback reader view using RSS summary when target page blocks scraping
 */
function createFallbackReader(
  url: string,
  fallbackInfo?: { title?: string; description?: string; author?: string; thumbnail?: string }
): ReaderData {
  const title = fallbackInfo?.title || 'Bài viết công nghệ';
  const description = fallbackInfo?.description || 'Nội dung bài viết được tóm lược từ nguồn báo gốc.';
  const author = fallbackInfo?.author || 'Tác giả';
  const readingTime = estimateReadingTime(description);

  const fallbackHtml = `
    <div class="reader-fallback p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 mb-8">
      <div class="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold mb-2">
        <span>ℹ️ Tóm tắt nội dung bài viết</span>
      </div>
      <p class="text-base leading-relaxed text-slate-800 dark:text-slate-200">${description}</p>
      <div class="mt-6 pt-4 border-t border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
        <span class="text-xs text-slate-500">Trang gốc có thể yêu cầu truy cập trực tiếp hoặc chặn chế độ tự động.</span>
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <span>Đọc bài gốc trên ${new URL(url).hostname}</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  `;

  return {
    title,
    byline: author,
    content: fallbackHtml,
    textContent: description,
    length: description.length,
    excerpt: description,
    siteName: new URL(url).hostname,
    originalUrl: url,
    heroImage: fallbackInfo?.thumbnail,
    readingTimeMinutes: readingTime,
    isFallback: true,
  };
}
