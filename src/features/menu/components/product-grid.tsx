'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from './product-card';
import { useLanguage } from './language-context';
import { UtensilsCrossed } from 'lucide-react';
import type { Product, ApiResponse } from '@/types';

interface ProductGridProps {
  categoryId: string | null;
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ categoryId, onProductClick }: ProductGridProps) {
  const queryKey = categoryId ? ['products', categoryId] : ['products', 'all'];
  const { language } = useLanguage();

  const { data: response, isLoading } = useQuery<ApiResponse<Product[]>>({
    queryKey,
    queryFn: () => {
      const url = categoryId
        ? `/api/products?categoryId=${categoryId}`
        : '/api/products';
      return fetch(url).then((r) => r.json());
    },
    staleTime: 2 * 60 * 1000,
  });

  const products = response?.data ?? [];
  const isRTL = language === 'ar';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border/40 rounded-2xl p-3 flex gap-3 items-center"
              >
                <Skeleton className="shrink-0 w-[88px] h-[88px] rounded-xl" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary/50 mb-4">
              <UtensilsCrossed className="size-7 opacity-30" />
            </div>
            <p className="text-sm font-medium">
              {isRTL ? 'لا توجد منتجات في هذا القسم' : 'No products in this section'}
            </p>
            <p className="text-xs mt-1 opacity-60">
              {isRTL ? 'جرب تصفح قسم آخر' : 'Try browsing another category'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${categoryId ?? 'all'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: Math.min(index * 0.03, 0.3) }}
              >
                <ProductCard product={product} onClick={onProductClick} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
