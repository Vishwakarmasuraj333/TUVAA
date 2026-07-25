'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Loader2, ArrowLeft, Search, Eye, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { formatCurrency } from '@/lib/utils'

interface Campaign {
  id: string
  title: string
  slug: string
  goalAmount: number
  raisedAmount: number
  donationCount: number
  isPublished: boolean
  createdAt: string
}

export default function AdminDonationCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<string>('tester')

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string | null; title: string }>({ id: null, title: '' })
  const [isBulkDelete, setIsBulkDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchRoleAndCampaigns = async () => {
    setLoading(true)
    try {
      const meRes = await fetch('/api/admin/auth/me')
      if (meRes.ok) {
        const data = await meRes.json()
        setRole(data.user.role)
      }

      const res = await fetch('/api/admin/donation-campaigns')
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data)
      } else {
        toast.error('Failed to load campaigns')
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoleAndCampaigns()
  }, [])

  const isTester = role === 'tester'

  const handleDelete = async (id: string, title: string) => {
    if (isTester) {
      toast.error('Forbidden: Tester has read-only access')
      return
    }

    setItemToDelete({ id, title })
    setIsBulkDelete(false)
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    setIsDeleting(true)
    try {
      if (isBulkDelete) {
        const toastId = toast.loading('Deleting selected campaigns...')
        const deletePromises = selectedIds.map((id) =>
          fetch(`/api/admin/donation-campaigns/${id}`, { method: 'DELETE' })
        )
        const results = await Promise.all(deletePromises)
        const successes = results.filter((res) => res.ok).length
        toast.success(`Successfully deleted ${successes} campaigns`, { id: toastId })
        fetchRoleAndCampaigns()
        setSelectedIds([])
      } else {
        if (!itemToDelete.id) return
        const res = await fetch(`/api/admin/donation-campaigns/${itemToDelete.id}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          toast.success('Campaign deleted successfully')
          setCampaigns((prev) => prev.filter((c) => c.id !== itemToDelete.id))
          setSelectedIds((prev) => prev.filter((item) => item !== itemToDelete.id))
        } else {
          const data = await res.json()
          toast.error(data.message || 'Failed to delete campaign')
        }
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Error executing delete action')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleBulkDelete = async () => {
    if (isTester) {
      toast.error('Forbidden: Tester has read-only access')
      return
    }

    setItemToDelete({ id: null, title: `${selectedIds.length} selected campaigns` })
    setIsBulkDelete(true)
    setDeleteDialogOpen(true)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCampaigns.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredCampaigns.map((c) => c.id))
    }
  }

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-5">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
            Donation Campaigns
          </h1>
        </div>
        {!isTester && (
          <Link href="/admin/donation-campaigns/new">
            <button className="btn-primary-hover flex items-center justify-center gap-1.5 text-white font-cinzel font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-sm shadow-md transition-all cursor-pointer">
              <Plus className="h-4 w-4" /> Add Campaign
            </button>
          </Link>
        )}
      </div>

      {isTester && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded text-xs leading-relaxed flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>You are logged in as a <strong>Tester</strong>. Add, Edit, Delete, and Bulk Actions are disabled.</span>
        </div>
      )}

      {/* Bulk Action Controls */}
      {selectedIds.length > 0 && !isTester && (
        <div className="bg-[#57a68f]/10 border border-[#57a68f]/30 p-3 rounded flex items-center justify-between">
          <span className="text-xs text-[#42816f] dark:text-[#57a68f] font-bold">
            {selectedIds.length} item(s) selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-cinzel text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Search & Stats bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#17110d] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a]">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#8b8178]" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm text-xs focus:outline-none focus:border-[#DB9E30] placeholder-[#8b8178]/55"
          />
        </div>
        <div className="text-xs font-cinzel font-bold text-[#8b8178] dark:text-white/50 uppercase tracking-wider">
          Total: {filteredCampaigns.length} Campaigns
        </div>
      </div>

      {/* Content list table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#e8dfc8]/80 dark:border-[#2a211a]/80 bg-[#fbfaf8] dark:bg-[#1c1510] text-xs font-cinzel tracking-wider text-[#35170f] dark:text-[#DB9E30] font-bold">
                {!isTester && (
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                )}
                <th className="p-4">Title</th>
                <th className="p-4">Goal Amount</th>
                <th className="p-4">Raised Amount</th>
                <th className="p-4">Donations Count</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]/30 text-xs font-medium text-[#5a5048] dark:text-white/70">
              {filteredCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-[#fbfaf8] dark:hover:bg-white/5 transition-colors">
                  {!isTester && (
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="p-4 font-bold text-[#35170f] dark:text-white">{c.title}</td>
                  <td className="p-4 font-mono text-[#5a5048] dark:text-white/60">{formatCurrency(c.goalAmount)}</td>
                  <td className="p-4 font-mono text-green-600 dark:text-[#57a68f] font-bold">{formatCurrency(c.raisedAmount)}</td>
                  <td className="p-4 text-[#8b8178] dark:text-white/50">{c.donationCount}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${
                        c.isPublished
                          ? 'bg-[#57a68f]/10 border-[#57a68f]/20 text-[#42816f]'
                          : 'bg-zinc-100 dark:bg-[#1c1510] border-zinc-200 dark:border-[#2a211a] text-zinc-500'
                      }`}
                    >
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/donate`} target="_blank">
                        <button className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1c1510] dark:hover:bg-white/10 border border-zinc-200 dark:border-[#2a211a] text-zinc-600 dark:text-white/70 rounded transition-all cursor-pointer">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      {!isTester && (
                        <>
                          <Link href={`/admin/donation-campaigns/${c.id}/edit`}>
                            <button className="p-1.5 bg-[#57a68f]/10 hover:bg-[#57a68f] border border-[#57a68f]/20 text-[#42816f] hover:text-white rounded transition-all cursor-pointer">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(c.id, c.title)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d]">
          <p className="text-gray-500 dark:text-white/40 text-xs">No donation campaigns registered yet.</p>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title={isBulkDelete ? 'Confirm Bulk Delete' : 'Confirm Deletion'}
        description={`Are you sure you want to delete ${itemToDelete.title}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}
