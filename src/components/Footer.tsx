import React from 'react';
import { FEED_SOURCES } from '@/lib/sources';
import { Zap, ShieldCheck, Cpu, Cloud, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: About */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                TechPulse
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Cổng thông tin tổng hợp tin tức và nội dung công nghệ chuyên sâu từ các nguồn uy tín toàn cầu và Việt Nam. Tích hợp chế độ đọc tinh gọn loại bỏ phiền nhiễu.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Vercel Edge Caching hoạt động</span>
            </div>
          </div>

          {/* Col 2: Feature Highlights */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Tính năng nổi bật
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="text-blue-500 font-bold">✓</span> Chế độ đọc tinh gọn (Reader Mode)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-blue-500 font-bold">✓</span> Loại bỏ quảng cáo & tracker
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-blue-500 font-bold">✓</span> Đọc bài bằng giọng nói AI (TTS)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-blue-500 font-bold">✓</span> Giao diện Sepia, Tối & Đen OLED
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-blue-500 font-bold">✓</span> Lọc theo AI, Phần cứng, Lập trình
              </li>
            </ul>
          </div>

          {/* Col 3: Technology Sources */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Nguồn cấp dữ liệu tích hợp ({FEED_SOURCES.length} nguồn)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {FEED_SOURCES.map((source) => (
                <a
                  key={source.id}
                  href={source.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {source.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} TechPulse. Tối ưu hiệu năng cao với Next.js & Vercel Edge Network.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5 text-blue-500" /> Vercel Serverless
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-purple-500" /> RSS/XML Edge Engine
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Read-Only Cache
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
