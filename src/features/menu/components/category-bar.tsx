'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-5">
      {/* Section title */}
      <div className="text-center mb-5">
        <h2 className="text-lg font-semibold text-foreground">
          {language === 'ar' ? 'اصنع اختيارك' : 'Make Your Choice'}
        </h2>
      </div>

      {/* Circular category icons */}
      <div className="flex items-start justify-center gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-2 px-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full bg-secondary animate-pulse" />
              <div className="h-3 w-14 rounded bg-secondary animate-pulse" />
            </div>
          ))
        ) : (
          <>
            {/* "All" option */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(null)}
              className={cn(
                'category-circle flex flex-col items-center gap-2 shrink-0',
                activeCategoryId === null && 'active'
              )}
            >
              <div
                className={cn(
                  'w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full flex items-center justify-center border-2 transition-all',
                  activeCategoryId === null
                    ? 'border-[#d4af37] bg-[#0a4d3a]/10 shadow-md'
                    : 'border-border bg-card hover:border-[#d4af37]/40'
                )}
              >
                <svg viewBox="0 0 24 24" className={cn('size-7', activeCategoryId === null ? 'text-[#0a4d3a]' : 'text-muted-foreground')}>
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor" />
                </svg>
              </div>
              <span
                className={cn(
                  'text-[11px] sm:text-xs font-medium transition-colors',
                  activeCategoryId === null ? 'text-[#0a4d3a] dark:text-[#d4af37]' : 'text-muted-foreground'
                )}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </span>
            </motion.button>

            {/* Category circles */}
            {categories.map((cat, index) => {
              const label = language === 'ar' ? cat.nameAr : cat.nameEn;
              const isActive = activeCategoryId === cat.id;

              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => onSelectCategory(isActive ? null : cat.id)}
                  className={cn(
                    'category-circle flex flex-col items-center gap-2 shrink-0',
                    isActive && 'active'
                  )}
                >
                  <div
                    className={cn(
                      'w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full overflow-hidden border-2 transition-all',
                      isActive
                        ? 'border-[#d4af37] shadow-md'
                        : 'border-border hover:border-[#d4af37]/40'
                    )}
                  >
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={label}
                        fill
                        className="object-cover"
                        sizes="76px"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <span className="text-lg">{cat.nameEn?.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[11px] sm:text-xs font-medium transition-colors max-w-[76px] truncate',
                      isActive ? 'text-[#0a4d3a] dark:text-[#d4af37]' : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
