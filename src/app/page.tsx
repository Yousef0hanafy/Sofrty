'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/features/menu/components/language-context';
import { HeroSection } from '@/features/menu/components/hero-section';
import { CategoryBar } from '@/features/menu/components/category-bar';
import { ProductGrid } from '@/features/menu/components/product-grid';
import { ProductModal } from '@/features/menu/components/product-modal';
import { FloatingContactBar } from '@/features/menu/components/floating-contact-bar';
import { AdminPage } from '@/features/admin/components/admin-page';
import { useAppStore } from '@/store/app-store';
import { useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Moon, Sun, Languages } from 'lucide-react';
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
    </div>
  );
}

function AdminFab() {
  const { isAdmin, toggleAdmin } = useAppStore();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleAdmin}
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-primary/90 text-primary-foreground shadow-lg hover:bg-primary transition-colors text-xs font-medium"
      aria-label="Admin Dashboard"
    >
      <Shield className="size-3.5" />
      <span>{isAdmin ? 'القائمة' : 'الإدارة'}</span>
    </motion.button>
  );
}

function ClientMenuView() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <TopBar />
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
        <div className="h-20" />
      </div>
      <FloatingContactBar />
      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
      />
      <AdminFab />
    </>
  );
}

export default function Home() {
  const { isAdmin } = useAppStore();
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
        <AnimatePresence mode="wait">
          {isAdmin ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <AdminPage />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ClientMenuView />
            </motion.div>
          )}
        </AnimatePresence>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
