'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  Video as VideoIcon,
  ShieldAlert,
  Search,
  Grid,
  List,
  Copy,
  Check,
  Tag,
  Eye,
  EyeOff,
} from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { formatDate } from '@/lib/utils'

interface GalleryItem {
  id: string
  title: string
  type: string
  imageUrl: string | null
  videoUrl: string | null
  thumbnailUrl: string | null
  publicId: string | null
  category: string | null
  altText: string | null
  isPublished: boolean
  createdAt: string
}

const CATEGORIES = ['All', 'General', 'BBAM', 'Events', 'Culture', 'Community', 'Youth', 'Services']

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkCategory, setBulkCategory] = useState<string>('General')

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string | null; title: string }>({ id: null, title: '' })
  const [isBulkDelete, setIsBulkDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isTester = currentUser?.role === 'tester'

  const fetchAuthAndItems = async () => {
    setLoading(true)
    try {
      const meRes = await fetch('/api/admin/auth/me')
      if (meRes.ok) {
        const meData = await meRes.json()
        setCurrentUser(meData.user)
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
    fetchAuthAndItems()
  }, [])

  // Single Delete
  const handleDeleteClick = (id: string, title: string) => {
    if (isTester) {
      toast.error('Read-only users cannot perform this action.')
      return
    }
    setItemToDelete({ id, title })
    setIsBulkDelete(false)
    setDeleteDialogOpen(true)
  }

  // Bulk Delete
  const handleBulkDeleteClick = () => {
    if (isTester) {
      toast.error('Read-only users cannot perform this action.')
      return
    }
    if (selectedIds.length === 0) return
    setItemToDelete({ id: null, title: `${selectedIds.length} selected items` })
    setIsBulkDelete(true)
    setDeleteDialogOpen(true)
  }

  // Execute Delete (Single or Bulk)
  const executeDelete = async () => {
    setIsDeleting(true)
    try {
      if (isBulkDelete) {
        const res = await fetch('/api/admin/gallery/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds }),
        })
        const data = await res.json()
        if (res.ok && data.success) {
          toast.success(data.message || `${selectedIds.length} items deleted successfully.`)
          setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          setSelectedIds([])
        } else {
          toast.error(data.message || 'Failed to delete items.')
        }
      } else {
        if (!itemToDelete.id) return
        const res = await fetch(`/api/admin/gallery/${itemToDelete.id}`, {
          method: 'DELETE',
        })
        const data = await res.json()
        if (res.ok && data.success !== false) {
          toast.success(data.message || 'Gallery item deleted successfully.')
          setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id))
          setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete.id))
        } else {
          toast.error(data.message || 'Failed to delete gallery item.')
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

  // Bulk Change Category
  const handleBulkChangeCategory = async () => {
    if (isTester) {
      toast.error('Read-only users cannot perform this action.')
      return
    }
    if (selectedIds.length === 0) return

    try {
      const res = await fetch('/api/admin/gallery/bulk-category', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, category: bulkCategory }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(data.message || 'Category updated for selected items.')
        setItems((prev) =>
          prev.map((item) => (selectedIds.includes(item.id) ? { ...item, category: bulkCategory } : item))
        )
      } else {
        toast.error(data.message || 'Failed to update category.')
      }
    } catch (e) {
      toast.error('Error updating category.')
    }
  }

  // Bulk Publish / Unpublish
  const handleBulkPublishStatus = async (isPublished: boolean) => {
    if (isTester) {
      toast.error('Read-only users cannot perform this action.')
      return
    }
    if (selectedIds.length === 0) return

    try {
      const res = await fetch('/api/admin/gallery/bulk-publish', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, isPublished }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(data.message || 'Publish status updated for selected items.')
        setItems((prev) =>
          prev.map((item) => (selectedIds.includes(item.id) ? { ...item, isPublished } : item))
        )
      } else {
        toast.error(data.message || 'Failed to update publish status.')
      }
    } catch (e) {
      toast.error('Error updating publish status.')
    }
  }

  // Copy Media URL
  const handleCopyUrl = (url: string | null) => {
    if (!url) return
    navigator.clipboard.writeText(url)
    toast.success('Media URL copied to clipboard!')
  }

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredItems.map((item) => item.id))
    }
  }

  // Filtering
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
      (item.altText && item.altText.toLowerCase().includes(search.toLowerCase()))

    const matchesType = filterType === 'all' || item.type === filterType

    const matchesCategory = filterCategory === 'All' || item.category === filterCategory

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && item.isPublished) ||
      (filterStatus === 'draft' && !item.isPublished)

    return matchesSearch && matchesType && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto pb-12 font-roboto">
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
            Gallery Manager
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {isTester && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-cinzel text-xs font-bold uppercase tracking-widest rounded-sm">
              <ShieldAlert className="w-3.5 h-3.5" /> Read Only Mode
            </span>
          )}
          {!isTester && (
            <Link href="/admin/gallery/new">
              <button className="btn-primary-hover flex items-center justify-center gap-1.5 text-white font-cinzel font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-sm shadow-md transition-all cursor-pointer">
                <Plus className="h-4 w-4" /> Add Gallery Items
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] p-4 rounded-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#8b8178] dark:text-white/40" />
            <input
              type="text"
              placeholder="Search title, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white placeholder-[#8b8178]/70"
            />
          </div>

          {/* Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-[#DB9E30]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-[#DB9E30]"
            >
              <option value="all">Status: All</option>
              <option value="published">Status: Published</option>
              <option value="draft">Status: Draft</option>
            </select>

            {/* Type Toggles */}
            <div className="flex bg-[#f7f3e8] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded p-0.5">
              {(['all', 'image', 'video'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFilterType(t)
                    setSelectedIds([])
                  }}
                  className={`px-3 py-1.5 text-[11px] font-cinzel tracking-wider uppercase rounded-sm transition-all cursor-pointer font-bold ${
                    filterType === t
                      ? 'bg-[#DB9E30] text-[#0d0905]'
                      : 'text-[#8b8178] hover:text-[#DB9E30]'
                  }`}
                >
                  {t === 'all' ? 'All' : t === 'image' ? 'Images' : 'Videos'}
                </button>
              ))}
            </div>

            {/* Grid / Table View Switcher */}
            <div className="flex border border-[#e8dfc8] dark:border-[#2a211a] rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#DB9E30] text-black'
                    : 'bg-white dark:bg-[#17110d] text-[#8b8178] hover:text-[#DB9E30]'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#DB9E30] text-black'
                    : 'bg-white dark:bg-[#17110d] text-[#8b8178] hover:text-[#DB9E30]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Controls Bar */}
      {selectedIds.length > 0 && !isTester && (
        <div className="bg-[#57a68f]/10 border border-[#57a68f]/30 p-3.5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#42816f] dark:text-[#57a68f]" />
            <span className="text-[#42816f] dark:text-[#57a68f] font-bold">
              {selectedIds.length} item(s) selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-2.5 py-1.5 rounded text-xs focus:outline-none"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBulkChangeCategory}
                className="px-3 py-1.5 bg-[#57a68f] hover:bg-[#57a68f]/80 text-white font-cinzel text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow"
              >
                Apply Category
              </button>
            </div>

            {/* Publish / Unpublish Buttons */}
            <button
              onClick={() => handleBulkPublishStatus(true)}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-cinzel text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow flex items-center gap-1"
            >
              <Eye className="w-3 h-3" /> Publish
            </button>
            <button
              onClick={() => handleBulkPublishStatus(false)}
              className="px-3 py-1.5 bg-zinc-600 hover:bg-zinc-500 text-white font-cinzel text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow flex items-center gap-1"
            >
              <EyeOff className="w-3 h-3" /> Unpublish
            </button>

            {/* Delete Selected */}
            <button
              onClick={handleBulkDeleteClick}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-cinzel text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer shadow flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Main Gallery List */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
        </div>
      ) : filteredItems.length > 0 ? (
        viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const displayUrl = item.imageUrl || item.thumbnailUrl || item.videoUrl
              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-[#17110d] border rounded-sm overflow-hidden shadow-sm flex flex-col justify-between transition-all ${
                    selectedIds.includes(item.id)
                      ? 'border-[#DB9E30] ring-2 ring-[#DB9E30]/20'
                      : 'border-[#e8dfc8] dark:border-[#2a211a] hover:border-[#DB9E30]/40'
                  }`}
                >
                  {/* Card Media Header */}
                  <div className="relative w-full h-44 bg-black group overflow-hidden">
                    <img
                      src={displayUrl || '/images/gallery-placeholder.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = '/images/gallery-placeholder.jpg'
                      }}
                    />

                    {/* Checkbox Overlay */}
                    {!isTester && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="absolute top-2.5 left-2.5 w-4 h-4 accent-[#DB9E30] cursor-pointer z-10"
                      />
                    )}

                    {/* Type Badge */}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-white font-cinzel text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                      {item.type === 'image' ? (
                        <ImageIcon className="w-3 h-3 text-blue-400" />
                      ) : (
                        <VideoIcon className="w-3 h-3 text-green-400" />
                      )}
                      {item.type}
                    </span>

                    {/* Category Badge */}
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-[#DB9E30] text-[#0d0905] font-cinzel text-[9px] font-bold uppercase tracking-wider rounded">
                      {item.category || 'General'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#35170f] dark:text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#8b8178] dark:text-white/50 mt-1">
                        Added {formatDate(item.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#e8dfc8]/50 dark:border-[#2a211a]">
                      <span
                        className={`text-[9px] font-cinzel font-bold uppercase px-2 py-0.5 rounded border ${
                          item.isPublished
                            ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                            : 'bg-zinc-500/10 border-zinc-500/30 text-zinc-500'
                        }`}
                      >
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>

                      {/* Card Actions */}
                      {isTester ? (
                        <span className="text-[10px] font-cinzel font-bold text-zinc-400 uppercase tracking-widest italic">
                          Read only
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(item.imageUrl || item.videoUrl)}
                            className="p-1.5 text-zinc-500 hover:text-[#DB9E30] rounded transition-colors cursor-pointer"
                            title="Copy Media URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <Link href={`/admin/gallery/${item.id}/edit`}>
                            <button
                              type="button"
                              className="p-1.5 text-[#57a68f] hover:text-[#57a68f]/80 rounded transition-colors cursor-pointer"
                              title="Edit Item"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(item.id, item.title)}
                            className="p-1.5 text-red-500 hover:text-red-600 rounded transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* TABLE VIEW */
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
                        className="cursor-pointer accent-[#DB9E30]"
                      />
                    </th>
                  )}
                  <th className="p-4">Media</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]/30 text-xs font-medium text-[#5a5048] dark:text-white/70">
                {filteredItems.map((item) => {
                  const displayUrl = item.imageUrl || item.thumbnailUrl || item.videoUrl
                  return (
                    <tr key={item.id} className="hover:bg-[#fbfaf8] dark:hover:bg-white/5 transition-colors">
                      {!isTester && (
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            className="cursor-pointer accent-[#DB9E30]"
                          />
                        </td>
                      )}
                      <td className="p-4">
                        <div className="relative w-14 h-10 rounded overflow-hidden border border-[#e8dfc8] dark:border-[#2a211a] bg-black">
                          <img
                            src={displayUrl || '/images/gallery-placeholder.jpg'}
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
                      <td className="p-4 text-right">
                        {isTester ? (
                          <span className="text-[10px] font-cinzel font-bold text-zinc-400 uppercase tracking-widest italic">
                            Read only
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleCopyUrl(item.imageUrl || item.videoUrl)}
                              className="p-1.5 text-zinc-500 hover:text-[#DB9E30] rounded transition-colors cursor-pointer"
                              title="Copy Media URL"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <Link href={`/admin/gallery/${item.id}/edit`}>
                              <button className="p-1.5 bg-[#57a68f]/10 hover:bg-[#57a68f] border border-[#57a68f]/20 text-[#42816f] hover:text-white rounded transition-all cursor-pointer">
                                <Edit className="h-4 w-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(item.id, item.title)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded transition-all cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d]">
          <p className="text-[#8b8178] dark:text-white/45 text-xs font-semibold">
            No gallery items found for this filter.
          </p>
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
