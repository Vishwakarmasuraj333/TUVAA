'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Loader2, ArrowLeft, Image as ImageIcon, Video as VideoIcon, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'

interface GalleryItem {
  id: string
  title: string
  type: string
  imageUrl: string
  videoUrl: string | null
  category: string | null
  isPublished: boolean
  createdAt: string
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')
  const [role, setRole] = useState<string>('tester')

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string | null; title: string }>({ id: null, title: '' })
  const [isBulkDelete, setIsBulkDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchRoleAndItems = async () => {
    setLoading(true)
    try {
      const meRes = await fetch('/api/admin/auth/me')
      if (meRes.ok) {
        const data = await meRes.json()
        setRole(data.user.role)
      }

      const res = await fetch('/api/admin/gallery')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      } else {
        toast.error('Failed to load gallery items')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load gallery items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoleAndItems()
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
        const toastId = toast.loading('Deleting selected items...')
        const deletePromises = selectedIds.map((id) =>
          fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
        )
        const results = await Promise.all(deletePromises)
        const successes = results.filter((res) => res.ok).length
        toast.success(`Successfully deleted ${successes} items`, { id: toastId })
        fetchRoleAndItems()
        setSelectedIds([])
      } else {
        if (!itemToDelete.id) return
        const res = await fetch(`/api/admin/gallery/${itemToDelete.id}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          toast.success('Gallery item deleted successfully!')
          setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id))
          setSelectedIds((prev) => prev.filter((item) => item !== itemToDelete.id))
        } else {
          const err = await res.json()
          toast.error(err.message || 'Failed to delete item.')
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('Error executing delete action.')
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

    setItemToDelete({ id: null, title: `${selectedIds.length} selected gallery items` })
    setIsBulkDelete(true)
    setDeleteDialogOpen(true)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredItems.map((item) => item.id))
    }
  }

  const filteredItems = items.filter((item) => {
    if (filterType === 'all') return true
    return item.type === filterType
  })

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
            Manage Gallery
          </h1>
        </div>
        {!isTester && (
          <Link href="/admin/gallery/new">
            <button className="btn-primary-hover flex items-center justify-center gap-1.5 text-white font-cinzel font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-sm shadow-md transition-all cursor-pointer">
              <Plus className="h-4 w-4" /> Add Item
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

      {/* Filters Toggles */}
      <div className="flex bg-[#f7f3e8] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded p-0.5 self-start w-fit">
        {(['all', 'image', 'video'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setFilterType(t)
              setSelectedIds([])
            }}
            className={`px-4 py-2 text-xs font-cinzel tracking-wider uppercase rounded-sm transition-all cursor-pointer font-bold ${
              filterType === t
                ? 'bg-[#DB9E30] text-[#0d0905]'
                : 'text-[#8b8178] hover:text-[#DB9E30]'
            }`}
          >
            {t === 'all' ? 'All' : t === 'image' ? 'Images' : 'Videos'}
          </button>
        ))}
      </div>

      {/* Content list */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#e8dfc8]/80 dark:border-[#2a211a]/80 bg-[#fbfaf8] dark:bg-[#1c1510] text-xs font-cinzel tracking-wider text-[#35170f] dark:text-[#DB9E30] font-bold">
                {!isTester && (
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                )}
                <th className="p-4">Media</th>
                <th className="p-4">Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                {!isTester && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]/30 text-xs font-medium text-[#5a5048] dark:text-white/70">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#fbfaf8] dark:hover:bg-white/5 transition-colors">
                  {!isTester && (
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="p-4">
                    <div className="relative w-14 h-10 rounded overflow-hidden border border-[#e8dfc8] dark:border-[#2a211a] bg-black">
                      <img
                        src={item.imageUrl || '/images/gallery-placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = '/images/gallery-placeholder.jpg'
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-4 font-bold text-[#35170f] dark:text-white">{item.title}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5">
                      {item.type === 'image' ? (
                        <>
                          <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                          <span>Image</span>
                        </>
                      ) : (
                        <>
                          <VideoIcon className="h-3.5 w-3.5 text-green-500" />
                          <span>Video</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-4">{item.category || 'General'}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        item.isPublished
                          ? 'bg-green-500/10 border border-green-500/30 text-green-500'
                          : 'bg-zinc-500/10 border border-zinc-500/30 text-zinc-500'
                      }`}
                    >
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  {!isTester && (
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/gallery/${item.id}/edit`}>
                          <button className="p-1.5 bg-[#57a68f]/10 hover:bg-[#57a68f] border border-[#57a68f]/20 text-[#42816f] hover:text-white rounded transition-all cursor-pointer">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d]">
          <p className="text-[#8b8178] dark:text-white/45 text-xs font-semibold">No items found in this category.</p>
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
