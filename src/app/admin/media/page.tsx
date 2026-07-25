'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, Search, Image as ImageIcon, Video as VideoIcon, Loader2, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'

interface MediaItem {
  id: string
  title: string
  url: string
  type: string // "image" | "video"
  createdAt: string
}

export default function MediaManagerPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [role, setRole] = useState<string>('tester')

  // Filters & Search
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video'>('all')

  // Form Fields
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState('image')

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string | null; title: string }>({ id: null, title: '' })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchRole = async () => {
    try {
      const res = await fetch('/api/admin/auth/me')
      if (res.ok) {
        const data = await res.json()
        setRole(data.user.role)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      } else {
        toast.error('Failed to load media items')
      }
    } catch (e) {
      toast.error('Error fetching media assets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRole()
    fetchItems()
  }, [])

  const handleCopy = (id: string, path: string) => {
    navigator.clipboard.writeText(path)
    setCopiedId(id)
    toast.success('Media URL copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string, itemTitle: string) => {
    if (role === 'tester') {
      toast.error('Forbidden: Tester has read-only access')
      return
    }

    setItemToDelete({ id, title: itemTitle })
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!itemToDelete.id) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/media/${itemToDelete.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Media record deleted successfully')
        setItems(items.filter((item) => item.id !== itemToDelete.id))
      } else {
        const err = await res.json()
        toast.error(err.message || 'Failed to delete media asset')
      }
    } catch (error) {
      toast.error('Error executing delete action')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (role === 'tester') {
      toast.error('Forbidden: Tester has read-only access')
      return
    }

    if (!title || !file) {
      toast.error('Please enter title and select a file')
      return
    }

    setAdding(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('type', type)
      formData.append('file', file)

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        toast.success('Media asset added successfully!')
        setTitle('')
        setFile(null)
        // Reset file input value
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        fetchItems()
      } else {
        const err = await res.json()
        toast.error(err.message || 'Failed to add media asset')
      }
    } catch (e) {
      toast.error('Error adding media asset')
    } finally {
      setAdding(false)
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.url.toLowerCase().includes(search.toLowerCase())
    const matchesTab = activeTab === 'all' || item.type === activeTab
    return matchesSearch && matchesTab
  })

  const isTester = role === 'tester'

  return (
    <div className="space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold-500/20 pb-4 gap-4">
        <div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider">
            Media Manager
          </h1>
          <p className="text-xs opacity-60 mt-1">
            Register static image/video assets for use in gallery items, events, news, or slide content.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Add Media Entry */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded p-6 shadow-md">
            <h3 className="font-cinzel text-xs font-bold text-[#DB9E30] uppercase tracking-widest border-b border-[#e8dfc8] dark:border-[#2a211a] pb-3 mb-4">
              Add Media Path
            </h3>

            {isTester ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 rounded text-xs leading-relaxed">
                Add media forms are disabled in <strong>Tester Mode (Read-Only)</strong>. You cannot upload or delete assets.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-cinzel text-gold-500 dark:text-[#DB9E30] uppercase tracking-widest font-bold">
                    Asset Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white"
                    placeholder="e.g. BBAM 2025 Banner"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-cinzel text-gold-500 dark:text-[#DB9E30] uppercase tracking-widest font-bold">
                    Asset Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white"
                  >
                    <option value="image">Image (JPG, PNG, WEBP)</option>
                    <option value="video">Video (MP4, WEBM)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-cinzel text-gold-500 dark:text-[#DB9E30] uppercase tracking-widest font-bold">
                    Upload File *
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept={type === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 text-xs bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#DB9E30]/10 file:text-[#DB9E30] hover:file:bg-[#DB9E30]/20"
                    required
                  />
                  <span className="text-[9px] opacity-50 block leading-tight">
                    Max size: 10MB. Assets are uploaded securely to Cloudinary.
                  </span>
                </div>



                <button
                  type="submit"
                  disabled={adding}
                  className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 disabled:opacity-50 text-[#0d0905] font-cinzel font-bold text-xs uppercase tracking-widest py-2.5 rounded transition-all cursor-pointer shadow-md"
                >
                  {adding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Add Asset
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Assets View list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8b8178]" />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#f7f3e8] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded p-0.5 self-start">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  'px-3 py-1.5 text-[10px] font-cinzel tracking-wider uppercase rounded-sm transition-all cursor-pointer font-bold',
                  activeTab === 'all'
                    ? 'bg-[#DB9E30] text-[#0d0905]'
                    : 'text-[#8b8178] hover:text-[#DB9E30]'
                )}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={cn(
                  'px-3 py-1.5 text-[10px] font-cinzel tracking-wider uppercase rounded-sm transition-all cursor-pointer font-bold',
                  activeTab === 'image'
                    ? 'bg-[#DB9E30] text-[#0d0905]'
                    : 'text-[#8b8178] hover:text-[#DB9E30]'
                )}
              >
                Images
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={cn(
                  'px-3 py-1.5 text-[10px] font-cinzel tracking-wider uppercase rounded-sm transition-all cursor-pointer font-bold',
                  activeTab === 'video'
                    ? 'bg-[#DB9E30] text-[#0d0905]'
                    : 'text-[#8b8178] hover:text-[#DB9E30]'
                )}
              >
                Videos
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded overflow-hidden flex flex-col shadow-sm"
                >
                  {/* Thumbnail Preview container */}
                  <div className="h-36 bg-[#f7f3e8] dark:bg-[#1c1510] border-b border-[#e8dfc8] dark:border-[#2a211a] flex items-center justify-center relative overflow-hidden group">
                    {item.type === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Fallback on load error
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-zinc-500">
                        <VideoIcon className="h-10 w-10 text-gold-500" />
                        <span className="text-[10px] font-cinzel tracking-wider uppercase font-semibold">Video Asset</span>
                      </div>
                    )}

                    {/* Hover actions: view raw asset in new tab */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-black/80 border border-white/20 rounded text-[9px] font-cinzel text-white uppercase tracking-widest">
                        <ExternalLink className="h-3 w-3" /> View Asset
                      </span>
                    </a>

                    {/* Badge type */}
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-sm text-[8px] font-cinzel tracking-widest text-[#DB9E30] uppercase">
                      {item.type === 'image' ? <ImageIcon className="h-3 w-3 inline mr-1" /> : <VideoIcon className="h-3 w-3 inline mr-1" />}
                      {item.type}
                    </span>
                  </div>

                  {/* Body details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="text-left space-y-1">
                      <h4 className="font-cinzel text-xs font-bold text-gray-800 dark:text-white uppercase truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-white/40 truncate font-mono bg-gray-50 dark:bg-black/20 p-1 border border-gray-100 dark:border-[#2a211a]">
                        {item.url}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(item.id, item.url)}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#57a68f]/10 hover:bg-[#57a68f]/20 border border-[#57a68f]/20 text-[#42816f] dark:text-[#57a68f] text-[10px] font-cinzel uppercase tracking-widest py-1.5 rounded transition-all cursor-pointer font-bold"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy Path
                          </>
                        )}
                      </button>

                      {!isTester && (
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded transition-all cursor-pointer"
                          title="Delete Media Entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded bg-white dark:bg-[#17110d]/50">
              <p className="text-gray-500 dark:text-white/40 text-xs">No media assets found matching the filter.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete "${itemToDelete.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}
