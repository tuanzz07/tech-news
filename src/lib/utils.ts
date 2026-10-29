import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strip HTML tags and normalize whitespace
 */
export function stripHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Estimate reading time in minutes based on word count
 */
export function estimateReadingTime(text: string, isVietnamese = false): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  // Vietnamese reading speed ~250 wpm, English ~200 wpm
  const wpm = isVietnamese ? 250 : 200;
  const minutes = Math.ceil(words / wpm);
  return Math.max(1, minutes);
}

/**
 * Format relative time in Vietnamese
 */
export function formatRelativeTime(dateInput: string | number | Date): string {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Gần đây';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Vừa xong';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'Hôm qua';
    }
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Gần đây';
  }
}

/**
 * Generate stable unique ID from a string URL
 */
export function generateArticleId(url: string, title: string): string {
  const combined = (url || '') + (title || '');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}
