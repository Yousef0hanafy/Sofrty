'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLanguage } from './language-context';
import { cn } from '@/lib/utils';
import type { Category, ApiResponse } from '@/types';

interface CategoryBarProps {
  activeCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export function CategoryBar({ activeCategoryId, onSelectCategory }: CategoryBarProps) {
  const { language } = useLanguage();

  const { data: response, isLoading } = useQuery<ApiResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const categories = response?.data ?? [];

  const allLabel = language === 'ar' ? 'الكل' : 'All';

  return (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto py-3">
          {/* All category */}
          <motion.button
            layout
            onClick={() => onSelectCategory(null)}
            className={cn(
              'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeCategoryId === null
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {allLabel}
          </motion.button>

          {/* Category pills */}
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 h-8 w-20 rounded-full bg-secondary animate-pulse"
                />
              ))
            : categories.map((cat) => {
                const label = language === 'ar' ? cat.nameAr : cat.nameEn;
                const isActive = activeCategoryId === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    layout
                    onClick={() => onSelectCategory(isActive ? null : cat.id)}
                    className={cn(
                      'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {label}
                  </motion.button>
                );
              })}
        </div>
      </div>
    </div>
  );
}
