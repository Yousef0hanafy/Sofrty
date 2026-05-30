'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { Flame, AlertTriangle } from 'lucide-react';
import { useLanguage } from './language-context';
import type { Product } from '@/types';

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductModal({ product, open, onOpenChange }: ProductModalProps) {
  const { language } = useLanguage();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<string>('0');

  // Reset variant selection when product changes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedVariantIndex('0');
    }
    onOpenChange(newOpen);
  };

  if (!product) return null;

  const name = language === 'ar' ? product.nameAr : product.nameEn;
  const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;
  const imageUrl = product.imageUrl;

  const selectedIndex = parseInt(selectedVariantIndex, 10);
  const selectedVariant = product.variants[selectedIndex] || product.variants[0];

  const priceText = language === 'ar'
    ? `${selectedVariant.price} ر.س`
    : `${selectedVariant.price} SAR`;

  const caloriesText = selectedVariant.calories
    ? `${selectedVariant.calories} ${language === 'ar' ? 'سعرة' : 'cal'}`
    : null;

  // Parse tags
  const tags = product.tags
    ? product.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  // Parse allergens
  const allergens = product.allergens
    ? product.allergens.split(',').map((a) => a.trim()).filter(Boolean)
    : [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto p-0 gap-0">
        {/* Image */}
        <div className="relative h-[240px] w-full rounded-t-lg overflow-hidden bg-secondary">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Flame className="size-12 opacity-20" />
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          <DialogHeader className="text-start gap-2">
            <DialogTitle className="text-xl font-bold leading-tight">
              {name}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {language === 'ar' ? 'اختر الحجم' : 'Choose size'}
              </p>
              <ToggleGroup
                type="single"
                value={selectedVariantIndex}
                onValueChange={(val) => {
                  if (val) setSelectedVariantIndex(val);
                }}
                className="w-full border border-border/60 rounded-lg overflow-hidden"
              >
                {product.variants.map((variant, idx) => (
                  <ToggleGroupItem
                    key={variant.id}
                    value={String(idx)}
                    className="flex-1 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    <span>{variant.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          <Separator />

          {/* Price and calories */}
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.span
                key={selectedVariant.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-2xl font-bold text-primary"
              >
                {priceText}
              </motion.span>
            </AnimatePresence>

            {caloriesText && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flame className="size-3.5 text-orange-400" />
                <span>{caloriesText}</span>
              </div>
            )}
          </div>

          {/* Allergens warning */}
          {allergens.length > 0 && (
            <>
              <Separator />
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3">
                <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-medium text-amber-700 dark:text-amber-300">
                    {language === 'ar' ? 'تحذير الحساسية' : 'Allergy Warning'}
                  </p>
                  <p className="text-amber-600/80 dark:text-amber-400/80">
                    {allergens.join(' • ')}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
