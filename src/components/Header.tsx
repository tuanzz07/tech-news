'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Bookmark,
  Sun,
  Moon,
  Zap,
  X,
  RefreshCw,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  savedCount: number;
  onOpenBookmarks: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({
  searchQuery,
  onSearchChange,
  savedCount,
  onOpenBookmarks,
  darkMode,
  onToggleDarkMode,
  onRefresh,
  isRefreshing,
}: HeaderProps) {
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                  TechPulse
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 hidden md:block">
                Tin tức & Phân tích Công nghệ Chuyên sâu
              </p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm theo từ khóa (AI, Nvidia, Apple, bảo mật...)..."
              className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Cập nhật tin mới"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* Bookmarks Counter Button */}
            <button
              onClick={onOpenBookmarks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Bài viết đã lưu"
            >
              <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-current" />
              <span className="text-xs font-semibold hidden sm:inline">Đã lưu</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center text-[11px] font-bold rounded-full bg-blue-600 text-white">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchOpenMobile && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 relative">
            <Search className="w-4 h-4 absolute left-3 top-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm tin tức công nghệ..."
              className="w-full pl-9 pr-9 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-5 p-0.5 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
