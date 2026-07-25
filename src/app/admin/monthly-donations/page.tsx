'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface MonthlyDonation {
  id: string
  fullName: string
  email: string
  amount: number
  paymentMethod: string
  status: string
  createdAt: string
}

export default function AdminMonthlyDonationsPage() {
  const [donations, setDonations] = useState<MonthlyDonation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchDonations() {
      try {
        const res = await fetch('/api/admin/monthly-donations')
        if (res.ok) {
          const data = await res.json()
          setDonations(data)
        }
      } catch (error) {
        console.error('Error fetching monthly donations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDonations()
  }, [])

  const filtered = donations.filter(
    (d) =>
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-10">
      {/* Top Header */}
      <div className="space-y-1 border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#DB9E30]/80 uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
          Monthly Pledges
        </h1>
      </div>

      {/* Search & Stats bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#17110d] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a]">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#8b8178] dark:text-white/40" />
          <input
            type="text"
            placeholder="Search monthly pledges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white placeholder-[#8b8178]/70"
          />
        </div>
        <div className="text-xs font-cinzel font-bold text-[#8b8178] dark:text-white/60 uppercase tracking-wider">
          Total: <span className="text-[#35170f] dark:text-gold-500">{filtered.length}</span> Active Pledges
        </div>
      </div>

      {/* Content list table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e8dfc8]/80 dark:border-[#2a211a] bg-[#fbfaf8] dark:bg-[#1c1510] text-xs font-cinzel tracking-wider text-[#35170f] dark:text-[#DB9E30] font-bold">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Date Subscribed</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]/30 text-xs font-medium text-[#5a5048] dark:text-white/70">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-[#fbfaf8] dark:hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-[#35170f] dark:text-white">{d.fullName}</td>
                  <td className="p-4 text-[#8b8178] dark:text-white/60 font-mono">{d.email}</td>
                  <td className="p-4 font-mono font-bold text-[#e05326] dark:text-[#ff784e]">{formatCurrency(d.amount)}/mo</td>
                  <td className="p-4 uppercase tracking-wider font-bold text-[10px] text-zinc-500 dark:text-white/50">{d.paymentMethod}</td>
                  <td className="p-4 text-[#8b8178] dark:text-white/40">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${
                        d.status === 'completed' || d.status === 'active' || d.status === 'pending'
                          ? 'bg-[#57a68f]/10 border-[#57a68f]/20 text-[#42816f]'
                          : 'bg-red-500/10 border-red-500/20 text-red-500'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d]">
          <p className="text-[#8b8178] dark:text-white/40 text-xs">No monthly donations yet.</p>
        </div>
      )}
    </div>
  )
}
