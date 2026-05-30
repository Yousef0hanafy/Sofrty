'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, MapPin, Phone } from 'lucide-react';
import { useLanguage } from './language-context';
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
    <section className="relative w-full">
      {/* Hero image container */}
      <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden bg-gradient-to-b from-[#f5efe6] to-[#e8dcc8]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={name || 'Restaurant'}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : null}

        {/* Light overlay when no hero image */}
        {!heroImage && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5efe6]/90 via-[#ede4d3]/80 to-[#e8dcc8]/90" />
        )}

        {/* Centered content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
          {/* Logo — transparent background logo in elegant circle */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] rounded-full flex items-center justify-center overflow-hidden shadow-lg shadow-black/10 border-2 border-[#d4af37]/40 bg-white/50 backdrop-blur-sm">
              <Image
                src="/madaq-logo.png"
                alt="Madaq"
                fill
                priority
                className="object-contain p-5"
                sizes="130px"
              />
            </div>
          </motion.div>

          {/* Restaurant name */}
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3e2723] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] tracking-wide"
          >
            {name || 'Madaq'}
          </motion.h1>

          {/* Gold decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-20 h-[2px] bg-[#d4af37]/80 rounded-full"
          />

          {/* Tagline */}
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="text-[#5d4037]/70 text-xs sm:text-sm font-light tracking-wider"
          >
            {language === 'ar' ? 'تجربة طعام استثنائية' : 'An Exceptional Dining Experience'}
          </motion.p>

          {/* Social media links */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="flex items-center gap-3 mt-1"
          >
            {restaurant?.instagramUrl && (
              <a
                href={restaurant.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/50 backdrop-blur-sm border border-[#3e2723]/15 hover:bg-[#d4af37]/15 hover:border-[#d4af37]/40 transition-all duration-200"
              >
                <Instagram className="size-4 text-[#3e2723]" />
              </a>
            )}
            {restaurant?.whatsappNumber && (
              <a
                href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/50 backdrop-blur-sm border border-[#3e2723]/15 hover:bg-[#d4af37]/15 hover:border-[#d4af37]/40 transition-all duration-200"
              >
                <Phone className="size-4 text-[#3e2723]" />
              </a>
            )}
            {restaurant?.mapsUrl && (
              <a
                href={restaurant.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/50 backdrop-blur-sm border border-[#3e2723]/15 hover:bg-[#d4af37]/15 hover:border-[#d4af37]/40 transition-all duration-200"
              >
                <MapPin className="size-4 text-[#3e2723]" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Bottom gradient fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#faf8f5] to-transparent" />
      </div>
    </section>
  );
}
