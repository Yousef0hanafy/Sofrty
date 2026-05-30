'use client';

import { useQuery } from '@tanstack/react-query';
import { useLanguage } from './language-context';
import { MadaqLogoSmall } from './madaq-logo';
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

  return (
    <footer className="bg-[#1a1a1a] dark:bg-[#111]">
      <div className="max-w-5xl mx-auto px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MadaqLogoSmall size={28} />
            <span className="text-sm font-semibold text-white">{name || 'مضيق'}</span>
          </div>
          <p className="text-xs text-[#d4af37]/60">
            {language === 'ar' ? 'مدعوم من Madaq' : 'Powered by Madaq'}
          </p>
        </div>
      </div>
    </footer>
  );
}
