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
  const description = language === 'ar' ? restaurant?.descriptionAr : restaurant?.descriptionEn;
  const heroImage = restaurant?.heroImage;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-[280px] md:h-[360px] overflow-hidden rounded-b-2xl"
    >
      {/* Background image */}
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
        <div className="max-w-lg space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight">
            {name || 'مضيق'}
          </h1>

          {description && (
            <p className="text-white/85 text-sm md:text-base leading-relaxed max-w-md">
              {description}
            </p>
          )}

          {/* Social links */}
          <div className="flex items-center gap-3 pt-1">
            {restaurant?.instagramUrl && (
              <a
                href={restaurant.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
            )}
            {restaurant?.whatsappNumber && (
              <a
                href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="size-4" />
              </a>
            )}
            {restaurant?.mapsUrl && (
              <a
                href={restaurant.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
                aria-label="Location"
              >
                <MapPin className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
