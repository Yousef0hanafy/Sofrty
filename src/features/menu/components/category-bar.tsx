'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from './language-context';
import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';
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
    <div className="w-full bg-card border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {language === 'ar' ? 'اصنع اختيارك' : 'Make Your Choice'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar' ? 'اختر من أشهى الأطباق' : 'Choose from our finest dishes'}
          </p>
        </div>

        <div className="flex items-start justify-center gap-3 sm:gap-5 overflow-x-auto hide-scrollbar pb-2 px-1">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full bg-secondary animate-pulse" />
                <div className="h-3 w-12 rounded bg-secondary animate-pulse" />
              </div>
            ))
          ) : (
            <>
              {/* "All" button */}
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => onSelectCategory(null)}
                className={cn(
                  'flex flex-col items-center gap-2.5 shrink-0 category-circle',
                  activeCategoryId === null && 'active'
                )}
              >
                <div
                  className={cn(
                    'w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center border-2 transition-all duration-200',
                    activeCategoryId === null
                      ? 'border-[#d4af37] bg-[#3e2723]/10 shadow-lg shadow-[#d4af37]/20'
                      : 'border-border bg-card hover:border-[#d4af37]/50'
                  )}
                >
                  <LayoutGrid className={cn(
                    'size-6 transition-colors',
                    activeCategoryId === null ? 'text-[#3e2723]' : 'text-muted-foreground'
                  )} />
                </div>
                <span
                  className={cn(
                    'text-[11px] sm:text-xs font-semibold transition-colors',
                    activeCategoryId === null ? 'text-[#3e2723]' : 'text-muted-foreground'
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
                    whileTap={{ scale: 0.93 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                    onClick={() => onSelectCategory(isActive ? null : cat.id)}
                    className={cn(
                      'flex flex-col items-center gap-2.5 shrink-0 category-circle',
                      isActive && 'active'
                    )}
                  >
                    <div
                      className={cn(
                        'w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border-2 transition-all duration-200',
                        isActive
                          ? 'border-[#d4af37] shadow-lg shadow-[#d4af37]/20'
                          : 'border-border hover:border-[#d4af37]/50'
                      )}
                    >
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt={label}
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <span className="text-lg font-bold text-muted-foreground/40">{cat.nameEn?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-[11px] sm:text-xs font-semibold transition-colors max-w-[72px] truncate',
                        isActive ? 'text-[#3e2723]' : 'text-muted-foreground'
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
    </div>
  );
}
