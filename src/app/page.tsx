'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/features/menu/components/language-context';
import { HeroSection } from '@/features/menu/components/hero-section';
import { CategoryBar } from '@/features/menu/components/category-bar';
import { ProductGrid } from '@/features/menu/components/product-grid';
import { ProductModal } from '@/features/menu/components/product-modal';
import { FloatingContactBar } from '@/features/menu/components/floating-contact-bar';
import { Footer } from '@/features/menu/components/footer';
import { useAppStore } from '@/store/app-store';
import { useState, useSyncExternalStore } from 'react';
import { Moon, Sun, Languages, Shield } from 'lucide-react';
import { useTheme } from 'next-themes';
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

function TopBar() {
  const { language, toggleLanguage } = useAppStore();
  const { theme, setTheme } = useTheme();
  const isRTL = language === 'ar';

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-background/80 backdrop-blur-lg rounded-full border border-border/40 shadow-sm px-1.5 py-1">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary transition-colors"
        aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark' ? (
          <Sun className="size-3.5 text-amber-400" />
        ) : (
          <Moon className="size-3.5 text-slate-600" />
        )}
      </button>

      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1 h-8 px-2.5 rounded-full hover:bg-secondary transition-colors text-xs font-medium"
        aria-label="Toggle language"
      >
        <Languages className="size-3.5" />
        <span>{isRTL ? 'EN' : 'عربي'}</span>
      </button>

      {/* Admin link - subtle, non-intrusive */}
      <a
        href="/admin"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary transition-colors"
        aria-label="Admin Dashboard"
        title="Admin"
      >
        <Shield className="size-3.5 text-muted-foreground" />
      </a>
    </div>
  );
}

export default function Home() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TopBar />
        <div className="min-h-screen bg-background flex flex-col">
          <HeroSection />
          <CategoryBar
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
          />
          <ProductGrid
            categoryId={activeCategoryId}
            onProductClick={setSelectedProduct}
          />
          <div className="flex-1" />
          <Footer />
        </div>
        <FloatingContactBar />
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
