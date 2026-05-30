'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Upload, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/store/app-store'
import type { Restaurant } from '@/types'

const restaurantSchema = z.object({
  nameAr: z.string().min(1, 'الاسم العربي مطلوب'),
  nameEn: z.string().min(1, 'English name is required'),
  descriptionAr: z.string().optional().default(''),
  descriptionEn: z.string().optional().default(''),
  heroImage: z.string().optional().default(''),
  instagramUrl: z.string().optional().default(''),
  whatsappNumber: z.string().optional().default(''),
  mapsUrl: z.string().optional().default(''),
  primaryColor: z.string().optional().default('#c8a96e'),
})

type RestaurantFormData = z.infer<typeof restaurantSchema>

export function RestaurantSettings() {
  const { language } = useAppStore()
  const isRTL = language === 'ar'
  const queryClient = useQueryClient()

  const { data: restaurant, isLoading } = useQuery<Restaurant>({
    queryKey: ['restaurant'],
    queryFn: async () => {
      const res = await fetch('/api/restaurant')
      const json = await res.json()
      return json.data
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: RestaurantFormData) => {
      const res = await fetch('/api/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] })
      toast.success(isRTL ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully')
    },
    onError: (error) => {
      toast.error(error.message || (isRTL ? 'فشل في حفظ الإعدادات' : 'Failed to save settings'))
    },
  })

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      heroImage: '',
      instagramUrl: '',
      whatsappNumber: '',
      mapsUrl: '',
      primaryColor: '#c8a96e',
    },
    values: restaurant
      ? {
          nameAr: restaurant.nameAr || '',
          nameEn: restaurant.nameEn || '',
          descriptionAr: restaurant.descriptionAr || '',
          descriptionEn: restaurant.descriptionEn || '',
          heroImage: restaurant.heroImage || '',
          instagramUrl: restaurant.instagramUrl || '',
          whatsappNumber: restaurant.whatsappNumber || '',
          mapsUrl: restaurant.mapsUrl || '',
          primaryColor: restaurant.primaryColor || '#c8a96e',
        }
      : undefined,
  })

  function onSubmit(data: RestaurantFormData) {
    saveMutation.mutate(data)
  }

  function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.url) {
          form.setValue('heroImage', json.data.url)
          toast.success(isRTL ? 'تم رفع الصورة' : 'Image uploaded')
        } else {
          toast.error(json.error || (isRTL ? 'فشل في رفع الصورة' : 'Upload failed'))
        }
      })
      .catch(() => {
        toast.error(isRTL ? 'فشل في رفع الصورة' : 'Upload failed')
      })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          {isRTL ? 'إعدادات المطعم' : 'Restaurant Settings'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isRTL ? 'إدارة معلومات المطعم الأساسية' : 'Manage basic restaurant information'}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        {/* Restaurant Name */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{isRTL ? 'اسم المطعم' : 'Restaurant Name'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r-nameAr">{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
                <Input
                  id="r-nameAr"
                  placeholder={isRTL ? 'مضيق' : 'مضيق'}
                  {...form.register('nameAr')}
                />
                {form.formState.errors.nameAr && (
                  <p className="text-xs text-destructive">{form.formState.errors.nameAr.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-nameEn">{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
                <Input
                  id="r-nameEn"
                  placeholder="Madaq"
                  {...form.register('nameEn')}
                />
                {form.formState.errors.nameEn && (
                  <p className="text-xs text-destructive">{form.formState.errors.nameEn.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{isRTL ? 'الوصف' : 'Description'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="r-descAr">{isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
              <Textarea
                id="r-descAr"
                rows={3}
                placeholder={isRTL ? 'وصف المطعم بالعربي' : 'Restaurant description in Arabic'}
                {...form.register('descriptionAr')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-descEn">{isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
              <Textarea
                id="r-descEn"
                rows={3}
                placeholder="Restaurant description in English"
                {...form.register('descriptionEn')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Hero Image */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{isRTL ? 'صورة الغلاف' : 'Hero Image'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.watch('heroImage') ? (
              <div className="relative rounded-lg overflow-hidden border">
                <img
                  src={form.watch('heroImage')}
                  alt="Hero"
                  className="h-40 w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-sm">{isRTL ? 'لا توجد صورة' : 'No image'}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Input
                placeholder={isRTL ? 'رابط الصورة' : 'Image URL'}
                {...form.register('heroImage')}
                className="flex-1"
              />
              <label className="cursor-pointer">
                <Button type="button" variant="outline" className="gap-2" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    {isRTL ? 'رفع' : 'Upload'}
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleHeroImageUpload}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{isRTL ? 'روابط التواصل' : 'Social Links'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="r-instagram">Instagram URL</Label>
              <Input
                id="r-instagram"
                placeholder="https://instagram.com/madaq"
                dir="ltr"
                {...form.register('instagramUrl')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-whatsapp">{isRTL ? 'رقم واتساب' : 'WhatsApp Number'}</Label>
              <Input
                id="r-whatsapp"
                placeholder="+966XXXXXXXXX"
                dir="ltr"
                {...form.register('whatsappNumber')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-maps">{isRTL ? 'رابط الخريطة' : 'Maps URL'}</Label>
              <Input
                id="r-maps"
                placeholder="https://maps.google.com/..."
                dir="ltr"
                {...form.register('mapsUrl')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{isRTL ? 'المظهر' : 'Appearance'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Label htmlFor="r-color">{isRTL ? 'اللون الأساسي' : 'Primary Color'}</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="r-color"
                  value={form.watch('primaryColor') || '#c8a96e'}
                  onChange={(e) => form.setValue('primaryColor', e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded border"
                />
                <Input
                  className="w-28 font-mono"
                  value={form.watch('primaryColor') || '#c8a96e'}
                  onChange={(e) => form.setValue('primaryColor', e.target.value)}
                  dir="ltr"
                  placeholder="#c8a96e"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="gap-2 min-w-32"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <>
                <Save className="h-4 w-4 animate-spin" />
                {isRTL ? 'جاري الحفظ...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isRTL ? 'حفظ الإعدادات' : 'Save Settings'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
