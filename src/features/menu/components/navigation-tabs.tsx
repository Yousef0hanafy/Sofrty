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

export function NavigationTabs() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div className="bg-[#3e2723] sticky top-0 z-20 shadow-md shadow-[#3e2723]/20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center">
          {tabs.map((tab) => {
            const label = language === 'ar' ? tab.labelAr : tab.labelEn;
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-[#d4af37]'
                    : 'text-white/50 hover:text-white/80'
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
