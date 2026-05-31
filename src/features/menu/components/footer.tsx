'use client';

import { useQuery } from '@tanstack/react-query';
import { useLanguage } from './language-context';
import { MadaqLogoSmall } from './madaq-logo';
import { Instagram, MapPin, Phone, MessageCircle } from 'lucide-react';
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
    <footer className="bg-[#3e2723] mt-auto">
      {/* Top gold line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />

      <div className="max-w-5xl mx-auto px-5 py-6">
        {/* Brand row */}
        <div className="flex items-center justify-center mb-5">
          <span className="text-lg font-bold text-white">{name || 'Madaq'}</span>
        </div>
        {/* Contact icons row */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {restaurant?.whatsappNumber && (
            <a
              href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/15 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all"
            >
              <MessageCircle className="size-4 text-[#d4af37]" />
            </a>
          )}
          {restaurant?.instagramUrl && (
            <a
              href={restaurant.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/15 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all"
            >
              <Instagram className="size-4 text-white" />
            </a>
          )}
          {restaurant?.mapsUrl && (
            <a
              href={restaurant.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/15 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all"
            >
              <MapPin className="size-4 text-white" />
            </a>
          )}
          {restaurant?.whatsappNumber && (
            <a
              href={`tel:${restaurant.whatsappNumber}`}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/15 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all"
            >
              <Phone className="size-4 text-white" />
            </a>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-4" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-white/40">
            {language === 'ar'
              ? '© 2026 مضيق - جميع الحقوق محفوظة'
              : '© 2026 Madaq - All Rights Reserved'}
          </p>
          <p className="text-[10px] text-[#d4af37]/40 mt-1">
            {language === 'ar' ? 'مدعوم من Madaq' : 'Powered by Madaq'}
          </p>
        </div>
      </div>
    </footer>
  );
}
