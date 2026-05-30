'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './language-context';
import { HeroSection } from './hero-section';
import { CategoryBar } from './category-bar';
import { ProductGrid } from './product-grid';
import { ProductModal } from './product-modal';
import { FloatingContactBar } from './floating-contact-bar';
import type { Product } from '@/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function MenuContent() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <CategoryBar
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
      />
      <ProductGrid
        categoryId={activeCategoryId}
        onProductClick={setSelectedProduct}
      />
      <FloatingContactBar />
      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
      />
      {/* Bottom spacer for floating bar */}
      <div className="h-20" />
    </div>
  );
}

export function MenuPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <MenuContent />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
