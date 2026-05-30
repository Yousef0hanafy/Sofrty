'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronDown, ChevronUp, Info, Truck, AlertTriangle, Clock, MapPin, Phone, Instagram } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from './language-context';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const name = language === 'ar' ? product.nameAr : product.nameEn;
  const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;
  const imageUrl = product.imageUrl;

  // Get first variant's calories (or lowest)
  const calories = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => v.calories))
    : 0;

  // Get price range
  const minPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => v.price))
    : 0;
  const maxPrice = product.variants.length > 0
    ? Math.max(...product.variants.map((v) => v.price))
    : 0;

  const priceText = language === 'ar'
    ? minPrice === maxPrice ? `${minPrice} ر.س` : `${minPrice} - ${maxPrice} ر.س`
    : minPrice === maxPrice ? `${minPrice} SAR` : `${minPrice} - ${maxPrice} SAR`;

  // Parse tags
  const tags = product.tags
    ? product.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      className="menu-card w-full text-start bg-card border border-border/40 rounded-2xl overflow-hidden cursor-pointer group"
    >
      <div className="flex gap-3 p-3">
        {/* Image */}
        <div className="shrink-0 w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-xl overflow-hidden bg-secondary/50 relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="100px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg className="size-6 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm sm:text-[15px] text-foreground leading-tight">
              {name}
            </h3>

            {/* Description (always visible, truncated) */}
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            )}

            {/* Tags */}
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
              <Flame className="size-3 text-orange-400" />
              <span>
                {calories > 0 ? (
                  <>
                    {calories} {language === 'ar' ? 'سعرة حرارية' : 'cal'}
                  </>
                ) : (
                  language === 'ar' ? '---' : '---'
                )}
              </span>
            </div>

            {minPrice > 0 && (
              <span className="text-xs font-semibold text-primary">
                {priceText}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
