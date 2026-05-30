'use client';

import { useQuery } from '@tanstack/react-query';
import { useLanguage } from './language-context';
import { ChefHat } from 'lucide-react';
import type { Restaurant, ApiResponse } from '@/types';

export function Footer() {
  const { language } = useLanguage();

  const { data: response } = useQuery<ApiResponse<Restaurant>>({
    queryKey: ['restaurant'],
    queryFn: () => fetch('/api/restaurant').then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const restaurant = response?.data;
  const name = language === 'ar' ? restaurant?.nameAr : restaurant?.nameEn;
  const isRTL = language === 'ar';

  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="max-w-5xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="size-4 text-primary" />
            <span className="text-sm font-semibold">{name || 'مضيق'}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {isRTL ? 'Powered by Madaq' : 'Powered by Madaq'}
          </p>
        </div>
      </div>
    </footer>
  );
}
