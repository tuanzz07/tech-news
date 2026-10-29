'use client';

import React, { useState } from 'react';
import { Article } from '@/types/news';
import { formatRelativeTime } from '@/lib/utils';
import {
  BookOpen,
  Bookmark,
  ExternalLink,
  Clock,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onOpenReader: (article: Article) => void;
  isSaved: boolean;
  onToggleSave: (article: Article) => void;
}

export function ArticleCard({
  article,
  onOpenReader,
  isSaved,
  onToggleSave,
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(article.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'ai':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'hardware':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'dev':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'security':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'business':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'vietnam':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'ai':
        return 'AI & ML';
      case 'hardware':
        return 'Phần cứng';
      case 'dev':
        return 'Lập trình';
      case 'security':
        return 'Bảo mật';
      case 'business':
        return 'Thị trường';
      case 'vietnam':
        return 'Tin VN';
      default:
        return 'Công nghệ';
    }
  };

  return (
    <article className="group flex flex-col justify-between h-full bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div>
        {/* Thumbnail Image Container */}
        <div
          className="relative w-full h-48 bg-slate-100 dark:bg-slate-700/50 overflow-hidden cursor-pointer"
          onClick={() => onOpenReader(article)}
        >
          {article.thumbnail && !imageError ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-400">
              <Sparkles className="w-8 h-8 mb-1 opacity-40 text-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {article.sourceName}
              </span>
            </div>
          )}

          {/* Badges on Top of Image */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-md shadow-sm ${getCategoryColor(
                article.category
              )}`}
            >
              {getCategoryLabel(article.category)}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(article);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md shadow-md transition-all ${
                isSaved
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-200 hover:scale-110'
              }`}
              title={isSaved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
              {article.sourceName}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {article.readingTimeMinutes} phút đọc
              </span>
              <span>•</span>
              <span>{formatRelativeTime(article.pubDate)}</span>
            </div>
          </div>

          {/* Title */}
          <h2
            onClick={() => onOpenReader(article)}
            className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors leading-snug mb-2.5"
            title={article.title}
          >
            {article.title}
          </h2>

          {/* Description Excerpt */}
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
            {article.description || 'Không có mô tả xem trước. Nhấn Đọc tinh gọn để xem toàn văn bài viết.'}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
        {/* Primary Reader Mode Action */}
        <button
          onClick={() => onOpenReader(article)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Đọc tinh gọn</span>
        </button>

        {/* Share / Copy Link */}
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          title="Sao chép liên kết"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
        </button>

        {/* Original Article Link */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          title="Mở bài gốc trên trang tin"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}
