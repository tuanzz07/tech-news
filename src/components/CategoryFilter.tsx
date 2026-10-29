'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/sources';
import { CategoryId } from '@/types/news';
import {
  Layers,
  Cpu,
  HardDrive,
  Code,
  ShieldAlert,
  TrendingUp,
  Globe,
} from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  categoryCounts?: Record<string, number>;
}

export function CategoryFilter({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryFilterProps) {
  const renderIcon = (id: string, className = 'w-4 h-4') => {
    switch (id) {
      case 'ai':
        return <Cpu className={className} />;
      case 'hardware':
        return <HardDrive className={className} />;
      case 'dev':
        return <Code className={className} />;
      case 'security':
        return <ShieldAlert className={className} />;
      case 'business':
        return <TrendingUp className={className} />;
      case 'vietnam':
        return <Globe className={className} />;
      case 'all':
      default:
        return <Layers className={className} />;
    }
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts ? categoryCounts[cat.id] : undefined;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all select-none ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600/30'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                {renderIcon(cat.id)}
              </span>
              <span>{cat.nameVi}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-blue-700 text-blue-100'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
