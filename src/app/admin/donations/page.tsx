'use client'

import { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate, formatCurrency } from '@/lib/utils'

interface Campaign {
  id: string
  title: string
  description: string
  goalAmount: number
  raisedAmount: number
}

interface Donation {
  id: string
  fullName: string
  email: string
  amount: number
  paymentMethod: string
  status: string
  createdAt: string
  campaign: {
    title: string
  } | null
}

export default function AdminDonationsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/donations')
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data.campaigns || [])
        setDonations(data.donations || [])
      }
    } catch (e) {
      toast.error('Failed to load donations history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-8 text-left">
      <div className="border-b border-gold-500/20 pb-4">
        <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
          Donations & Pledges
        </h1>
        <p className="text-xs text-white/55 mt-1">Monitor fundraising campaigns and donor transaction logs.</p>
      </div>

      {loading ? (
        <div className="w-full h-40 flex items-center justify-center text-gold-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Campaigns Progress grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {campaigns.map((camp) => (
              <div key={camp.id} className="glass-panel border border-gold-500/10 rounded-lg p-5 space-y-4">
                <h4 className="font-cinzel text-xs font-bold text-gold-500 uppercase tracking-widest">{camp.title}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-white/50">
                    <span>Goal: {formatCurrency(camp.goalAmount)}</span>
                    <span>Raised: {formatCurrency(camp.raisedAmount)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                      style={{ width: `${Math.min(100, (camp.raisedAmount / camp.goalAmount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Donations Logs Table */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-gold-500" /> Transaction History
            </h3>

            {donations.length > 0 ? (
              <div className="glass-panel border border-gold-500/20 rounded-lg overflow-x-auto shadow-md">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gold-500/20 bg-gold-500/5 font-cinzel tracking-widest text-gold-500 text-[10px] uppercase">
                      <th className="p-4">Donor Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Campaign</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80 leading-normal divide-y divide-gold-500/10">
                    {donations.map((don) => (
                      <tr key={don.id} className="hover:bg-gold-500/5 transition-colors">
                        <td className="p-4 font-semibold text-white uppercase tracking-wide">{don.fullName}</td>
                        <td className="p-4">{don.email}</td>
                        <td className="p-4">{don.campaign?.title || 'General Fund'}</td>
                        <td className="p-4 font-bold text-gold-400">{formatCurrency(don.amount)}</td>
                        <td className="p-4 font-mono text-[10px]">{don.paymentMethod}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              don.status === 'COMPLETED'
                                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                                : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                            }`}
                          >
                            {don.status}
                          </span>
                        </td>
                        <td className="p-4">{formatDate(don.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-white/40 border border-gold-500/10 rounded-lg">
                No donations yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
