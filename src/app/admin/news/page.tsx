'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Loader2, RefreshCw, ShieldAlert, Search } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface NewsPost {
  id: string
  title: string
  content: string
  excerpt: string | null
  category: string
  image: string | null
  published: boolean
  createdAt: string
}

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingPost, setEditingPost] = useState<Partial<NewsPost> | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [role, setRole] = useState<string>('tester')

  // Search & Filter
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string | null; title: string }>({ id: null, title: '' })
  const [isBulkDelete, setIsBulkDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form Fields
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('General')
  const [image, setImage] = useState('')
  const [published, setPublished] = useState(true)

  const fetchRoleAndPosts = async () => {
    setLoading(true)
    try {
      const meRes = await fetch('/api/admin/auth/me')
      if (meRes.ok) {
        const data = await meRes.json()
        setRole(data.user.role)
      }

      const res = await fetch('/api/admin/news')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (e) {
      toast.error('Failed to load news posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoleAndPosts()
  }, [])

  const isTester = role === 'tester'

  const handleEdit = (post: NewsPost) => {
    if (isTester) return
    setEditingPost(post)
    setTitle(post.title)
    setContent(post.content)
    setExcerpt(post.excerpt || '')
    setCategory(post.category)
    setImage(post.image || '')
    setPublished(post.published)
    setShowForm(true)
  }

  const handleAddNew = () => {
    if (isTester) return
    setEditingPost(null)
    setTitle('')
    setContent('')
    setExcerpt('')
    setCategory('General')
    setImage('')
    setPublished(true)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (isTester) {
      toast.error('Forbidden: Tester has read-only access')
      return
    }

    setItemToDelete({ id, title: 'this post' })
    setIsBulkDelete(false)
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    setIsDeleting(true)
    try {
      if (isBulkDelete) {
        const toastId = toast.loading('Deleting selected posts...')
        const deletePromises = selectedIds.map((id) =>
          fetch(`/api/admin/news?id=${id}`, { method: 'DELETE' })
        )
        const results = await Promise.all(deletePromises)

        const successes = results.filter((res) => res.ok).length
        toast.success(`Successfully deleted ${successes} posts`, { id: toastId })
        
        fetchRoleAndPosts()
        setSelectedIds([])
      } else {
        if (!itemToDelete.id) return
        const res = await fetch(`/api/admin/news?id=${itemToDelete.id}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          toast.success('Post deleted successfully')
          setPosts((prev) => prev.filter((p) => p.id !== itemToDelete.id))
          setSelectedIds((prev) => prev.filter((item) => item !== itemToDelete.id))
        } else {
          throw new Error('Delete failed')
        }
      }
    } catch (error) {
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

    setItemToDelete({ id: null, title: `${selectedIds.length} selected news posts` })
    setIsBulkDelete(true)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isTester) {
      toast.error('Forbidden: Tester has read-only access')
      return
    }

    if (!title || !content || !category) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      // Auto-generate slug from title
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const payload = {
        id: editingPost?.id,
        title,
        content,
        excerpt: excerpt || null,
        category,
        image: image || null,
        published,
        slug: generatedSlug,
      }

      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(editingPost ? 'Post updated successfully' : 'Post created successfully')
        setShowForm(false)
        fetchRoleAndPosts()
      } else {
        const err = await res.json()
        toast.error(err.message || 'Failed to save post')
      }
    } catch (e) {
      toast.error('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPosts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPosts.map((p) => p.id))
    }
  }

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-10">
      
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-4">
        <div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider">
            News Manager
          </h1>
          <p className="text-xs text-gray-500 dark:text-white/50 mt-1">Manage articles, updates, and bulletin releases.</p>
        </div>
        {!isTester && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 bg-[#DB9E30] hover:bg-[#57a68f] text-white font-cinzel font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-sm shadow transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Article
          </button>
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

      {showForm && !isTester ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm p-6 space-y-6 max-w-3xl shadow-md">
          <h3 className="font-cinzel text-xs font-bold text-[#DB9E30] uppercase tracking-widest border-b border-[#e8dfc8] dark:border-[#2a211a] pb-2">
            {editingPost ? 'Edit Article' : 'Create New Article'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white"
                placeholder="e.g. BBAM Festival Gala"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Festival">Festival (BBAM)</option>
                <option value="Sports">Sports & Sailing</option>
                <option value="Health">Mental Health</option>
                <option value="Community">Community</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white"
                placeholder="e.g. /images/hero-bbam.jpg"
              />
            </div>
            <div className="space-y-1.5 flex items-end pb-3">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-white/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4.5 w-4.5 rounded text-[#DB9E30]"
                />
                Publish Instantly
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Excerpt / Summary</label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white"
              placeholder="Short introductory highlight..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Article Content *</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white resize-none"
              placeholder="Write the full post contents here..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#DB9E30] hover:bg-[#57a68f] disabled:opacity-50 text-white font-cinzel font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-all cursor-pointer flex items-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Article
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-gray-300 dark:border-white/20 text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 font-cinzel font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#17110d] p-4 rounded-sm border border-[#e8dfc8] dark:border-[#2a211a]">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#8b8178]" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-gray-800 dark:text-white rounded-sm text-xs focus:outline-none focus:border-[#DB9E30] placeholder-[#8b8178]/55"
              />
            </div>
            <div className="text-xs font-cinzel font-bold text-[#8b8178] dark:text-white/50 uppercase tracking-wider">
              Total: {filteredPosts.length} Articles
            </div>
          </div>

          {loading ? (
            <div className="w-full h-40 flex items-center justify-center text-[#DB9E30]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#e8dfc8]/80 dark:border-[#2a211a]/80 bg-[#fbfaf8] dark:bg-[#1c1510] font-cinzel tracking-widest text-[#35170f] dark:text-[#DB9E30] text-[10px] uppercase font-bold">
                    {!isTester && (
                      <th className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === filteredPosts.length && filteredPosts.length > 0}
                          onChange={toggleSelectAll}
                          className="cursor-pointer"
                        />
                      </th>
                    )}
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-white/80 leading-normal divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]/30">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      {!isTester && (
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(post.id)}
                            onChange={() => toggleSelect(post.id)}
                            className="cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="p-4 font-semibold text-gray-800 dark:text-white uppercase tracking-wide">{post.title}</td>
                      <td className="p-4">{post.category}</td>
                      <td className="p-4">{formatDate(post.createdAt)}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${
                            post.published
                              ? 'bg-[#57a68f]/10 border-[#57a68f]/20 text-[#42816f]'
                              : 'bg-zinc-100 dark:bg-[#1c1510] border-zinc-200 dark:border-[#2a211a] text-zinc-500'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-center flex items-center justify-center gap-3">
                        {!isTester ? (
                          <>
                            <button
                              onClick={() => handleEdit(post)}
                              className="p-1.5 bg-[#57a68f]/10 hover:bg-[#57a68f] text-[#42816f] hover:text-white border border-[#57a68f]/20 rounded-sm transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-sm transition-all cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-medium">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-white/40 text-sm border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d]">
              No news articles found. Start by creating an article.
            </div>
          )}
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
