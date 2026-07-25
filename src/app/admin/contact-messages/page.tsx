'use client'

import { useState, useEffect } from 'react'
import { Mail, Trash2, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import Link from 'next/link'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/contact-messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      } else {
        toast.error('Failed to load messages')
      }
    } catch (e) {
      toast.error('Failed to connect to messages API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDelete = async (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/contact-messages/${itemToDelete}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Message deleted successfully')
        fetchMessages()
      } else {
        const errData = await res.json()
        throw new Error(errData.message || 'Delete failed')
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete message')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto pb-10">
      <div className="border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-4 space-y-1">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#DB9E30]/80 uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
          Contact Messages
        </h1>
        <p className="text-xs text-[#8b8178] dark:text-white/50 font-medium leading-none">
          Read and manage inquiries submitted through the public contact forms.
        </p>
      </div>

      {loading ? (
        <div className="w-full h-40 flex items-center justify-center text-[#DB9E30]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm p-6 space-y-4 hover:shadow-md transition-shadow relative"
            >
              {/* Message Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#35170f] dark:text-white font-cinzel uppercase tracking-wider">
                    {msg.subject || 'No Subject'}
                  </h3>
                  <div className="text-[11px] text-[#8b8178] dark:text-white/60 flex flex-wrap gap-x-4">
                    <span>Sender: <strong className="text-[#35170f] dark:text-white">{msg.name}</strong> ({msg.email})</span>
                    {msg.phone && <span>Phone: {msg.phone}</span>}
                    <span>Date: {formatDate(msg.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-500 border border-red-200 dark:border-red-500/20 rounded-sm transition-colors cursor-pointer shrink-0"
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Message Content */}
              <p className="text-xs sm:text-sm text-[#5a5048] dark:text-white/80 whitespace-pre-line leading-relaxed bg-[#faf8f5] dark:bg-[#1c1510] border border-[#e8dfc8]/30 dark:border-[#2a211a] p-4 rounded-sm">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d] shadow-sm">
          <p className="text-[#8b8178] dark:text-white/40 text-xs font-medium">No contact messages found.</p>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this contact message? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  )
}
