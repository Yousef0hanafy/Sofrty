'use client';

import { useState } from 'react';
import { useLanguage } from './language-context';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const tabs = [
  { key: 'menu', labelAr: 'القائمة', labelEn: 'Menu' },
  { key: 'about', labelAr: 'عن المطعم', labelEn: 'About' },
  { key: 'services', labelAr: 'الخدمات', labelEn: 'Services' },
];

export function NavigationTabs() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div className="bg-[#3e2723] dark:bg-[#2c1b10]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center gap-1">
          {tabs.map((tab) => {
            const label = language === 'ar' ? tab.labelAr : tab.labelEn;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'relative px-5 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-[#d4af37]'
                    : 'text-white/60 hover:text-white/90'
                )}
              >
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4af37]"
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
