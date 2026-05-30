'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, GripVertical, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import type { Category } from '@/types'

const categorySchema = z.object({
  nameAr: z.string().min(1, 'الاسم العربي مطلوب'),
  nameEn: z.string().min(1, 'English name is required'),
  imageUrl: z.string().optional().default(''),
  order: z.coerce.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryWithCount extends Category {
  _count?: { products: number }
}

export function CategoriesManager() {
  const { language } = useAppStore()
  const isRTL = language === 'ar'
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithCount | null>(null)

  const { data: categories, isLoading } = useQuery<CategoryWithCount[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      const json = await res.json()
      return json.data || []
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(isRTL ? 'تم إضافة الفئة بنجاح' : 'Category created successfully')
      closeDialog()
    },
    onError: (error) => {
      toast.error(error.message || (isRTL ? 'فشل في إضافة الفئة' : 'Failed to create category'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormData & { id: string }) => {
      const { id, ...rest } = data
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...rest }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(isRTL ? 'تم تحديث الفئة بنجاح' : 'Category updated successfully')
      closeDialog()
    },
    onError: (error) => {
      toast.error(error.message || (isRTL ? 'فشل في تحديث الفئة' : 'Failed to update category'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(isRTL ? 'تم حذف الفئة بنجاح' : 'Category deleted successfully')
      setDeleteDialogOpen(false)
      setDeletingCategory(null)
    },
    onError: (error) => {
      toast.error(error.message || (isRTL ? 'فشل في حذف الفئة' : 'Failed to delete category'))
    },
  })

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nameAr: '',
      nameEn: '',
      imageUrl: '',
      order: 0,
      isActive: true,
    },
  })

  function openCreateDialog() {
    setEditingCategory(null)
    form.reset({
      nameAr: '',
      nameEn: '',
      imageUrl: '',
      order: 0,
      isActive: true,
    })
    setDialogOpen(true)
  }

  function openEditDialog(category: CategoryWithCount) {
    setEditingCategory(category)
    form.reset({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      imageUrl: category.imageUrl || '',
      order: category.order,
      isActive: category.isActive,
    })
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditingCategory(null)
  }

  function onSubmit(data: CategoryFormData) {
    if (editingCategory) {
      updateMutation.mutate({ ...data, id: editingCategory.id })
    } else {
      createMutation.mutate(data)
    }
  }

  function handleDelete(category: CategoryWithCount) {
    setDeletingCategory(category)
    setDeleteDialogOpen(true)
  }

  function handleDeleteConfirm() {
    if (deletingCategory) {
      deleteMutation.mutate(deletingCategory.id)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {isRTL ? 'إدارة الفئات' : 'Categories'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isRTL ? 'إدارة أقسام القائمة' : 'Manage menu sections'}
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          {isRTL ? 'إضافة فئة' : 'Add Category'}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-12">
                <ImageIcon className="h-4 w-4" />
              </TableHead>
              <TableHead>{isRTL ? 'الاسم (عربي)' : 'Name (AR)'}</TableHead>
              <TableHead>{isRTL ? 'الاسم (إنجليزي)' : 'Name (EN)'}</TableHead>
              <TableHead className="text-center">{isRTL ? 'المنتجات' : 'Products'}</TableHead>
              <TableHead className="text-center">{isRTL ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className="text-end">{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full max-w-[100px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : categories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {isRTL ? 'لا توجد فئات بعد' : 'No categories yet'}
                </TableCell>
              </TableRow>
            ) : (
              categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                      {category.order}
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.nameAr}
                        className="h-8 w-8 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <ImageIcon className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.nameAr}</TableCell>
                  <TableCell className="text-muted-foreground">{category.nameEn}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">
                      {(category as CategoryWithCount)._count?.products || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={category.isActive ? 'default' : 'outline'}>
                      {category.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(category)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? isRTL ? 'تعديل الفئة' : 'Edit Category'
                : isRTL ? 'إضافة فئة جديدة' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? isRTL ? 'تعديل بيانات الفئة' : 'Update category details'
                : isRTL ? 'أدخل بيانات الفئة الجديدة' : 'Enter new category details'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameAr">{isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
                <Input
                  id="nameAr"
                  placeholder={isRTL ? 'مثال: مقبلات' : 'e.g. Appetizers'}
                  {...form.register('nameAr')}
                />
                {form.formState.errors.nameAr && (
                  <p className="text-xs text-destructive">{form.formState.errors.nameAr.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">{isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
                <Input
                  id="nameEn"
                  placeholder={isRTL ? 'e.g. Appetizers' : 'e.g. Appetizers'}
                  {...form.register('nameEn')}
                />
                {form.formState.errors.nameEn && (
                  <p className="text-xs text-destructive">{form.formState.errors.nameEn.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">{isRTL ? 'رابط الصورة' : 'Image URL'}</Label>
              <Input
                id="imageUrl"
                placeholder={isRTL ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'}
                {...form.register('imageUrl')}
              />
              {form.watch('imageUrl') && (
                <div className="mt-2">
                  <img
                    src={form.watch('imageUrl')}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg object-cover border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">{isRTL ? 'الترتيب' : 'Order'}</Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  {...form.register('order')}
                />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Switch
                  id="isActive"
                  checked={form.watch('isActive')}
                  onCheckedChange={(checked) => form.setValue('isActive', checked)}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {isRTL ? 'نشط' : 'Active'}
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? isRTL ? 'جاري الحفظ...' : 'Saving...'
                  : editingCategory
                    ? isRTL ? 'تحديث' : 'Update'
                    : isRTL ? 'إضافة' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'حذف الفئة' : 'Delete Category'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL
                ? `هل أنت متأكد من حذف "${deletingCategory?.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deletingCategory?.nameEn}"? This action cannot be undone.`}
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
