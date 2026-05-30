'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/features/menu/components/language-context';
import { HeroSection } from '@/features/menu/components/hero-section';
import { NavigationTabs } from '@/features/menu/components/navigation-tabs';
import { CategoryBar } from '@/features/menu/components/category-bar';
import { ProductGrid } from '@/features/menu/components/product-grid';
import { ProductModal } from '@/features/menu/components/product-modal';
import { AboutSection } from '@/features/menu/components/about-section';
import { ServicesSection } from '@/features/menu/components/services-section';
import { FloatingContactBar } from '@/features/menu/components/floating-contact-bar';
import { Footer } from '@/features/menu/components/footer';
import { useState, useSyncExternalStore } from 'react';
import type { Product } from '@/types';

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

export default function Home() {
  const [activeTab, setActiveTab] = useState('menu');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const mounted = useIsMounted();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'menu') {
      setActiveCategoryId(null);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Hero Section */}
          <HeroSection />

          {/* Sticky Navigation Tabs */}
          <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Main Content - switches based on active tab */}
          <main className="flex-1">
            {activeTab === 'menu' && (
              <>
                <CategoryBar
                  activeCategoryId={activeCategoryId}
                  onSelectCategory={setActiveCategoryId}
                />
                <ProductGrid
                  categoryId={activeCategoryId}
                  onProductClick={setSelectedProduct}
                />
              </>
            )}
            {activeTab === 'about' && (
              <AboutSection />
            )}
            {activeTab === 'services' && (
              <ServicesSection />
            )}
          </main>

          {/* Footer */}
          <Footer />
        </div>

        {/* Floating Contact Bar */}
        <FloatingContactBar />

        {/* Product Detail Modal */}
        <ProductModal
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => {
            if (!open) setSelectedProduct(null);
          }}
        />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
