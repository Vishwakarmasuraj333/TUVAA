'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { AdminUser } from '@/app/admin/layout'

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
          if (!isLoginPage) {
            router.push('/admin/login')
          }
        }
      } catch (e) {
        setUser(null)
        if (!isLoginPage) {
          router.push('/admin/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [isLoginPage, pathname, router])

  if (loading && !isLoginPage) {
    return (
      <div className="w-full min-h-screen bg-[#120c08] flex items-center justify-center text-[#DB9E30]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!user && !isLoginPage) {
    return null // Redirecting...
  }

  return (
    <>
      <div className="min-h-screen transition-colors duration-300 flex bg-[#f8f6f2] text-[#120c08] dark:bg-[#0f0b08] dark:text-white">
        <AdminSidebar activeUser={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-h-screen relative md:pl-64 w-full">
          <AdminHeader activeUser={user} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 pt-20 p-4 sm:p-8 overflow-y-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
