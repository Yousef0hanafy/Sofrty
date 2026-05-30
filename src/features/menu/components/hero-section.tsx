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
    <section className="relative w-full">
      {/* Hero image container */}
      <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={name || 'Restaurant'}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#3e2723] to-[#2c1b10]" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/50" />

        {/* Centered content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full bg-white/10 backdrop-blur-md border-2 border-[#d4af37]/50 flex items-center justify-center overflow-hidden shadow-xl shadow-black/20">
              <MadaqLogo size={110} priority />
            </div>
          </motion.div>

          {/* Restaurant name */}
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide"
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
            className="text-white/80 text-xs sm:text-sm font-light tracking-wider"
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
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-[#d4af37]/25 hover:border-[#d4af37]/50 transition-all duration-200"
              >
                <Instagram className="size-4 text-white" />
              </a>
            )}
            {restaurant?.whatsappNumber && (
              <a
                href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-[#d4af37]/25 hover:border-[#d4af37]/50 transition-all duration-200"
              >
                <Phone className="size-4 text-white" />
              </a>
            )}
            {restaurant?.mapsUrl && (
              <a
                href={restaurant.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-[#d4af37]/25 hover:border-[#d4af37]/50 transition-all duration-200"
              >
                <MapPin className="size-4 text-white" />
              </a>
            )}
          </motion.div>
        </div>

        {/* Bottom gradient fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
}
