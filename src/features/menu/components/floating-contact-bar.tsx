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
      color: 'text-green-400',
    },
    {
      icon: Instagram,
      href: restaurant?.instagramUrl,
      label: 'Instagram',
      color: 'text-pink-400',
    },
    {
      icon: MapPin,
      href: restaurant?.mapsUrl,
      label: 'Maps',
      color: 'text-red-400',
    },
    {
      icon: Phone,
      href: restaurant?.whatsappNumber
        ? `tel:${restaurant.whatsappNumber}`
        : null,
      label: 'Phone',
      color: 'text-[#d4af37]',
    },
  ];

  const availableLinks = links.filter((l) => l.href);

  if (availableLinks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 1.5, ease: 'easeOut' }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30"
    >
      <div className="flex items-center gap-0.5 bg-[#3e2723]/95 backdrop-blur-lg rounded-2xl border border-[#d4af37]/20 shadow-lg px-1.5 py-1">
        {availableLinks.map((link) => (
          <a
            key={link.label}
            href={link.href!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-[#d4af37]/10 transition-colors"
            aria-label={link.label}
          >
            <link.icon className={`size-[18px] ${link.color}`} />
          </a>
        ))}
      </div>
    </motion.div>
  );
}
