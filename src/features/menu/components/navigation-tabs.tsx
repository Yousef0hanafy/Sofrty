'use client';

import { useState } from 'react';
import { useLanguage } from './language-context';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Info, Sparkles } from 'lucide-react';

const tabs = [
  { key: 'menu', labelAr: 'القائمة', labelEn: 'Menu', icon: UtensilsCrossed },
  { key: 'about', labelAr: 'عن المطعم', labelEn: 'About', icon: Info },
  { key: 'services', labelAr: 'الخدمات', labelEn: 'Services', icon: Sparkles },
];

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const { language } = useLanguage();

  return (
    <div className="bg-white sticky top-0 z-20 shadow-sm border-b border-[#e8dcc8]/60">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center">
          {tabs.map((tab) => {
            const label = language === 'ar' ? tab.labelAr : tab.labelEn;
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-[#3e2723]'
                    : 'text-[#5d4037]/50 hover:text-[#5d4037]/80'
                )}
              >
                <Icon className="size-3.5" />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#d4af37] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
