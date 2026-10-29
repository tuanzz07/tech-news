'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Article, ReaderData, ReaderTheme, ReaderFontSize, ReaderFontFamily } from '@/types/news';
import { formatRelativeTime } from '@/lib/utils';
import {
  X,
  ExternalLink,
  Bookmark,
  Share2,
  Check,
  Type,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ReaderModalProps {
  article: Article | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (article: Article) => void;
}

export function ReaderModal({
  article,
  onClose,
  isSaved,
  onToggleSave,
}: ReaderModalProps) {
  const [readerData, setReaderData] = useState<ReaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reader customization states
  const [theme, setTheme] = useState<ReaderTheme>('light');
  const [fontSize, setFontSize] = useState<ReaderFontSize>('lg');
  const [fontFamily, setFontFamily] = useState<ReaderFontFamily>('sans');
  const [isWide, setIsWide] = useState(false);

  // Audio / Speech Synthesis states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Reading progress
  const [readingProgress, setReadingProgress] = useState(0);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Fetch Reader Data when article changes
  useEffect(() => {
    if (!article) return;

    setLoading(true);
    setError(null);
    setReaderData(null);
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);

    const controller = new AbortController();

    async function loadContent() {
      try {
        const query = new URLSearchParams({
          url: article!.link,
          title: article!.title || '',
          description: article!.description || '',
          author: article!.author || '',
          thumbnail: article!.thumbnail || '',
        });

        const res = await fetch(`/api/reader?${query.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Không thể tải bài viết');

        const json = await res.json();
        if (json.success && json.data) {
          setReaderData(json.data);
        } else {
          throw new Error('Định dạng dữ liệu không hợp lệ');
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Lỗi bóc tách nội dung');
        }
      } finally {
        setLoading(false);
      }
    }

    loadContent();

    return () => {
      controller.abort();
      window.speechSynthesis?.cancel();
    };
  }, [article]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reading progress scroll handler
  const handleScroll = () => {
    if (!contentScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentScrollRef.current;
    const total = scrollHeight - clientHeight;
    if (total > 0) {
      setReadingProgress(Math.min(100, Math.max(0, Math.round((scrollTop / total) * 100))));
    }
  };

  // Text to Speech
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng Text-to-Speech.');
      return;
    }

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    if (!readerData) return;

    window.speechSynthesis.cancel();
    const cleanText = `${readerData.title}. ${readerData.textContent.slice(0, 4000)}`;
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Auto detect language
    if (article?.sourceId?.includes('vnexpress') || article?.sourceId?.includes('dantri') || article?.sourceId?.includes('tinhte')) {
      utterance.lang = 'vi-VN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 1.0;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const stopSpeech = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleCopyLink = () => {
    if (article) {
      navigator.clipboard.writeText(article.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!article) return null;

  // Theme styling helpers
  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#5f4b32] selection:bg-[#dfcca3]';
      case 'dark':
        return 'bg-slate-900 text-slate-100 selection:bg-blue-600/40';
      case 'oled':
        return 'bg-black text-slate-100 selection:bg-blue-600/40';
      case 'light':
      default:
        return 'bg-white text-slate-900 selection:bg-blue-200';
    }
  };

  const getHeaderThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f4e4c1]/90 border-[#dfcca3] text-[#5f4b32]';
      case 'dark':
        return 'bg-slate-900/90 border-slate-800 text-slate-200';
      case 'oled':
        return 'bg-black/90 border-zinc-800 text-slate-200';
      case 'light':
      default:
        return 'bg-white/90 border-slate-200 text-slate-800';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm leading-relaxed';
      case 'base':
        return 'text-base leading-relaxed';
      case 'xl':
        return 'text-xl leading-relaxed';
      case '2xl':
        return 'text-2xl leading-loose';
      case 'lg':
      default:
        return 'text-lg leading-relaxed';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col backdrop-blur-md bg-slate-950/70 animate-in fade-in duration-200">
      {/* Top Reading Progress Bar */}
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Reader Controls Toolbar */}
      <div
        className={`w-full border-b backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap ${getHeaderThemeClasses()}`}
      >
        {/* Left: Source info & Progress */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Đóng chế độ đọc tinh gọn (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
              Reader Mode
            </span>
          </div>
          <span className="text-xs font-medium opacity-75 hidden md:inline-block">
            Tiến độ: {readingProgress}%
          </span>
        </div>

        {/* Center: Formatting controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Themes: Light, Sepia, Dark, OLED */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 p-0.5 rounded-lg">
            <button
              onClick={() => setTheme('light')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'
              }`}
              title="Giao diện Sáng"
            >
              Sáng
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                theme === 'sepia' ? 'bg-[#dfcca3] text-[#5f4b32] shadow-sm' : 'opacity-70'
              }`}
              title="Giao diện Sepia (Dịu mắt)"
            >
              Sepia
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'opacity-70'
              }`}
              title="Giao diện Tối"
            >
              Tối
            </button>
            <button
              onClick={() => setTheme('oled')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                theme === 'oled' ? 'bg-black text-white shadow-sm ring-1 ring-zinc-700' : 'opacity-70'
              }`}
              title="Giao diện Đen OLED"
            >
              OLED
            </button>
          </div>

          {/* Font Sizes */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 p-0.5 rounded-lg">
            <button
              onClick={() => {
                const sizes: ReaderFontSize[] = ['sm', 'base', 'lg', 'xl', '2xl'];
                const idx = sizes.indexOf(fontSize);
                if (idx > 0) setFontSize(sizes[idx - 1]);
              }}
              className="px-2 py-1 text-xs font-bold rounded-md hover:bg-black/10 dark:hover:bg-white/10"
              title="Giảm cỡ chữ"
            >
              A-
            </button>
            <span className="text-xs px-1 font-semibold uppercase">{fontSize}</span>
            <button
              onClick={() => {
                const sizes: ReaderFontSize[] = ['sm', 'base', 'lg', 'xl', '2xl'];
                const idx = sizes.indexOf(fontSize);
                if (idx < sizes.length - 1) setFontSize(sizes[idx + 1]);
              }}
              className="px-2 py-1 text-xs font-bold rounded-md hover:bg-black/10 dark:hover:bg-white/10"
              title="Tăng cỡ chữ"
            >
              A+
            </button>
          </div>

          {/* Font Families */}
          <div className="hidden sm:flex items-center bg-black/5 dark:bg-white/10 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setFontFamily('sans')}
              className={`px-2 py-1 rounded-md font-sans ${fontFamily === 'sans' ? 'bg-white/80 dark:bg-white/20 font-bold' : 'opacity-70'}`}
            >
              Sans
            </button>
            <button
              onClick={() => setFontFamily('serif')}
              className={`px-2 py-1 rounded-md font-serif ${fontFamily === 'serif' ? 'bg-white/80 dark:bg-white/20 font-bold' : 'opacity-70'}`}
            >
              Serif
            </button>
            <button
              onClick={() => setFontFamily('mono')}
              className={`px-2 py-1 rounded-md font-mono ${fontFamily === 'mono' ? 'bg-white/80 dark:bg-white/20 font-bold' : 'opacity-70'}`}
            >
              Mono
            </button>
          </div>

          {/* Text to Speech */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSpeech}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
                isSpeaking
                  ? 'bg-blue-600 text-white'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
              }`}
              title={isSpeaking ? (isPaused ? 'Tiếp tục đọc' : 'Tạm dừng giọng đọc') : 'Đọc bài viết bằng giọng nói (AI Voice)'}
            >
              {isSpeaking ? (
                isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span className="hidden lg:inline">{isSpeaking ? 'Đang đọc' : 'Đọc to'}</span>
            </button>
            {isSpeaking && (
              <button
                onClick={stopSpeech}
                className="p-1.5 rounded-lg hover:bg-rose-500 hover:text-white transition-colors"
                title="Dừng đọc"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsWide(!isWide)}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden md:block"
            title={isWide ? 'Khung đọc vừa phải' : 'Khung đọc mở rộng'}
          >
            {isWide ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggleSave(article)}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved
                ? 'bg-blue-600 text-white'
                : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={isSaved ? 'Bỏ lưu' : 'Lưu bài viết'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Sao chép liên kết"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
          </button>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Mở bài gốc"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        ref={contentScrollRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto ${getThemeClasses()} transition-colors duration-200`}
      >
        <div
          className={`mx-auto px-6 py-10 transition-all ${
            isWide ? 'max-w-4xl' : 'max-w-2xl'
          } ${getFontFamilyClass()}`}
        >
          {loading ? (
            <div className="space-y-6 animate-pulse py-8">
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-10 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
              <div className="w-full h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl my-6" />
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6" />
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl my-10">
              <p className="text-rose-600 dark:text-rose-400 font-semibold mb-3">
                {error}
              </p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
              >
                <span>Xem trên trang gốc</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : readerData ? (
            <div>
              {/* Header Info */}
              <div className="border-b border-slate-200/60 dark:border-slate-800 pb-6 mb-8">
                {/* Source & Date meta */}
                <div className="flex flex-wrap items-center gap-3 text-xs opacity-75 mb-3 font-sans">
                  <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {article.sourceName}
                  </span>
                  <span>•</span>
                  <span>{formatRelativeTime(article.pubDate)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {readerData.readingTimeMinutes} phút đọc
                  </span>
                  {readerData.byline && (
                    <>
                      <span>•</span>
                      <span>Bởi {readerData.byline}</span>
                    </>
                  )}
                </div>

                {/* Article Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                  {readerData.title}
                </h1>

                {/* Lead Image if available */}
                {readerData.heroImage && (
                  <div className="my-6 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={readerData.heroImage}
                      alt={readerData.title}
                      className="w-full max-h-[460px] object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Rendered Clean Content */}
              <div
                className={`reader-body ${getFontSizeClass()} prose dark:prose-invert max-w-none`}
                dangerouslySetInnerHTML={{ __html: readerData.content }}
              />

              {/* Article Footer & Original Source Attribution */}
              <div className="mt-14 pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs opacity-75">
                <div>
                  Bài viết được tổng hợp tự động từ{' '}
                  <strong className="opacity-100">{article.sourceName}</strong>.
                </div>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-semibold transition-colors"
                >
                  <span>Mở bài gốc trên {new URL(article.link).hostname}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
