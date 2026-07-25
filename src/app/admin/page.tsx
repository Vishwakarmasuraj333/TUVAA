'use client'

import { useState, useEffect } from 'react'
import {
  Newspaper,
  Calendar,
  Heart,
  Mail,
  Send,
  Users2,
  FolderKanban,
  HeartHandshake,
  Image as ImageIcon,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  Loader2,
  CalendarDays,
  DollarSign
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { formatCurrency, cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/ThemeProvider'

interface DonationActivity {
  id: string
  fullName: string
  amount: number
  campaignTitle: string
  createdAt: string
}

interface SubscriberActivity {
  id: string
  email: string
  createdAt: string
}

interface MessageActivity {
  id: string
  name: string
  email: string
  subject: string
  createdAt: string
}

interface GroupAppActivity {
  id: string
  fullName: string
  communityGroupName: string
  status: string
  createdAt: string
}

interface RegistrationActivity {
  id: string
  fullName: string
  eventSlug: string
  createdAt: string
  event: {
    title: string
  }
}

interface Stats {
  services: number
  projects: number
  events: number
  gallery: number
  campaigns: number
  messages: number
  subscribers: number
  groupApps: number
  registrations: number
  pendingComments: number
  totalDonations: number
  donationCount: number
  totalMonthlyDonations: number
  recentDonations: DonationActivity[]
  recentSubscribers: SubscriberActivity[]
  recentMessages: MessageActivity[]
  recentGroupApps: GroupAppActivity[]
  recentRegistrations: RegistrationActivity[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (e) {
        console.error('Error fetching dashboard stats:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-[#DB9E30]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Charts mock data aligned with database metrics
  const contentDistributionData = [
    { name: 'Services', count: stats?.services || 0 },
    { name: 'Projects', count: stats?.projects || 0 },
    { name: 'Events', count: stats?.events || 0 },
    { name: 'Gallery', count: stats?.gallery || 0 },
  ]

  const trendData = [
    { name: 'Subscribers', count: stats?.subscribers || 0, fill: '#57a68f' },
    { name: 'Registrations', count: stats?.registrations || 0, fill: '#DB9E30' },
    { name: 'Messages', count: stats?.messages || 0, fill: '#e05326' },
    { name: 'Group Apps', count: stats?.groupApps || 0, fill: '#35170f' },
  ]

  return (
    <div className="space-y-8 text-left max-w-[1200px] mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-5">
        <div>
          <h1 className="font-cinzel text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#8b8178] dark:text-white/60 font-medium leading-none mt-1.5">
            Real-time management dashboard and metrics overview for TUVAA.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#42816f] dark:text-[#57a68f] bg-[#57a68f]/10 border border-[#57a68f]/20 px-3.5 py-1.5 rounded-sm font-bold">
          <ShieldCheck className="h-4 w-4" /> System Health Online
        </div>
      </div>

      {/* Grid statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Donations */}
        <div className="bg-white dark:bg-[#1c1510] p-5 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1.5">
            <span className="text-[10px] font-cinzel text-[#8b8178] dark:text-white/50 font-bold uppercase tracking-wider">
              Total Donations
            </span>
            <h3 className="text-2xl font-bold text-[#35170f] dark:text-white">
              {formatCurrency(stats?.totalDonations || 0)}
            </h3>
            <p className="text-[10px] text-[#8b8178] dark:text-white/50 font-medium">
              {stats?.donationCount || 0} transaction records
            </p>
          </div>
          <div className="p-3 bg-[#e05326]/10 border border-[#e05326]/20 text-[#e05326] rounded-sm shadow-inner">
            <Heart className="h-5 w-5" />
          </div>
        </div>

        {/* Monthly Donations */}
        <div className="bg-white dark:bg-[#1c1510] p-5 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1.5">
            <span className="text-[10px] font-cinzel text-[#8b8178] dark:text-white/50 font-bold uppercase tracking-wider">
              Monthly Donations
            </span>
            <h3 className="text-2xl font-bold text-[#35170f] dark:text-white">
              {formatCurrency(stats?.totalMonthlyDonations || 0)}
            </h3>
            <p className="text-[10px] text-[#8b8178] dark:text-white/50 font-medium">
              Recurring payments
            </p>
          </div>
          <div className="p-3 bg-[#DB9E30]/10 border border-[#DB9E30]/20 text-[#DB9E30] rounded-sm shadow-inner">
            <CalendarDays className="h-5 w-5" />
          </div>
        </div>

        {/* Newsletter Subscribers */}
        <div className="bg-white dark:bg-[#1c1510] p-5 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1.5">
            <span className="text-[10px] font-cinzel text-[#8b8178] dark:text-white/50 font-bold uppercase tracking-wider">
              Subscribers
            </span>
            <h3 className="text-2xl font-bold text-[#35170f] dark:text-white">
              {stats?.subscribers || 0}
            </h3>
            <p className="text-[10px] text-[#8b8178] dark:text-white/50 font-medium">
              Mailing list size
            </p>
          </div>
          <div className="p-3 bg-[#57a68f]/10 border border-[#57a68f]/20 text-[#57a68f] rounded-sm shadow-inner">
            <Send className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Comments */}
        <div className="bg-white dark:bg-[#1c1510] p-5 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1.5">
            <span className="text-[10px] font-cinzel text-[#8b8178] dark:text-white/50 font-bold uppercase tracking-wider">
              Pending Comments
            </span>
            <h3 className="text-2xl font-bold text-[#35170f] dark:text-white">
              {stats?.pendingComments || 0}
            </h3>
            <p className="text-[10px] text-[#8b8178] dark:text-white/50 font-medium">
              Awaiting review
            </p>
          </div>
          <div className="p-3 bg-[#35170f]/10 dark:bg-white/10 border border-[#35170f]/20 dark:border-white/20 text-[#35170f] dark:text-white rounded-sm shadow-inner">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Grid of secondary statistics count */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Services */}
        <div className="bg-white dark:bg-[#1c1510] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-center">
          <Newspaper className="h-5 w-5 mx-auto text-[#DB9E30]" />
          <h4 className="text-lg font-bold text-[#35170f] dark:text-white mt-1">{stats?.services || 0}</h4>
          <p className="text-[9px] uppercase tracking-wider font-cinzel font-bold text-[#8b8178] dark:text-white/50">Services</p>
        </div>

        {/* Projects */}
        <div className="bg-white dark:bg-[#1c1510] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-center">
          <FolderKanban className="h-5 w-5 mx-auto text-[#57a68f]" />
          <h4 className="text-lg font-bold text-[#35170f] dark:text-white mt-1">{stats?.projects || 0}</h4>
          <p className="text-[9px] uppercase tracking-wider font-cinzel font-bold text-[#8b8178] dark:text-white/50">Projects</p>
        </div>

        {/* Events */}
        <div className="bg-white dark:bg-[#1c1510] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-center">
          <Calendar className="h-5 w-5 mx-auto text-[#e05326]" />
          <h4 className="text-lg font-bold text-[#35170f] dark:text-white mt-1">{stats?.events || 0}</h4>
          <p className="text-[9px] uppercase tracking-wider font-cinzel font-bold text-[#8b8178] dark:text-white/50">Events</p>
        </div>

        {/* Gallery */}
        <div className="bg-white dark:bg-[#1c1510] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-center">
          <ImageIcon className="h-5 w-5 mx-auto text-sky-600" />
          <h4 className="text-lg font-bold text-[#35170f] dark:text-white mt-1">{stats?.gallery || 0}</h4>
          <p className="text-[9px] uppercase tracking-wider font-cinzel font-bold text-[#8b8178] dark:text-white/50">Gallery Items</p>
        </div>

        {/* Event Registrations */}
        <div className="bg-white dark:bg-[#1c1510] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-center">
          <ClipboardList className="h-5 w-5 mx-auto text-indigo-600" />
          <h4 className="text-lg font-bold text-[#35170f] dark:text-white mt-1">{stats?.registrations || 0}</h4>
          <p className="text-[9px] uppercase tracking-wider font-cinzel font-bold text-[#8b8178] dark:text-white/50">Registrations</p>
        </div>

        {/* Community Groups */}
        <div className="bg-white dark:bg-[#1c1510] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-center col-span-2 md:col-span-1">
          <Users2 className="h-5 w-5 mx-auto text-purple-600" />
          <h4 className="text-lg font-bold text-[#35170f] dark:text-white mt-1">{stats?.groupApps || 0}</h4>
          <p className="text-[9px] uppercase tracking-wider font-cinzel font-bold text-[#8b8178] dark:text-white/50">Group Apps</p>
        </div>
      </div>

      {/* Graphical charts reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Chart 1: Content Distribution */}
        <div className="bg-white dark:bg-[#1c1510] p-6 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm">
          <h3 className="font-cinzel text-sm font-bold text-[#35170f] dark:text-white uppercase tracking-wider border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-3 mb-4">
            Content Counts Distribution
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentDistributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e9d2" />
                <XAxis dataKey="name" stroke="#8b8178" fontSize={11} tickLine={false} />
                <YAxis stroke="#8b8178" fontSize={11} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(219, 158, 48, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1c1510' : '#ffffff', 
                    border: '1px solid #DB9E30', 
                    borderRadius: '4px', 
                    color: theme === 'dark' ? 'white' : '#120c08' 
                  }}
                />
                <Bar dataKey="count" fill="#DB9E30" radius={[2, 2, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Community Interest Trend */}
        <div className="bg-white dark:bg-[#1c1510] p-6 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm">
          <h3 className="font-cinzel text-sm font-bold text-[#35170f] dark:text-white uppercase tracking-wider border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-3 mb-4">
            Public Submissions & Registrations
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e9d2" />
                <XAxis dataKey="name" stroke="#8b8178" fontSize={11} tickLine={false} />
                <YAxis stroke="#8b8178" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1c1510' : '#ffffff', 
                    border: '1px solid #DB9E30', 
                    borderRadius: '4px', 
                    color: theme === 'dark' ? 'white' : '#120c08' 
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Left Column: Recent Donations & Event Registrations */}
        <div className="space-y-8">
          {/* Latest Donations */}
          <div className="bg-white dark:bg-[#1c1510] p-6 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-left">
            <h3 className="font-cinzel text-xs font-bold text-[#35170f] dark:text-white uppercase tracking-widest border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-3 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#e05326]" /> Latest Donations
            </h3>
            {stats?.recentDonations && stats.recentDonations.length > 0 ? (
              <div className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]">
                {stats.recentDonations.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#35170f] dark:text-white">{item.fullName}</p>
                      <p className="text-[10px] text-[#8b8178] dark:text-white/60 mt-0.5">{item.campaignTitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#e05326] font-mono">{formatCurrency(item.amount)}</p>
                      <p className="text-[9px] text-[#8b8178] dark:text-white/60 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8b8178] dark:text-white/50 py-4 text-center">No recent donations recorded.</p>
            )}
          </div>

          {/* Latest Event Registrations */}
          <div className="bg-white dark:bg-[#1c1510] p-6 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-left">
            <h3 className="font-cinzel text-xs font-bold text-[#35170f] dark:text-white uppercase tracking-widest border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-3 mb-4 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-600" /> Latest Event Registrations
            </h3>
            {stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
              <div className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]">
                {stats.recentRegistrations.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#35170f] dark:text-white">{item.fullName}</p>
                      <p className="text-[10px] text-[#8b8178] dark:text-white/60 mt-0.5 truncate max-w-[240px]">
                        {item.event?.title || item.eventSlug}
                      </p>
                    </div>
                    <p className="text-[9px] text-[#8b8178] dark:text-white/60">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8b8178] dark:text-white/50 py-4 text-center">No recent event registrations.</p>
            )}
          </div>
        </div>

        {/* Right Column: Contact Messages & Group applications */}
        <div className="space-y-8">
          {/* Latest Contact Messages */}
          <div className="bg-white dark:bg-[#1c1510] p-6 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-left">
            <h3 className="font-cinzel text-xs font-bold text-[#35170f] dark:text-white uppercase tracking-widest border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-3 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#57a68f]" /> Latest Messages
            </h3>
            {stats?.recentMessages && stats.recentMessages.length > 0 ? (
              <div className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]">
                {stats.recentMessages.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#35170f] dark:text-white">{item.name}</p>
                      <p className="text-[10px] text-[#8b8178] dark:text-white/60 mt-0.5">{item.subject || 'No Subject'}</p>
                    </div>
                    <p className="text-[9px] text-[#8b8178] dark:text-white/60">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8b8178] dark:text-white/50 py-4 text-center">No recent messages.</p>
            )}
          </div>

          {/* Latest Group Applications */}
          <div className="bg-white dark:bg-[#1c1510] p-6 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a] shadow-sm text-left">
            <h3 className="font-cinzel text-xs font-bold text-[#35170f] dark:text-white uppercase tracking-widest border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-3 mb-4 flex items-center gap-2">
              <Users2 className="w-4 h-4 text-purple-600" /> Latest Group Applications
            </h3>
            {stats?.recentGroupApps && stats.recentGroupApps.length > 0 ? (
              <div className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]">
                {stats.recentGroupApps.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#35170f] dark:text-white">{item.fullName}</p>
                      <p className="text-[10px] text-[#8b8178] dark:text-white/60 mt-0.5">{item.communityGroupName}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border",
                        item.status === 'approved' && "bg-[#57a68f]/10 text-[#57a68f] border-[#57a68f]/20",
                        item.status === 'pending' && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                        item.status === 'rejected' && "bg-red-500/10 text-red-600 border-red-500/20"
                      )}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8b8178] dark:text-white/50 py-4 text-center">No recent applications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
