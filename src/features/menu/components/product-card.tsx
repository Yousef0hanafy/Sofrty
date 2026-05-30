'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from './language-context';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { language } = useLanguage();

  const name = language === 'ar' ? product.nameAr : product.nameEn;
  const imageUrl = product.imageUrl;

  // Starting price from cheapest variant
  const minPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => v.price))
    : 0;

  const priceLabel = language === 'ar'
    ? `من ${minPrice} ر.س`
    : `From ${minPrice} SAR`;

  // Parse tags
  const tags = product.tags
    ? product.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      className="menu-card w-full text-start bg-card border border-border/60 rounded-xl p-3 flex gap-3 items-center cursor-pointer"
    >
      {/* Image */}
      <div className="shrink-0 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-lg overflow-hidden bg-secondary relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="120px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg className="size-8 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
          {name}
        </h3>

        <p className="text-primary font-bold text-sm">
          {priceLabel}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
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
    </button>
  );
}
