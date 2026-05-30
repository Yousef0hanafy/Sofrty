'use client';

import { motion } from 'framer-motion';
import { Instagram, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Restaurant, ApiResponse } from '@/types';

export function FloatingContactBar() {
  const { data: response } = useQuery<ApiResponse<Restaurant>>({
    queryKey: ['restaurant'],
    queryFn: () => fetch('/api/restaurant').then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const restaurant = response?.data;

  const links = [
    {
      icon: MessageCircle,
      href: restaurant?.whatsappNumber
        ? `https://wa.me/${restaurant.whatsappNumber.replace(/[^0-9]/g, '')}`
        : null,
      label: 'WhatsApp',
      color: 'hover:text-green-400',
    },
    {
      icon: Instagram,
      href: restaurant?.instagramUrl,
      label: 'Instagram',
      color: 'hover:text-pink-400',
    },
    {
      icon: MapPin,
      href: restaurant?.mapsUrl,
      label: 'Maps',
      color: 'hover:text-red-400',
    },
    {
      icon: Phone,
      href: restaurant?.whatsappNumber
        ? `tel:${restaurant.whatsappNumber}`
        : null,
      label: 'Phone',
      color: 'hover:text-[#d4af37]',
    },
  ];

  const availableLinks = links.filter((l) => l.href);

  if (availableLinks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.5, ease: 'easeOut' }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30"
    >
      <div className="flex items-center gap-1 bg-[#3e2723]/95 backdrop-blur-xl rounded-2xl border border-[#d4af37]/15 shadow-2xl shadow-black/30 px-2 py-2">
        {availableLinks.map((link) => (
          <a
            key={link.label}
            href={link.href!}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-10 h-10 rounded-xl text-white/70 transition-all duration-200 ${link.color} hover:bg-white/10`}
            aria-label={link.label}
          >
            <link.icon className="size-[18px]" />
          </a>
        ))}
      </div>
    </motion.div>
  );
}
