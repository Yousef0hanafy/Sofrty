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
import { Flame, AlertTriangle, X, Info } from 'lucide-react';
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
    ? `${selectedVariant.calories} ${language === 'ar' ? 'سعرة حرارية' : 'calories'}`
    : null;

  const tags = product.tags
    ? product.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const allergens = product.allergens
    ? product.allergens.split(',').map((a) => a.trim()).filter(Boolean)
    : [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-2xl">
        {/* Image */}
        <div className="relative h-[220px] w-full overflow-hidden bg-secondary/50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 448px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Flame className="size-10 opacity-20" />
            </div>
          )}
          {/* Close button overlay */}
          <button
            onClick={() => handleOpenChange(false)}
            className="absolute top-3 end-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <DialogHeader className="text-start gap-1 p-0">
            <DialogTitle className="text-lg font-bold leading-tight">
              {name}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
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
              <p className="text-xs font-medium text-muted-foreground">
                {language === 'ar' ? 'اختر الحجم' : 'Choose size'}
              </p>
              <ToggleGroup
                type="single"
                value={selectedVariantIndex}
                onValueChange={(val) => {
                  if (val) setSelectedVariantIndex(val);
                }}
                className="w-full border border-border/50 rounded-xl overflow-hidden bg-muted/30"
              >
                {product.variants.map((variant, idx) => (
                  <ToggleGroupItem
                    key={variant.id}
                    value={String(idx)}
                    className="flex-1 py-2.5 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-none"
                  >
                    <span className="font-medium">{variant.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          <Separator className="opacity-50" />

          {/* Price and calories - prominent */}
          <div className="flex items-end justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVariant.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    {priceText}
                  </span>
                </div>
                {caloriesText && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="size-3.5 text-orange-400" />
                    <span>{caloriesText}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Allergens warning */}
          {allergens.length > 0 && (
            <>
              <Separator className="opacity-50" />
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 p-3.5">
                <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-amber-700 dark:text-amber-300">
                    {language === 'ar' ? 'مسببات حساسية' : 'Allergens'}
                  </p>
                  <p className="text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
                    {allergens.join(' • ')}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* No allergens */}
          {allergens.length === 0 && product.allergens && (
            <>
              <Separator className="opacity-50" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="size-3.5" />
                <span>{language === 'ar' ? 'مسببات حساسية: ( لا يوجد )' : 'Allergens: ( None )'}</span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
