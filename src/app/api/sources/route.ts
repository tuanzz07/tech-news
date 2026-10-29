import { NextResponse } from 'next/server';
import { CATEGORIES, FEED_SOURCES } from '@/lib/sources';

export const revalidate = 86400; // 24 hours cache

export async function GET() {
  return NextResponse.json({
    categories: CATEGORIES,
    sources: FEED_SOURCES,
  });
}
