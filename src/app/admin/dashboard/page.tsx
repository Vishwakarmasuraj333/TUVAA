'use client'

import { useState, useEffect } from 'react'
import {
  Newspaper,
  Calendar,
  Heart,
  Mail,
  Send,
  Users,
  ShieldCheck,
  Loader2,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/ThemeProvider'

interface Stats {
  news: number
  events: number
  messages: number
  subscribers: number
  memberships: number
  groupRegistrations: number
  totalDonations: number
  donationCount: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-gold-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gold-500/20 pb-6 gap-4">
        <div>
          <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
            Dashboard Overview
          </h1>
          <p className="text-xs text-white/55 mt-1">
            Real-time activity and content management metrics for TUVAA.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gold-400 bg-gold-500/5 border border-gold-500/10 px-3.5 py-1.5 rounded">
          <ShieldCheck className="h-4 w-4" /> System Health Online
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Donations */}
        <div className="glass-panel rounded-lg p-6 border border-gold-500/10 space-y-4 shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-cinzel text-white/60 uppercase tracking-widest">Total Donations</span>
            <div className="p-2 rounded bg-gold-500/10 border border-gold-500/30 text-gold-500">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {formatCurrency(stats?.totalDonations || 0)}
            </h3>
            <p className="text-[10px] text-white/50 mt-1">{stats?.donationCount || 0} pledges recorded</p>
          </div>
        </div>

        {/* Memberships */}
        <div className="glass-panel rounded-lg p-6 border border-gold-500/10 space-y-4 shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-cinzel text-white/60 uppercase tracking-widest">Memberships</span>
            <div className="p-2 rounded bg-gold-500/10 border border-gold-500/30 text-gold-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {stats?.memberships || 0}
            </h3>
            <p className="text-[10px] text-white/50 mt-1">Pending group approvals</p>
          </div>
        </div>

        {/* African Group applications */}
        <div className="glass-panel rounded-lg p-6 border border-gold-500/10 space-y-4 shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-cinzel text-white/60 uppercase tracking-widest">Group Applications</span>
            <div className="p-2 rounded bg-gold-500/10 border border-gold-500/30 text-gold-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {stats?.groupRegistrations || 0}
            </h3>
            <p className="text-[10px] text-white/50 mt-1">African community groups</p>
          </div>
        </div>

        {/* Messages */}
        <div className="glass-panel rounded-lg p-6 border border-gold-500/10 space-y-4 shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-cinzel text-white/60 uppercase tracking-widest">Inbox Messages</span>
            <div className="p-2 rounded bg-gold-500/10 border border-gold-500/30 text-gold-500">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {stats?.messages || 0}
            </h3>
            <p className="text-[10px] text-white/50 mt-1">Contact form submissions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* News Posts */}
        <div className="glass-panel rounded-lg p-6 border border-gold-500/10 space-y-4 shadow-md text-left">
          <div className="flex justify-between items-center border-b border-gold-500/10 pb-3">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Newspaper className="h-4 w-4 text-gold-500" /> News Management
            </h4>
            <span className="text-xs text-gold-400 font-bold">{stats?.news || 0} Articles</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Create, publish, edit, or delete articles and news releases regarding TUVAA and BBAM.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/news"
              className="inline-flex items-center gap-1 text-[10px] font-cinzel text-gold-400 hover:text-gold-300 uppercase tracking-widest group"
            >
              Go to News <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Events Management */}
        <div className="glass-panel rounded-lg p-6 border border-gold-500/10 space-y-4 shadow-md text-left">
          <div className="flex justify-between items-center border-b border-gold-500/10 pb-3">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gold-500" /> Events Scheduler
            </h4>
            <span className="text-xs text-gold-400 font-bold">{stats?.events || 0} Scheduled</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Create upcoming events, set locations, times, description, and upload promo flyers.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-1 text-[10px] font-cinzel text-gold-400 hover:text-gold-300 uppercase tracking-widest group"
            >
              Go to Events <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Newsletter Subscribers */}
        <div className="glass-panel rounded-lg p-6 border border-gold-500/10 space-y-4 shadow-md text-left">
          <div className="flex justify-between items-center border-b border-gold-500/10 pb-3">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Send className="h-4 w-4 text-gold-500" /> Mailing List
            </h4>
            <span className="text-xs text-gold-400 font-bold">{stats?.subscribers || 0} Subscribers</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            View mailing list subscriptions, see details, and export subscriber contact sheets.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/newsletter"
              className="inline-flex items-center gap-1 text-[10px] font-cinzel text-gold-400 hover:text-gold-300 uppercase tracking-widest group"
            >
              Go to Newsletter <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
