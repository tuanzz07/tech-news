import { NextRequest, NextResponse } from 'next/server';
import { extractArticleContent } from '@/lib/reader-extractor';

export const revalidate = 3600; // 1 hour edge cache

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl || !targetUrl.startsWith('http')) {
      return NextResponse.json(
        { error: 'URL không hợp lệ' },
        { status: 400 }
      );
    }

    const title = searchParams.get('title') || undefined;
    const description = searchParams.get('description') || undefined;
    const author = searchParams.get('author') || undefined;
    const thumbnail = searchParams.get('thumbnail') || undefined;

    const data = await extractArticleContent(targetUrl, {
      title,
      description,
      author,
      thumbnail,
    });

    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error: any) {
    console.error('[API Reader] Error:', error);
    return NextResponse.json(
      { error: 'Không thể xử lý chế độ đọc tinh gọn.', details: error.message },
      { status: 500 }
    );
  }
}
