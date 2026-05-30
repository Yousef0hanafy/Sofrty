'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, MapPin, Phone } from 'lucide-react';
import { useLanguage } from './language-context';
import { MadaqLogo } from './madaq-logo';
import type { Restaurant, ApiResponse } from '@/types';

export function HeroSection() {
  const { language } = useLanguage();

  const { data: response } = useQuery<ApiResponse<Restaurant>>({
    queryKey: ['restaurant'],
    queryFn: () => fetch('/api/restaurant').then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const restaurant = response?.data;
  const name = language === 'ar' ? restaurant?.nameAr : restaurant?.nameEn;
  const heroImage = restaurant?.heroImage;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full"
    >
      {/* Full-width hero image */}
      <div className="relative w-full h-[340px] sm:h-[400px] md:h-[480px] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={name || 'Restaurant'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a4d3a] to-[#073d2e]" />
        )}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Centered content - logo, name, social links */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          {/* Circular Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-full p-[6px] bg-gradient-to-br from-[#d4af37] via-[#e8cc6e] to-[#d4af37] shadow-2xl">
              <div className="rounded-full overflow-hidden bg-[#0a4d3a]">
                <MadaqLogo size={110} className="sm:w-[130px] sm:h-[130px]" />
              </div>
            </div>
          </motion.div>

          {/* Restaurant name */}
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg tracking-wide"
          >
            {name || 'مضيق'}
          </motion.h1>

          {/* Gold decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-16 h-[1px] bg-[#d4af37]/70"
          />

          {/* Social media links */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center gap-3"
          >
            {restaurant?.instagramUrl && (
              <a
                href={restaurant.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all"
              >
                <Instagram className="size-4 text-white" />
              </a>
            )}
            {restaurant?.whatsappNumber && (
              <a
                href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all"
              >
                <Phone className="size-4 text-white" />
              </a>
            )}
            {restaurant?.mapsUrl && (
              <a
                href={restaurant.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all"
              >
                <MapPin className="size-4 text-white" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Bottom gradient fade into content */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f5f0e1] to-transparent dark:from-[#0d1117]" />
      </div>
    </motion.section>
  );
}
