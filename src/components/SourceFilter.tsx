'use client';

import React from 'react';
import { FEED_SOURCES } from '@/lib/sources';
import { CategoryId } from '@/types/news';
import { Radio } from 'lucide-react';

interface SourceFilterProps {
  activeCategory: CategoryId;
  activeSource: string | null;
  onSelectSource: (sourceId: string | null) => void;
}

export function SourceFilter({
  activeCategory,
  activeSource,
  onSelectSource,
}: SourceFilterProps) {
  const filteredSources =
    activeCategory === 'all'
      ? FEED_SOURCES
      : FEED_SOURCES.filter((s) => s.category === activeCategory);

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mr-1 flex items-center gap-1 flex-shrink-0">
        <Radio className="w-3 h-3 text-blue-500 animate-pulse" /> Nguồn:
      </span>

      <button
        onClick={() => onSelectSource(null)}
        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
          activeSource === null
            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        Tất cả nguồn ({filteredSources.length})
      </button>

      {filteredSources.map((source) => {
        const isSelected = activeSource === source.id;
        return (
          <button
            key={source.id}
            onClick={() => onSelectSource(isSelected ? null : source.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 border ${
              isSelected
                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {source.name}
          </button>
        );
      })}
    </div>
  );
}
