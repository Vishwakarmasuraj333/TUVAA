'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Check, X, Trash2, Loader2, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'

interface ServiceComment {
  id: string
  serviceSlug: string
  name: string
  email: string
  comment: string
  status: string
  createdAt: string
  service?: {
    title: string
  }
}

export default function AdminServiceCommentsPage() {
  const [comments, setComments] = useState<ServiceComment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isTester = currentUser?.role === 'tester'

  const fetchAuthAndComments = async () => {
    try {
      const meRes = await fetch('/api/admin/auth/me')
      if (meRes.ok) {
        const meData = await meRes.json()
        setCurrentUser(meData.user)
      }

      const res = await fetch('/api/admin/service-comments')
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      } else {
        toast.error('Failed to load service comments')
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast.error('Error loading service comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthAndComments()
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (isTester) {
      toast.error('Read-only users cannot perform this action.')
      return
    }

    try {
      const res = await fetch(`/api/admin/service-comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()

      if (res.ok && data.success !== false) {
        toast.success(data.message || `Comment ${newStatus} successfully`)
        setComments(
          comments.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        )
      } else {
        toast.error(data.message || 'Failed to update status')
      }
    } catch (e) {
      console.error(e)
      toast.error('Error updating comment status')
    }
  }

  const handleDeleteClick = (id: string) => {
    if (isTester) {
      toast.error('Read-only users cannot perform this action.')
      return
    }
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/service-comments/${itemToDelete}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (res.ok && data.success !== false) {
        toast.success(data.message || 'Comment deleted successfully')
        setComments(comments.filter((c) => c.id !== itemToDelete))
      } else {
        toast.error(data.message || 'Failed to delete comment')
      }
    } catch (e) {
      console.error(e)
      toast.error('Error executing delete action')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const filtered = comments.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.comment.toLowerCase().includes(search.toLowerCase()) ||
      c.serviceSlug.toLowerCase().includes(search.toLowerCase())
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
        <div className="flex items-center justify-between">
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
            Service Comments
          </h1>
          {isTester && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-cinzel text-xs font-bold uppercase tracking-widest rounded-sm">
              <ShieldAlert className="w-3.5 h-3.5" /> Read Only Mode
            </span>
          )}
        </div>
      </div>

      {/* Search & Stats bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#17110d] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a]">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#8b8178] dark:text-white/40" />
          <input
            type="text"
            placeholder="Search comments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white placeholder-[#8b8178]/70"
          />
        </div>
        <div className="text-xs font-cinzel font-bold text-[#8b8178] dark:text-white/60 uppercase tracking-wider">
          Total: <span className="text-[#35170f] dark:text-[#DB9E30]">{filtered.length}</span> Comments
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
              <tr className="border-b border-[#e8dfc8]/80 dark:border-[#2a211a]/80 bg-[#fbfaf8] dark:bg-[#1c1510] text-xs font-cinzel tracking-wider text-[#35170f] dark:text-[#DB9E30] font-bold">
                <th className="p-4">Author</th>
                <th className="p-4">Service</th>
                <th className="p-4">Comment Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]/30 text-xs font-medium text-[#5a5048] dark:text-white/70">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#fbfaf8] dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-[#35170f] dark:text-white">{c.name}</p>
                    <p className="text-[10px] text-[#8b8178] dark:text-white/50">{c.email}</p>
                  </td>
                  <td className="p-4 font-bold text-[#35170f] dark:text-white truncate max-w-[140px]">
                    {c.service?.title || c.serviceSlug}
                  </td>
                  <td className="p-4 max-w-sm whitespace-pre-line text-[#8b8178] dark:text-white/60">{c.comment}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${
                        c.status === 'approved'
                          ? 'bg-[#57a68f]/10 border-[#57a68f]/20 text-[#42816f] dark:text-[#57a68f]'
                          : ''
                      } ${
                        c.status === 'pending'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                          : ''
                      } ${
                        c.status === 'rejected'
                          ? 'bg-red-500/10 border-red-500/20 text-red-500 dark:text-red-400'
                          : ''
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {isTester ? (
                      <span className="text-[10px] font-cinzel font-bold text-zinc-400 uppercase tracking-widest italic">
                        Read only
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        {c.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'approved')}
                            className="p-2 bg-[#57a68f]/10 hover:bg-[#57a68f]/20 border border-[#57a68f]/20 text-[#42816f] rounded-sm transition-colors cursor-pointer"
                            title="Approve Comment"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {c.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'rejected')}
                            className="p-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-600 rounded-sm transition-colors cursor-pointer"
                            title="Reject Comment"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(c.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-sm transition-colors cursor-pointer"
                          title="Delete Comment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d]">
          <p className="text-[#8b8178] dark:text-white/40 text-xs">No service comments found.</p>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  )
}
