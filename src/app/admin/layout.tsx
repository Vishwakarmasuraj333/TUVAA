'use client'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import AdminLayoutContent from '@/components/admin/AdminLayoutContent'
import { Toaster } from 'sonner'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  dpUrl?: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  )
}
