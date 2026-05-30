'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Flame, UtensilsCrossed, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from './language-context';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { language } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const name = language === 'ar' ? product.nameAr : product.nameEn;
  const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;
  const imageUrl = product.imageUrl;

  const calories = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => v.calories))
    : 0;

  const minPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => v.price))
    : 0;
  const maxPrice = product.variants.length > 0
    ? Math.max(...product.variants.map((v) => v.price))
    : 0;

  const priceText = language === 'ar'
    ? minPrice === maxPrice ? `${minPrice} ر.س` : `${minPrice} - ${maxPrice} ر.س`
    : minPrice === maxPrice ? `${minPrice} SAR` : `${minPrice} - ${maxPrice} SAR`;

  const tags = product.tags
    ? product.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const isPopular = tags.some(t =>
    t.includes('مبيعا') || t.includes('بيع') || t.includes('popular') || t.toLowerCase().includes('best')
  );

  const isChefPick = tags.some(t =>
    t.includes('شيف') || t.includes('chef') || t.includes('مميز')
  );

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(product)}
      className="menu-card w-full text-start bg-card border border-border/50 rounded-2xl overflow-hidden cursor-pointer group"
    >
      <div className="flex gap-3 p-3">
        {/* Image */}
        <div className="shrink-0 w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-xl overflow-hidden bg-secondary/50 relative">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="100px"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className="size-6 text-muted-foreground/20" />
            </div>
          )}
          {/* Popular badge on image */}
          {isPopular && (
            <div className="absolute top-1 start-1">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0a4d3a] text-[#d4af37]">
                <Star className="size-2.5" />
              </span>
            </div>
          )}
          {isChefPick && (
            <div className="absolute top-1 end-1">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#d4af37] text-white">
                <Star className="size-2.5" />
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm sm:text-[15px] text-foreground leading-tight">
              {name}
            </h3>

            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            )}

            {tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Bottom row: calories + price */}
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Flame className="size-3 text-[#d4af37]" />
              <span>
                {calories > 0 ? (
                  <>
                    {calories} {language === 'ar' ? 'سعرة' : 'cal'}
                  </>
                ) : (
                  '---'
                )}
              </span>
            </div>

            {minPrice > 0 && (
              <span className="text-xs font-bold text-[#0a4d3a] dark:text-[#d4af37]">
                {priceText}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
