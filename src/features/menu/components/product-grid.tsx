'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from './product-card';
import type { Product, ApiResponse } from '@/types';

interface ProductGridProps {
  categoryId: string | null;
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ categoryId, onProductClick }: ProductGridProps) {
  const queryKey = categoryId ? ['products', categoryId] : ['products', 'all'];

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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border/60 rounded-xl p-3 flex gap-3 items-center"
              >
                <Skeleton className="shrink-0 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-lg" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-5 w-1/3" />
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
            className="flex flex-col items-center justify-center py-16 text-muted-foreground"
          >
            <svg className="size-12 mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12" />
            </svg>
            <p className="text-sm">لا توجد منتجات في هذا القسم</p>
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${categoryId ?? 'all'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.4) }}
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
