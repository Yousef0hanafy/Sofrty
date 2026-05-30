'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  X,
  GripVertical,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppStore } from '@/store/app-store'
import type { Product, Category } from '@/types'

const variantSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  calories: z.coerce.number().min(0).optional().default(0),
})

const productSchema = z.object({
  nameAr: z.string().min(1, 'الاسم العربي مطلوب'),
  nameEn: z.string().min(1, 'English name is required'),
  descriptionAr: z.string().optional().default(''),
  descriptionEn: z.string().optional().default(''),
  imageUrl: z.string().optional().default(''),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().optional().default(''),
  allergens: z.string().optional().default(''),
  isActive: z.boolean().optional().default(true),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
})

type ProductFormData = z.infer<typeof productSchema>

export function ProductsManager() {
  const { language } = useAppStore()
  const isRTL = language === 'ar'
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products', 'admin', filterCategory],
    queryFn: async () => {
      const params = new URLSearchParams({ all: 'true' })
      if (filterCategory && filterCategory !== 'all') {
        params.set('categoryId', filterCategory)
      }
      const res = await fetch(`/api/products?${params.toString()}`)
      const json = await res.json()
      return json.data || []
    },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      const json = await res.json()
      return json.data || []
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(isRTL ? 'تم إضافة المنتج بنجاح' : 'Product created successfully')
      closeDialog()
    },
    onError: (error) => {
      toast.error(error.message || (isRTL ? 'فشل في إضافة المنتج' : 'Failed to create product'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData & { id: string }) => {
      const { id, ...rest } = data
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...rest }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(isRTL ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully')
      closeDialog()
    },
    onError: (error) => {
      toast.error(error.message || (isRTL ? 'فشل في تحديث المنتج' : 'Failed to update product'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(isRTL ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully')
      setDeleteDialogOpen(false)
      setDeletingProduct(null)
    },
    onError: (error) => {
      toast.error(error.message || (isRTL ? 'فشل في حذف المنتج' : 'Failed to delete product'))
    },
  })

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      imageUrl: '',
      categoryId: '',
      tags: '',
      allergens: '',
      isActive: true,
      variants: [{ label: '', price: 0, calories: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
  })

  function openCreateDialog() {
    setEditingProduct(null)
    form.reset({
      nameAr: '',
      nameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      imageUrl: '',
      categoryId: categories?.[0]?.id || '',
      tags: '',
      allergens: '',
      isActive: true,
      variants: [{ label: '', price: 0, calories: 0 }],
    })
    setDialogOpen(true)
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product)
    form.reset({
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      descriptionAr: product.descriptionAr || '',
      descriptionEn: product.descriptionEn || '',
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
      tags: product.tags || '',
      allergens: product.allergens || '',
      isActive: product.isActive,
      variants: product.variants?.length
        ? product.variants.map((v) => ({
            label: v.label,
            price: v.price,
            calories: v.calories,
          }))
        : [{ label: '', price: 0, calories: 0 }],
    })
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditingProduct(null)
  }

  function onSubmit(data: ProductFormData) {
    if (editingProduct) {
      updateMutation.mutate({ ...data, id: editingProduct.id })
    } else {
      createMutation.mutate(data)
    }
  }

  function handleDelete(product: Product) {
    setDeletingProduct(product)
    setDeleteDialogOpen(true)
  }

  function handleDeleteConfirm() {
    if (deletingProduct) {
      deleteMutation.mutate(deletingProduct.id)
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
          form.setValue('imageUrl', json.data.url)
          toast.success(isRTL ? 'تم رفع الصورة' : 'Image uploaded')
        } else {
          toast.error(json.error || (isRTL ? 'فشل في رفع الصورة' : 'Upload failed'))
        }
      })
      .catch(() => {
        toast.error(isRTL ? 'فشل في رفع الصورة' : 'Upload failed')
      })
  }

  const filteredProducts = products?.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q)
  })

  function getCategoryName(categoryId: string) {
    return categories?.find((c) => c.id === categoryId)
  }

  function getPriceRange(product: Product) {
    if (!product.variants?.length) return '-'
    const prices = product.variants.map((v) => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return `${min} SAR`
    return `${min} - ${max} SAR`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {isRTL ? 'إدارة المنتجات' : 'Products'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isRTL ? 'إدارة عناصر القائمة' : 'Manage menu items'}
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          {isRTL ? 'إضافة منتج' : 'Add Product'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isRTL ? 'بحث في المنتجات...' : 'Search products...'}
            className="ps-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={isRTL ? 'جميع الفئات' : 'All Categories'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {isRTL ? cat.nameAr : cat.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <ImageIcon className="h-4 w-4" />
              </TableHead>
              <TableHead>{isRTL ? 'الاسم' : 'Name'}</TableHead>
              <TableHead>{isRTL ? 'الفئة' : 'Category'}</TableHead>
              <TableHead>{isRTL ? 'السعر' : 'Price'}</TableHead>
              <TableHead className="text-center">{isRTL ? 'الخيارات' : 'Variants'}</TableHead>
              <TableHead className="text-center">{isRTL ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className="text-end">{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full max-w-[100px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredProducts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {searchQuery
                    ? isRTL ? 'لا توجد نتائج' : 'No results found'
                    : isRTL ? 'لا توجد منتجات بعد' : 'No products yet'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts?.map((product) => {
                const cat = getCategoryName(product.categoryId)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.nameAr}
                          className="h-8 w-8 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <ImageIcon className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{isRTL ? product.nameAr : product.nameEn}</p>
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? product.nameEn : product.nameAr}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{isRTL ? cat?.nameAr : cat?.nameEn}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {getPriceRange(product)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{product.variants?.length || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={product.isActive ? 'default' : 'outline'}>
                        {product.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh]" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>
              {editingProduct
                ? isRTL ? 'تعديل المنتج' : 'Edit Product'
                : isRTL ? 'إضافة منتج جديد' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? isRTL ? 'تعديل بيانات المنتج والخيارات' : 'Update product details and variants'
                : isRTL ? 'أدخل بيانات المنتج الجديد' : 'Enter new product details'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[65vh] pe-4">
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p-nameAr">{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
                  <Input
                    id="p-nameAr"
                    placeholder={isRTL ? 'مثال: برجر لحم' : 'e.g. Beef Burger'}
                    {...form.register('nameAr')}
                  />
                  {form.formState.errors.nameAr && (
                    <p className="text-xs text-destructive">{form.formState.errors.nameAr.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-nameEn">{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
                  <Input
                    id="p-nameEn"
                    placeholder="e.g. Beef Burger"
                    {...form.register('nameEn')}
                  />
                  {form.formState.errors.nameEn && (
                    <p className="text-xs text-destructive">{form.formState.errors.nameEn.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p-descAr">{isRTL ? 'الوصف (عربي)' : 'Description (AR)'}</Label>
                  <Textarea
                    id="p-descAr"
                    rows={2}
                    placeholder={isRTL ? 'وصف المنتج' : 'Product description'}
                    {...form.register('descriptionAr')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-descEn">{isRTL ? 'الوصف (إنجليزي)' : 'Description (EN)'}</Label>
                  <Textarea
                    id="p-descEn"
                    rows={2}
                    placeholder="Product description"
                    {...form.register('descriptionEn')}
                  />
                </div>
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label>{isRTL ? 'الصورة' : 'Image'}</Label>
                <div className="flex items-center gap-3">
                  {form.watch('imageUrl') ? (
                    <img
                      src={form.watch('imageUrl')}
                      alt="Preview"
                      className="h-14 w-14 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20">
                      <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <Input
                      placeholder={isRTL ? 'رابط الصورة أو ارفع صورة' : 'Image URL or upload'}
                      {...form.register('imageUrl')}
                    />
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        <span className="text-xs text-primary hover:underline">
                          {isRTL ? 'رفع صورة' : 'Upload image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isRTL ? 'الفئة' : 'Category'}</Label>
                  <Select
                    value={form.watch('categoryId')}
                    onValueChange={(val) => form.setValue('categoryId', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر فئة' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {isRTL ? cat.nameAr : cat.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-xs text-destructive">{form.formState.errors.categoryId.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-7">
                  <Switch
                    checked={form.watch('isActive')}
                    onCheckedChange={(checked) => form.setValue('isActive', checked)}
                  />
                  <Label className="cursor-pointer">
                    {isRTL ? 'منتج نشط' : 'Active product'}
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p-tags">{isRTL ? 'الوسوم' : 'Tags'}</Label>
                  <Input
                    id="p-tags"
                    placeholder={isRTL ? 'شائع, مفضل' : 'popular, favorite'}
                    {...form.register('tags')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-allergens">{isRTL ? 'الحساسية' : 'Allergens'}</Label>
                  <Input
                    id="p-allergens"
                    placeholder={isRTL ? 'غلوتين, حليب' : 'gluten, dairy'}
                    {...form.register('allergens')}
                  />
                </div>
              </div>

              <Separator />

              {/* Variants Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    {isRTL ? 'الخيارات والأسعار' : 'Variants & Pricing'}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => append({ label: '', price: 0, calories: 0 })}
                  >
                    <Plus className="h-3 w-3" />
                    {isRTL ? 'إضافة خيار' : 'Add variant'}
                  </Button>
                </div>

                {form.formState.errors.variants && (
                  <p className="text-xs text-destructive">
                    {typeof form.formState.errors.variants.message === 'string'
                      ? form.formState.errors.variants.message
                      : ''}
                  </p>
                )}

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2 p-3 rounded-lg border bg-muted/30">
                      <div className="mt-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            {isRTL ? 'التسمية' : 'Label'}
                          </Label>
                          <Input
                            placeholder={isRTL ? 'مثال: صغير' : 'e.g. Small'}
                            {...form.register(`variants.${index}.label`)}
                          />
                          {form.formState.errors.variants?.[index]?.label && (
                            <p className="text-xs text-destructive">
                              {form.formState.errors.variants[index].label?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            {isRTL ? 'السعر (ر.س)' : 'Price (SAR)'}
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.5}
                            placeholder="0"
                            {...form.register(`variants.${index}.price`)}
                          />
                          {form.formState.errors.variants?.[index]?.price && (
                            <p className="text-xs text-destructive">
                              {form.formState.errors.variants[index].price?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            {isRTL ? 'سعرات' : 'Calories'}
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...form.register(`variants.${index}.calories`)}
                          />
                        </div>
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 mt-1 text-destructive hover:text-destructive shrink-0"
                          onClick={() => remove(index)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </ScrollArea>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              form="product-form"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? isRTL ? 'جاري الحفظ...' : 'Saving...'
                : editingProduct
                  ? isRTL ? 'تحديث' : 'Update'
                  : isRTL ? 'إضافة' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'حذف المنتج' : 'Delete Product'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL
                ? `هل أنت متأكد من حذف "${deletingProduct?.nameAr}"؟ سيتم حذف جميع الخيارات أيضاً.`
                : `Are you sure you want to delete "${deletingProduct?.nameEn}"? All variants will also be removed.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? isRTL ? 'جاري الحذف...' : 'Deleting...'
                : isRTL ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
