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
      className="menu-card w-full text-start bg-card border border-border/40 rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
    >
      <div className="flex gap-3.5 p-3.5">
        {/* Product image */}
        <div className="shrink-0 w-[90px] h-[90px] sm:w-[105px] sm:h-[105px] rounded-xl overflow-hidden bg-secondary/60 relative">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="105px"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/80">
              <UtensilsCrossed className="size-7 text-muted-foreground/20" />
            </div>
          )}
          {isPopular && (
            <div className="absolute top-1.5 start-1.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3e2723] text-[#d4af37] shadow-sm">
                <Star className="size-3" />
              </span>
            </div>
          )}
          {isChefPick && (
            <div className="absolute top-1.5 end-1.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d4af37] text-white shadow-sm">
                <Star className="size-3" />
              </span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <h3 className="font-bold text-sm sm:text-[15px] text-foreground leading-tight">
              {name}
            </h3>

            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            )}

            {tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-0.5">
                {tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 font-normal rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/30">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Flame className="size-3.5 text-[#d4af37]" />
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
              <span className="text-sm font-bold text-[#3e2723] dark:text-[#d4af37] bg-[#3e2723]/5 dark:bg-[#d4af37]/10 px-2.5 py-0.5 rounded-full">
                {priceText}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
