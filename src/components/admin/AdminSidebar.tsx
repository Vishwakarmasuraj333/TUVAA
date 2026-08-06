'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  FolderKanban,
  HeartHandshake,
  Heart,
  CalendarDays,
  Send,
  Mail,
  Users2,
  BookOpen,
  MessageSquare,
  ClipboardList,
  Users,
  Settings,
  Image as MediaIcon,
  LogOut,
  Globe,
  ShieldAlert,
  History,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdminUser } from '@/app/admin/layout'

interface SidebarItem {
  name: string
  href: string
  icon: any
  allowedRoles?: string[]
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'News Manager', href: '/admin/news', icon: Newspaper },
  { name: 'Services', href: '/admin/services', icon: Newspaper },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Donation Campaigns', href: '/admin/donation-campaigns', icon: HeartHandshake },
  { name: 'Donations', href: '/admin/donations', icon: Heart },
  { name: 'Monthly Donations', href: '/admin/monthly-donations', icon: CalendarDays },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Send },
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: Mail },
  { name: 'Community Groups', href: '/admin/community-groups', icon: Users2 },
  { name: 'BBAM Directory', href: '/admin/bbam-directory', icon: BookOpen },
  { name: 'Comments', href: '/admin/service-comments', icon: MessageSquare },
  { name: 'Event Registrations', href: '/admin/event-registrations', icon: ClipboardList },
  { name: 'Activity Logs', href: '/admin/activity-logs', icon: History, allowedRoles: ['super_admin', 'tester'] },
  { name: 'Users', href: '/admin/users', icon: Users, allowedRoles: ['super_admin'] },
  { name: 'Media Manager', href: '/admin/media', icon: MediaIcon },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  activeUser: AdminUser | null
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ activeUser, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.refresh()
        window.location.href = '/admin/login'
      }
    } catch (e) {
      console.error('Logout error:', e)
    }
  }

  // Filter items by role (if allowedRoles is specified, check if user role matches)
  const role = activeUser?.role || 'tester'
  const filteredItems = sidebarItems.filter(item => !item.allowedRoles || item.allowedRoles.includes(role))


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "w-64 bg-white dark:bg-[#120c08] border-r border-[#eadfcf] dark:border-[#2a211a] flex flex-col h-screen fixed left-0 top-0 z-50 shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#eadfcf] dark:border-[#2a211a] flex flex-row md:flex-col gap-3 justify-between md:justify-center items-center text-center">
          <Link href="/admin" className="flex items-center gap-2 group" onClick={onClose}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/tuvaa-final-png.png"
              alt="TUVAA Logo"
              className="w-12 h-10 object-contain transition-transform group-hover:scale-105"
            />
            <div className="text-left">
              <h1 className="font-cinzel text-sm font-extrabold text-[#DB9E30] tracking-widest uppercase">
                TUVAA
              </h1>
              <p className="text-[8px] text-[#120c08]/50 dark:text-white/50 font-cinzel tracking-widest leading-none">
                ADMIN CONTROL
              </p>
            </div>
          </Link>
          <button 
            className="md:hidden p-1 rounded-sm text-[#120c08] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info Badge */}
        {activeUser && (
          <div className="mx-4 my-4 p-3 bg-gray-50 dark:bg-white/5 rounded-sm border border-[#eadfcf] dark:border-[#2a211a] text-left flex flex-col gap-1">
            <p className="text-xs font-bold text-[#120c08] dark:text-white font-cinzel uppercase tracking-wider truncate">
              {activeUser.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border",
                activeUser.role === 'super_admin' && "bg-[#e05326]/10 text-[#e05326] border-[#e05326]/30",
                activeUser.role === 'admin' && "bg-[#57a68f]/10 text-[#57a68f] border-[#57a68f]/30",
                activeUser.role === 'tester' && "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/30"
              )}>
                {activeUser.role.replace('_', ' ')}
              </span>
              {activeUser.role === 'tester' && (
                <span className="text-[8px] text-amber-600 dark:text-amber-500 flex items-center gap-0.5 font-medium">
                  <ShieldAlert className="w-3 h-3" />
                  Read-Only
                </span>
              )}
            </div>
          </div>
        )}

        {/* Nav List */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-sm text-[11px] font-cinzel tracking-wider transition-all uppercase font-semibold border border-transparent',
                  isActive
                    ? 'bg-[#DB9E30] text-white font-bold border-[#DB9E30]/20 shadow-md'
                    : 'text-[#120c08]/70 dark:text-white/70 hover:text-[#DB9E30] dark:hover:text-[#DB9E30] hover:bg-[#57a68f]/15 hover:border-[#57a68f]/15'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-[#eadfcf] dark:border-[#2a211a] space-y-1 bg-gray-50/50 dark:bg-black/20">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-sm text-[10px] font-cinzel tracking-wider text-[#120c08]/50 dark:text-white/50 hover:text-[#120c08] dark:hover:text-white transition-colors uppercase font-bold"
          >
            <Globe className="h-4 w-4" />
            <span>View Public Site</span>
          </Link>
          <button
            onClick={() => {
              if (onClose) onClose()
              handleLogout()
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-[10px] font-cinzel tracking-wider text-red-500 dark:text-red-400 hover:text-white hover:bg-red-500 transition-colors uppercase text-left cursor-pointer font-bold border border-transparent"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
