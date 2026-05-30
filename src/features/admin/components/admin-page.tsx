'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminLayout, type AdminSection } from './admin-layout'
import { AdminDashboard } from './admin-dashboard'
import { CategoriesManager } from './categories-manager'
import { ProductsManager } from './products-manager'
import { RestaurantSettings } from './restaurant-settings'
import { QrCodeGenerator } from './qr-code-generator'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}

export function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard')
  const [queryClient] = useState(() => createQueryClient())

  function renderContent() {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setActiveSection} />
      case 'categories':
        return <CategoriesManager />
      case 'products':
        return <ProductsManager />
      case 'settings':
        return <RestaurantSettings />
      case 'qr':
        return <QrCodeGenerator />
      default:
        return <AdminDashboard onNavigate={setActiveSection} />
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        {renderContent()}
      </AdminLayout>
    </QueryClientProvider>
  )
}
