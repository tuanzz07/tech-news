import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES, FEED_SOURCES } from '@/lib/sources';
import { fetchAllArticles } from '@/lib/rss-parser';
import { CategoryId } from '@/types/news';

// Revalidate every 5 minutes on Vercel Edge / Serverless
export const revalidate = 300;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') || 'all') as CategoryId;
    const sourceId = searchParams.get('source');
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)));

    // Filter relevant sources
    let targetSources = FEED_SOURCES;
    if (category !== 'all') {
      targetSources = targetSources.filter((s) => s.category === category);
    }
    if (sourceId) {
      targetSources = targetSources.filter((s) => s.id === sourceId);
    }

    // Fetch articles
    let allArticles = await fetchAllArticles(targetSources);

    // Apply search filter if keyword provided
    if (search) {
      allArticles = allArticles.filter((article) => {
        const titleMatch = article.title.toLowerCase().includes(search);
        const descMatch = article.description.toLowerCase().includes(search);
        const authorMatch = article.author?.toLowerCase().includes(search);
        const sourceMatch = article.sourceName.toLowerCase().includes(search);
        const tagMatch = article.tags?.some((t) => t.toLowerCase().includes(search));
        return titleMatch || descMatch || authorMatch || sourceMatch || tagMatch;
      });
    }

    const total = allArticles.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedArticles = allArticles.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        articles: paginatedArticles,
        total,
        page,
        limit,
        totalPages,
        activeCategory: category,
        activeSource: sourceId,
        cachedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    console.error('[API News] Error:', error);
    return NextResponse.json(
      { error: 'Không thể tải tin tức. Vui lòng thử lại.', details: error.message },
      { status: 500 }
    );
  }
}
