'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, FolderOpen, Layers, Plus, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/app-store'
import type { AdminSection } from './admin-layout'
import type { Product, Category } from '@/types'

interface AdminDashboardProps {
  onNavigate: (section: AdminSection) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { language } = useAppStore()
  const isRTL = language === 'ar'

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      const json = await res.json()
      return json.data || []
    },
  })

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const res = await fetch('/api/products?all=true')
      const json = await res.json()
      return json.data || []
    },
  })

  const totalProducts = products?.length || 0
  const totalCategories = categories?.length || 0
  const totalVariants = products?.reduce((acc: number, p: Product) => acc + (p.variants?.length || 0), 0) || 0
  const activeProducts = products?.filter((p: Product) => p.isActive).length || 0

  const stats = [
    {
      title: isRTL ? 'المنتجات' : 'Products',
      value: totalProducts,
      subtitle: `${activeProducts} ${isRTL ? 'نشط' : 'active'}`,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
      section: 'products' as AdminSection,
    },
    {
      title: isRTL ? 'الفئات' : 'Categories',
      value: totalCategories,
      subtitle: isRTL ? 'أقسام القائمة' : 'Menu sections',
      icon: FolderOpen,
      color: 'text-primary',
      bg: 'bg-primary/10',
      section: 'categories' as AdminSection,
    },
    {
      title: isRTL ? 'المقاسات والأسعار' : 'Variants',
      value: totalVariants,
      subtitle: isRTL ? 'إجمالي الخيارات' : 'Total options',
      icon: Layers,
      color: 'text-primary',
      bg: 'bg-primary/10',
      section: 'products' as AdminSection,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => onNavigate(stat.section)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {products === undefined ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => onNavigate('products')} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            {isRTL ? 'إضافة منتج' : 'Add Product'}
          </Button>
          <Button onClick={() => onNavigate('categories')} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            {isRTL ? 'إضافة فئة' : 'Add Category'}
          </Button>
          <Button onClick={() => onNavigate('settings')} variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            {isRTL ? 'إعدادات المطعم' : 'Restaurant Settings'}
          </Button>
        </div>
      </div>

      {/* Recent Products Preview */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {isRTL ? 'أحدث المنتجات' : 'Recent Products'}
        </h3>
        <Card>
          <CardContent className="p-0">
            {products === undefined ? (
              <div className="space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                {isRTL ? 'لا توجد منتجات بعد' : 'No products yet'}
              </div>
            ) : (
              <div className="divide-y">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={isRTL ? product.nameAr : product.nameEn}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {isRTL ? product.nameAr : product.nameEn}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category?.nameAr} · {product.variants?.length || 0} {isRTL ? 'خيار' : 'variants'}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="text-sm font-medium">
                        {product.variants?.[0]?.price || 0} {isRTL ? 'ر.س' : 'SAR'}
                      </p>
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
