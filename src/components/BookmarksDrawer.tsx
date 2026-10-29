'use client';

import React from 'react';
import { Article } from '@/types/news';
import { formatRelativeTime } from '@/lib/utils';
import { X, Trash2, BookOpen, ExternalLink, Bookmark } from 'lucide-react';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onOpenReader: (article: Article) => void;
  onRemoveBookmark: (articleId: string) => void;
  onClearAll: () => void;
}

export function BookmarksDrawer({
  isOpen,
  onClose,
  savedArticles,
  onOpenReader,
  onRemoveBookmark,
  onClearAll,
}: BookmarksDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-10 flex flex-col h-full border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-current" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Bài viết đã lưu ({savedArticles.length})
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {savedArticles.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-1.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1"
                title="Xóa tất cả bài đã lưu"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa hết</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                <Bookmark className="w-8 h-8 opacity-40" />
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Chưa có bài viết nào được lưu
              </p>
              <p className="text-xs text-slate-500 max-w-xs">
                Nhấn vào biểu tượng đánh dấu trên bất kỳ thẻ bài viết nào để lưu lại và đọc sau khi rảnh rỗi.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {article.sourceName}
                    </span>
                    <span>{formatRelativeTime(article.pubDate)}</span>
                  </div>
                  <h3
                    onClick={() => {
                      onOpenReader(article);
                      onClose();
                    }}
                    className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer leading-snug"
                  >
                    {article.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <button
                    onClick={() => {
                      onOpenReader(article);
                      onClose();
                    }}
                    className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Đọc tinh gọn</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Mở bài gốc"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onRemoveBookmark(article.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                      title="Bỏ lưu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
