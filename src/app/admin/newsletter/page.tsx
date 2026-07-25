'use client'

import { useState, useEffect } from 'react'
import { Send, Trash2, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { formatDate } from '@/lib/utils'

interface Subscriber {
  id: string
  email: string
  createdAt: string
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/newsletter')
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data)
      }
    } catch (e) {
      toast.error('Failed to load subscribers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const handleDelete = async (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/newsletter?id=${itemToDelete}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Subscriber removed successfully')
        fetchSubscribers()
      } else {
        throw new Error('Delete failed')
      }
    } catch (e) {
      toast.error('Failed to remove subscriber')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast.error('No subscribers to export')
      return
    }

    // Generate CSV contents
    const headers = 'ID,Email,SubscribedAt\n'
    const rows = subscribers
      .map((s) => `"${s.id}","${s.email}","${s.createdAt}"`)
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `tuvaa_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`)
    a.click()
    toast.success('Subscribers list exported as CSV successfully!')
  }

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="flex justify-between items-center border-b border-gold-500/20 pb-4">
        <div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-white/55 mt-1">Manage email listings subscribed to TUVAA newsletters.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-gold-600 hover:bg-gold-500 text-[#0d0905] font-cinzel font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded shadow transition-all active:scale-95 cursor-pointer"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="w-full h-40 flex items-center justify-center text-gold-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : subscribers.length > 0 ? (
        <div className="glass-panel border border-gold-500/20 rounded-lg overflow-x-auto shadow-md">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-500/20 bg-gold-500/5 font-cinzel tracking-widest text-gold-500 text-[10px] uppercase">
                <th className="p-4">Subscriber Email</th>
                <th className="p-4">Subscription Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white/80 leading-normal divide-y divide-gold-500/10">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gold-500/5 transition-colors">
                  <td className="p-4 font-semibold text-white tracking-wide">{sub.email}</td>
                  <td className="p-4">{formatDate(sub.createdAt)}</td>
                  <td className="p-4 text-center flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 bg-sunset-600/10 hover:bg-sunset-600 text-sunset-500 hover:text-white border border-sunset-500/20 rounded transition-all cursor-pointer"
                      title="Remove subscriber"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-white/40 text-sm border border-gold-500/10 rounded-lg">
          No newsletter subscribers recorded.
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        description="Are you sure you want to remove this subscriber? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  )
}
