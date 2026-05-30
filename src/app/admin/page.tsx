'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useAppStore } from '@/store/app-store';
import { AdminPage as AdminDashboard } from '@/features/admin/components/admin-page';
import { LanguageProvider } from '@/features/menu/components/language-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Lock, Eye, EyeOff, ArrowRight, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const ADMIN_SESSION_KEY = 'madaq-admin-auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

// Using useSyncExternalStore to avoid setState-in-useEffect lint error
const emptySubscribe = () => () => {};

function useAdminAuth() {
  const session = useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem(ADMIN_SESSION_KEY),
    () => null
  );
  return !!session;
}

function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { language, toggleLanguage } = useAppStore();
  const isRTL = language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();

      if (json.success) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, json.data.token);
        onLogin();
      } else {
        setError(isRTL ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
      }
    } catch {
      setError(isRTL ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar with language toggle */}
      <div className="flex justify-end p-3">
        <button
          onClick={toggleLanguage}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isRTL ? 'English' : 'عربي'}
        </button>
      </div>

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <ChefHat className="size-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold">
              {isRTL ? 'مضيق' : 'Madaq'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isRTL ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute top-1/2 start-3 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                autoFocus
                className="w-full h-11 ps-10 pe-10 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 end-3 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-destructive text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {isRTL ? 'دخول' : 'Sign In'}
                  <ArrowRight className={`size-4 ${isRTL ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-muted-foreground text-center mt-6">
            {isRTL ? 'استخدم كلمة المرور المحددة بواسطة المسؤول' : 'Use the admin password set by your administrator'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminRoute() {
  const isAuthenticated = useAdminAuth();
  const mounted = useIsMounted();
  const [, forceUpdate] = useState(0);

  const handleLogin = () => {
    // Force re-render to pick up new sessionStorage value
    forceUpdate((c) => c + 1);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AdminLogin onLogin={handleLogin} />
        </LanguageProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AdminDashboard />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
