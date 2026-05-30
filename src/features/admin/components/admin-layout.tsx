'use client'

import React from 'react'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Settings,
  QrCode,
  LogOut,
} from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export type AdminSection = 'dashboard' | 'products' | 'categories' | 'settings' | 'qr'

interface AdminLayoutProps {
  activeSection: AdminSection
  onSectionChange: (section: AdminSection) => void
  children: React.ReactNode
}

const navItems: { section: AdminSection; icon: React.ElementType; labelAr: string; labelEn: string }[] = [
  { section: 'dashboard', icon: LayoutDashboard, labelAr: 'لوحة التحكم', labelEn: 'Dashboard' },
  { section: 'products', icon: Package, labelAr: 'المنتجات', labelEn: 'Products' },
  { section: 'categories', icon: FolderOpen, labelAr: 'الفئات', labelEn: 'Categories' },
  { section: 'settings', icon: Settings, labelAr: 'إعدادات المطعم', labelEn: 'Restaurant Settings' },
  { section: 'qr', icon: QrCode, labelAr: 'رمز QR', labelEn: 'QR Code' },
]

export function AdminLayout({ activeSection, onSectionChange, children }: AdminLayoutProps) {
  const { language } = useAppStore()

  const isRTL = language === 'ar'

  function handleLogout() {
    sessionStorage.removeItem('madaq-admin-auth')
    window.location.href = '/'
  }

  return (
    <SidebarProvider>
      <div className={`flex min-h-svh w-full ${isRTL ? 'flex-row' : 'flex-row'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Sidebar side={isRTL ? 'right' : 'left'} collapsible="none" className="w-60 border-s">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-lg font-bold gold-accent">م</span>
              </div>
              <div>
                <h2 className="text-base font-bold gold-accent">مضيق</h2>
                <p className="text-xs text-muted-foreground">لوحة الإدارة</p>
              </div>
            </div>
          </SidebarHeader>

          <Separator />

          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.section}>
                      <SidebarMenuButton
                        isActive={activeSection === item.section}
                        onClick={() => onSectionChange(item.section)}
                        tooltip={isRTL ? item.labelAr : item.labelEn}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{isRTL ? item.labelAr : item.labelEn}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-2">
            <Separator className="mb-2" />
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>{isRTL ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <h1 className="text-sm font-medium">
              {isRTL ? navItems.find(n => n.section === activeSection)?.labelAr : navItems.find(n => n.section === activeSection)?.labelEn}
            </h1>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
