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
      color: 'text-green-500',
    },
    {
      icon: Instagram,
      href: restaurant?.instagramUrl,
      label: 'Instagram',
      color: 'text-pink-500',
    },
    {
      icon: MapPin,
      href: restaurant?.mapsUrl,
      label: 'Maps',
      color: 'text-red-500',
    },
    {
      icon: Phone,
      href: restaurant?.whatsappNumber
        ? `tel:${restaurant.whatsappNumber}`
        : null,
      label: 'Phone',
      color: 'text-primary',
    },
  ];

  const availableLinks = links.filter((l) => l.href);

  if (availableLinks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 2, ease: 'easeOut' }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30"
    >
      <div className="flex items-center gap-1 bg-background/80 backdrop-blur-lg rounded-full border border-border/40 shadow-lg px-2 py-1.5 h-12">
        {availableLinks.map((link) => (
          <a
            key={link.label}
            href={link.href!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors"
            aria-label={link.label}
          >
            <link.icon className={`size-[18px] ${link.color}`} />
          </a>
        ))}
      </div>
    </motion.div>
  );
}
