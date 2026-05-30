'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, MapPin, Phone, Truck, ExternalLink } from 'lucide-react';
import { useLanguage } from './language-context';
import type { Restaurant, ApiResponse } from '@/types';

const deliveryPlatforms = [
  {
    key: 'jahez',
    nameAr: 'جاهز',
    nameEn: 'Jahez',
    color: '#d32f2f',
    icon: '🛵',
  },
  {
    key: 'hungerstation',
    nameAr: 'هنقرستيشن',
    nameEn: 'HungerStation',
    color: '#ff6f00',
    icon: '🏪',
  },
  {
    key: 'mrsool',
    nameAr: 'مرسول',
    nameEn: 'Mrsool',
    color: '#1976d2',
    icon: '📦',
  },
  {
    key: 'thechefz',
    nameAr: 'ذا شيفز',
    nameEn: 'TheChefz',
    color: '#7b1fa2',
    icon: '👨‍🍳',
  },
];

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
      transition={{ duration: 0.5 }}
      className="relative w-full"
    >
      {/* Hero Image with overlay text */}
      {heroImage && (
        <div className="relative w-full h-[260px] md:h-[340px] overflow-hidden">
          <Image
            src={heroImage}
            alt={name || 'Restaurant'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark gradient overlay - strong at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

          {/* Text overlay ON the image */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
            <div className="max-w-5xl mx-auto space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-lg">
                {name || 'مضيق'}
              </h1>
              {description && (
                <p className="text-sm text-white/80 leading-relaxed max-w-lg drop-shadow">
                  {description}
                </p>
              )}

              {/* Social links row - on image */}
              <div className="flex items-center gap-2 pt-1">
                {restaurant?.instagramUrl && (
                  <a
                    href={restaurant.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/25 transition-colors border border-white/10"
                  >
                    <Instagram className="size-3.5" />
                    <span>Instagram</span>
                  </a>
                )}
                {restaurant?.whatsappNumber && (
                  <a
                    href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/25 transition-colors border border-white/10"
                  >
                    <Phone className="size-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {restaurant?.mapsUrl && (
                  <a
                    href={restaurant.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/25 transition-colors border border-white/10"
                  >
                    <MapPin className="size-3.5" />
                    <span>{language === 'ar' ? 'الموقع' : 'Location'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content below image (for when there's no hero image) */}
      {!heroImage && (
        <div className="pt-6 pb-2 px-5 max-w-5xl mx-auto">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {name || 'مضيق'}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-lg">
                  {description}
                </p>
              )}
            </div>

            {/* Social links for no-hero case */}
            <div className="flex items-center gap-2">
              {restaurant?.instagramUrl && (
                <a
                  href={restaurant.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Instagram className="size-3.5" />
                  <span>Instagram</span>
                </a>
              )}
              {restaurant?.whatsappNumber && (
                <a
                  href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Phone className="size-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
              {restaurant?.mapsUrl && (
                <a
                  href={restaurant.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  <MapPin className="size-3.5" />
                  <span>{language === 'ar' ? 'الموقع' : 'Location'}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delivery platforms section */}
      <div className="px-5 pt-3 pb-1 max-w-5xl mx-auto">
        <div className="flex items-center gap-1.5 mb-2">
          <Truck className="size-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            {language === 'ar' ? 'التوصيل' : 'Delivery'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {deliveryPlatforms.map((platform) => (
            <a
              key={platform.key}
              href="#"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-xs font-medium text-foreground hover:bg-secondary/50 transition-colors"
            >
              <span>{platform.icon}</span>
              <span>{language === 'ar' ? platform.nameAr : platform.nameEn}</span>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
