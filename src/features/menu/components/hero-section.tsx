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
      {/* Hero Image */}
      {heroImage && (
        <div className="relative w-full h-[200px] md:h-[280px] overflow-hidden">
          <Image
            src={heroImage}
            alt={name || 'Restaurant'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </div>
      )}

      {/* Content */}
      <div className={`relative ${heroImage ? '-mt-24' : 'pt-6'} pb-2 px-5 max-w-5xl mx-auto`}>
        <div className="space-y-4">
          {/* Restaurant name */}
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

          {/* Social links row */}
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
              <>
                <a
                  href={`https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Phone className="size-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${restaurant.whatsappNumber}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Phone className="size-3.5" />
                  <span>{language === 'ar' ? 'اتصال' : 'Call'}</span>
                </a>
              </>
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

          {/* Delivery platforms */}
          <div>
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
        </div>
      </div>
    </motion.section>
  );
}
