'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'

interface EventRegistration {
  id: string
  eventSlug: string
  fullName: string
  email: string
  phone: string
  ticketsCount: number
  createdAt: string
  event: {
    title: string
  }
}

export default function AdminEventRegistrationsPage() {
  const [regs, setRegs] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchRegs = async () => {
    try {
      const res = await fetch('/api/admin/event-registrations')
      if (res.ok) {
        const data = await res.json()
        setRegs(data)
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegs()
  }, [])

  const handleDelete = async (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/event-registrations/${itemToDelete}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Registration deleted successfully')
        setRegs(regs.filter((r) => r.id !== itemToDelete))
      } else {
        const data = await res.json()
        toast.error(data.message || 'Failed to delete registration')
      }
    } catch (e) {
      console.error(e)
      toast.error('Error executing delete action')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const filtered = regs.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.event?.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-10">
      {/* Top Header */}
      <div className="space-y-1 border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
          Event Registrations
        </h1>
      </div>

      {/* Search & Stats bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1c1510] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a]">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#8b8178] dark:text-white/40" />
          <input
            type="text"
            placeholder="Search registrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#fdfcfb] dark:bg-[#120c08] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white placeholder:text-[#8b8178] dark:placeholder:text-white/40"
          />
        </div>
        <div className="text-xs font-cinzel font-bold text-[#8b8178] dark:text-white/50 uppercase tracking-wider">
          Total: {filtered.length} Registrations
        </div>
      </div>

      {/* Content list table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e8dfc8]/80 dark:border-[#2a211a] bg-[#fbfaf8] dark:bg-white/5 text-xs font-cinzel tracking-wider text-[#35170f] dark:text-white font-bold">
                <th className="p-4">Attendee</th>
                <th className="p-4">Event</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Tickets Requested</th>
                <th className="p-4">Date Registered</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a] text-xs font-medium text-[#5a5048] dark:text-white/70">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-[#fbfaf8] dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-[#35170f] dark:text-white">{r.fullName}</p>
                    <p className="text-[10px] text-[#8b8178] dark:text-white/50">{r.email}</p>
                  </td>
                  <td className="p-4 font-bold text-[#35170f] dark:text-white">
                    {r.event?.title || r.eventSlug}
                  </td>
                  <td className="p-4 font-mono">{r.phone || 'N/A'}</td>
                  <td className="p-4 text-center sm:text-left font-bold text-[#DB9E30]">{r.ticketsCount}</td>
                  <td className="p-4 text-[#8b8178] dark:text-white/50">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-sm transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#1c1510]">
          <p className="text-[#8b8178] dark:text-white/50 text-xs">No registrations found.</p>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this registration? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  )
}
