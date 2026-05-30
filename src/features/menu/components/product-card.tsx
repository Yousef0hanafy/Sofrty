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
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(product)}
      className="menu-card w-full text-start bg-card border border-border/40 rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
    >
      <div className="flex flex-col items-center p-4 gap-3">
        {/* Circle image */}
        <div className="relative w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full overflow-hidden border-2 border-[#d4af37]/20 shadow-sm group-hover:border-[#d4af37]/40 transition-all">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="80px"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/80">
              <UtensilsCrossed className="size-7 text-muted-foreground/20" />
            </div>
          )}
          {isPopular && (
            <div className="absolute top-0.5 start-0.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#3e2723] text-[#d4af37] shadow-sm">
                <Star className="size-2.5" />
              </span>
            </div>
          )}
          {isChefPick && (
            <div className="absolute top-0.5 end-0.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#d4af37] text-white shadow-sm">
                <Star className="size-2.5" />
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="w-full space-y-1 text-center">
          <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1">
            {name}
          </h3>

          {description && (
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
              {description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex gap-1 justify-center flex-wrap pt-0.5">
              {tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-normal rounded-full"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-1">
            {minPrice > 0 && (
              <span className="text-xs font-bold text-[#3e2723] dark:text-[#d4af37]">
                {priceText}
              </span>
            )}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Flame className="size-3 text-[#d4af37]" />
              <span>
                {calories > 0 ? `${calories} ${language === 'ar' ? 'سعرة' : 'cal'}` : '---'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
