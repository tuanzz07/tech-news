export type CategoryId =
  | 'all'
  | 'ai'
  | 'hardware'
  | 'dev'
  | 'security'
  | 'business'
  | 'vietnam';

export interface Category {
  id: CategoryId;
  name: string;
  nameVi: string;
  description: string;
  iconName: string;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: CategoryId;
  website: string;
  language: 'vi' | 'en';
  description: string;
  enabled: boolean;
}

export interface Article {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  timestamp: number;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  category: CategoryId;
  author?: string;
  thumbnail?: string;
  readingTimeMinutes: number;
  tags?: string[];
}

export interface ReaderData {
  title: string;
  byline?: string;
  dir?: string;
  content: string;
  textContent: string;
  length: number;
  excerpt?: string;
  siteName?: string;
  originalUrl: string;
  publishedTime?: string;
  heroImage?: string;
  readingTimeMinutes: number;
  isFallback?: boolean;
}

export type ReaderTheme = 'light' | 'sepia' | 'dark' | 'oled';
export type ReaderFontSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type ReaderFontFamily = 'sans' | 'serif' | 'mono';
