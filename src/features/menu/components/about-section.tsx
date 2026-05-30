'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from './language-context';
import { MadaqLogo } from './madaq-logo';
import { Clock, MapPin, Star, Heart, Users, Award } from 'lucide-react';
import type { Restaurant, ApiResponse } from '@/types';

export function AboutSection() {
  const { language } = useLanguage();

  const { data: response } = useQuery<ApiResponse<Restaurant>>({
    queryKey: ['restaurant'],
    queryFn: () => fetch('/api/restaurant').then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const restaurant = response?.data;
  const name = language === 'ar' ? restaurant?.nameAr : restaurant?.nameEn;
  const description = language === 'ar' ? restaurant?.descriptionAr : restaurant?.descriptionEn;

  const features = language === 'ar'
    ? [
        { icon: Star, title: 'جودة عالية', desc: 'نستخدم أجود المكونات الطازجة لضمان أفضل تجربة طعام' },
        { icon: Heart, title: 'طبخ بحب', desc: 'كل طبق يُحضر بعناية فائقة وشغف حقيقي' },
        { icon: Users, title: 'ضيافة استثنائية', desc: 'نوفر أجواء دافئة وخدمة لا تُنسى لجميع عملائنا' },
        { icon: Award, title: 'خبرة مميزة', desc: 'أكثر من 15 عاماً من الخبرة في فن الطبخ العربي' },
      ]
    : [
        { icon: Star, title: 'Premium Quality', desc: 'We use the finest fresh ingredients for the best dining experience' },
        { icon: Heart, title: 'Cooked with Love', desc: 'Every dish is prepared with utmost care and genuine passion' },
        { icon: Users, title: 'Exceptional Service', desc: 'We provide a warm atmosphere and unforgettable service' },
        { icon: Award, title: 'Expert Experience', desc: 'Over 15 years of expertise in Arabic culinary arts' },
      ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-[#3e2723] to-[#5d4037] p-6 sm:p-10"
      >
        {/* Decorative gold corners */}
        <div className="absolute top-0 start-0 w-16 h-16 border-t-2 border-s-2 border-[#d4af37]/40 rounded-tl-2xl" />
        <div className="absolute bottom-0 end-0 w-16 h-16 border-b-2 border-e-2 border-[#d4af37]/40 rounded-br-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full bg-white/10 backdrop-blur-sm border-2 border-[#d4af37]/40 flex items-center justify-center overflow-hidden">
            <MadaqLogo size={100} />
          </div>
          <div className="text-center sm:text-start">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{name || 'Madaq'}</h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-lg">
              {description || (language === 'ar'
                ? 'مضيق - وجهتكم المفضلة لأشهى الأطباق العربية التقليدية المعدة بأجود المكونات'
                : 'Madaq - Your favorite destination for the finest traditional Arabic dishes prepared with premium ingredients')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-card border border-border/40 rounded-2xl p-5 flex gap-4 items-start shadow-sm"
          >
            <div className="shrink-0 w-11 h-11 rounded-xl bg-[#3e2723]/10 flex items-center justify-center">
              <feature.icon className="size-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-bold text-base text-foreground mb-4 text-center">
          {language === 'ar' ? 'معلومات سريعة' : 'Quick Info'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 justify-center p-3 rounded-xl bg-secondary/50">
            <Clock className="size-5 text-[#3e2723]" />
            <div>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</p>
              <p className="text-sm font-semibold text-foreground">{language === 'ar' ? '12:00 م - 2:00 ص' : '12:00 PM - 2:00 AM'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center p-3 rounded-xl bg-secondary/50">
            <MapPin className="size-5 text-[#3e2723]" />
            <div>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'الموقع' : 'Location'}</p>
              <p className="text-sm font-semibold text-foreground">{language === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center p-3 rounded-xl bg-secondary/50">
            <Star className="size-5 text-[#d4af37]" />
            <div>
              <p className="text-xs text-muted-foreground">{language === 'ar' ? 'التقييم' : 'Rating'}</p>
              <p className="text-sm font-semibold text-foreground">{language === 'ar' ? '4.8 / 5.0 ⭐' : '4.8 / 5.0 ⭐'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
