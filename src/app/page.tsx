'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SourceFilter } from '@/components/SourceFilter';
import { ArticleCard } from '@/components/ArticleCard';
import { ReaderModal } from '@/components/ReaderModal';
import { BookmarksDrawer } from '@/components/BookmarksDrawer';
import { Footer } from '@/components/Footer';
import { Article, CategoryId } from '@/types/news';
import {
  Sparkles,
  BookOpen,
  ArrowUpDown,
  Search,
  RotateCcw,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  // Navigation & Filter state
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'readingTime'>('latest');
  const [page, setPage] = useState(1);
  const limit = 24;

  // Data state
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // App features state
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [readerArticle, setReaderArticle] = useState<Article | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load saved bookmarks and theme from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('techpulse_saved_articles');
      if (saved) {
        setSavedArticles(JSON.parse(saved));
      }
      const savedTheme = localStorage.getItem('techpulse_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Toggle Dark Mode
  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('techpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('techpulse_theme', 'light');
    }
  };

  // Toggle Bookmark
  const handleToggleSave = (article: Article) => {
    let nextSaved: Article[];
    if (savedArticles.some((a) => a.id === article.id)) {
      nextSaved = savedArticles.filter((a) => a.id !== article.id);
    } else {
      nextSaved = [article, ...savedArticles];
    }
    setSavedArticles(nextSaved);
    localStorage.setItem('techpulse_saved_articles', JSON.stringify(nextSaved));
  };

  const handleRemoveBookmark = (articleId: string) => {
    const nextSaved = savedArticles.filter((a) => a.id !== articleId);
    setSavedArticles(nextSaved);
    localStorage.setItem('techpulse_saved_articles', JSON.stringify(nextSaved));
  };

  const handleClearAllBookmarks = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ bài viết đã lưu?')) {
      setSavedArticles([]);
      localStorage.removeItem('techpulse_saved_articles');
    }
  };

  // Fetch articles from API
  const fetchArticles = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({
          category: activeCategory,
          page: String(page),
          limit: String(limit),
        });

        if (activeSource) {
          params.set('source', activeSource);
        }
        if (debouncedSearch) {
          params.set('search', debouncedSearch);
        }

        const res = await fetch(`/api/news?${params.toString()}`);
        if (!res.ok) throw new Error('Không thể tải bài viết');

        const data = await res.json();
        setArticles(data.articles || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Fetch articles error:', err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [activeCategory, activeSource, debouncedSearch, page]
  );

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handle category switch
  const handleSelectCategory = (catId: CategoryId) => {
    setActiveCategory(catId);
    setActiveSource(null); // Reset source filter
    setPage(1);
  };

  // Sorted articles
  const sortedArticles = useMemo(() => {
    const list = [...articles];
    if (sortBy === 'readingTime') {
      return list.sort((a, b) => b.readingTimeMinutes - a.readingTimeMinutes);
    }
    return list; // API already returns latest first
  }, [articles, sortBy]);

  const savedIds = useMemo(() => {
    return new Set(savedArticles.map((a) => a.id));
  }, [savedArticles]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        savedCount={savedArticles.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onRefresh={() => fetchArticles(true)}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-6 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Cập nhật liên tục từ các nguồn công nghệ uy tín</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
              Khám phá thế giới công nghệ qua{' '}
              <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
                Góc nhìn Tinh gọn
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Tổng hợp tin tức AI, Phần cứng, Lập trình và An ninh mạng. Đọc báo không quảng cáo với chế độ{' '}
              <strong className="text-white">Reader Mode</strong> và hỗ trợ đọc bằng giọng nói.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Chế độ đọc tinh gọn</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Edge Caching siêu tốc</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Không quảng cáo & tracker</span>
              </div>
            </div>
          </div>

          {/* Decorative glowing gradient sphere */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute right-10 -bottom-20 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        </section>

        {/* Filter Section */}
        <section className="space-y-3 sticky top-16 z-30 py-2 bg-slate-50/95 dark:bg-[#090d16]/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
          {/* Main Category Tabs */}
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />

          {/* Sub Source Filter */}
          <SourceFilter
            activeCategory={activeCategory}
            activeSource={activeSource}
            onSelectSource={(sourceId) => {
              setActiveSource(sourceId);
              setPage(1);
            }}
          />
        </section>

        {/* Sorting & Result Counts Bar */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <div>
            {loading ? (
              <span>Đang tải các bài viết...</span>
            ) : (
              <span>
                Tìm thấy <strong className="text-slate-800 dark:text-slate-200 font-semibold">{total}</strong> bài viết
                {debouncedSearch && ` cho từ khóa "${debouncedSearch}"`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sắp xếp:
            </span>
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  sortBy === 'latest'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Mới nhất
              </button>
              <button
                onClick={() => setSortBy('readingTime')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  sortBy === 'readingTime'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Đọc sâu (Thời gian dài)
              </button>
            </div>
          </div>
        </section>

        {/* Article Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 p-5 space-y-4 animate-pulse"
                >
                  <div className="w-full h-44 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                  <div className="space-y-2">
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedArticles.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                Không tìm thấy bài viết phù hợp
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục công nghệ khác.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setActiveSource(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xem tất cả tin tức</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onOpenReader={(item) => setReaderArticle(item)}
                  isSaved={savedIds.has(article.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </section>

        {/* Pagination Controls */}
        {totalPages > 1 && !loading && (
          <section className="flex items-center justify-center gap-2 pt-8 pb-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trang trước</span>
            </button>

            <span className="text-xs px-3 font-semibold text-slate-600 dark:text-slate-400">
              Trang {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span>Trang sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>
        )}
      </main>

      {/* Reader Mode Fullscreen Modal */}
      <ReaderModal
        article={readerArticle}
        onClose={() => setReaderArticle(null)}
        isSaved={readerArticle ? savedIds.has(readerArticle.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Bookmarks Slide-over Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        savedArticles={savedArticles}
        onOpenReader={(article) => setReaderArticle(article)}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
