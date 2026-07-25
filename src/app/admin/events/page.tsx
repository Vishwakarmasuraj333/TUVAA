'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Loader2, Calendar, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { formatDate } from '@/lib/utils'

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  image: string | null
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [role, setRole] = useState<string>('tester')

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string | null; title: string }>({ id: null, title: '' })
  const [isBulkDelete, setIsBulkDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form Fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState('')

  const fetchRoleAndEvents = async () => {
    setLoading(true)
    try {
      const meRes = await fetch('/api/admin/auth/me')
      if (meRes.ok) {
        const data = await meRes.json()
        setRole(data.user.role)
      }

      const res = await fetch('/api/admin/events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (e) {
      toast.error('Failed to load events calendar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoleAndEvents()
  }, [])

  const isTester = role === 'tester'

  const handleEdit = (evt: Event) => {
    if (isTester) return
    setEditingEvent(evt)
    setTitle(evt.title)
    setDescription(evt.description)
    const d = new Date(evt.date)
    const formattedDate = d.toISOString().slice(0, 16)
    setDate(formattedDate)
    setLocation(evt.location)
    setImage(evt.image || '')
    setShowForm(true)
  }

  const handleAddNew = () => {
    if (isTester) return
    setEditingEvent(null)
    setTitle('')
    setDescription('')
    setDate('')
    setLocation('')
    setImage('')
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (isTester) {
      toast.error('Forbidden: Tester has read-only access')
      return
    }

    setItemToDelete({ id, title: 'this event' })
    setIsBulkDelete(false)
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    setIsDeleting(true)
    try {
      if (isBulkDelete) {
        const toastId = toast.loading('Deleting selected events...')
        const deletePromises = selectedIds.map((id) =>
          fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' })
        )
        const results = await Promise.all(deletePromises)

        const successes = results.filter((res) => res.ok).length
        toast.success(`Successfully deleted ${successes} events`, { id: toastId })
        
        fetchRoleAndEvents()
        setSelectedIds([])
      } else {
        if (!itemToDelete.id) return
        const res = await fetch(`/api/admin/events?id=${itemToDelete.id}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          toast.success('Event deleted successfully')
          setEvents((prev) => prev.filter((e) => e.id !== itemToDelete.id))
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

    setItemToDelete({ id: null, title: `${selectedIds.length} selected events` })
    setIsBulkDelete(true)
    setDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isTester) {
      toast.error('Forbidden: Tester has read-only access')
      return
    }

    if (!title || !description || !date || !location) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const payload = {
        id: editingEvent?.id,
        title,
        description,
        date,
        location,
        image: image || null,
      }

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(editingEvent ? 'Event updated successfully' : 'Event scheduled successfully')
        setShowForm(false)
        fetchRoleAndEvents()
      } else {
        throw new Error('Save failed')
      }
    } catch (e) {
      toast.error('Failed to save event')
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
    if (selectedIds.length === events.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(events.map((e) => e.id))
    }
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-4">
        <div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-gray-800 dark:text-white uppercase tracking-wider">
            Events Calendar Manager
          </h1>
          <p className="text-xs text-gray-500 dark:text-white/50 mt-1">
            Manage scheduled community events, swimming lessons, and festivals.
          </p>
        </div>
        {!isTester && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 bg-[#DB9E30] hover:bg-[#57a68f] text-white font-cinzel font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-sm shadow transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Event
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
            {editingEvent ? 'Edit Scheduled Event' : 'Schedule New Event'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Event Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white"
                placeholder="e.g. BBAM Festival 2025"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Date & Time *</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white"
                placeholder="e.g. Guildhall Square, Southampton"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Image Flyer URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white"
                placeholder="e.g. /images/bbam-popup.jpg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-cinzel text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold">Description *</label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded focus:outline-none focus:border-gold-500 text-sm text-gray-800 dark:text-white resize-none"
              placeholder="Provide information regarding scheduling, highlights, and registration..."
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
              Save Event
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
      ) : loading ? (
        <div className="w-full h-40 flex items-center justify-center text-[#DB9E30]">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : events.length > 0 ? (
        <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#e8dfc8]/80 dark:border-[#2a211a]/80 bg-[#fbfaf8] dark:bg-[#1c1510] font-cinzel tracking-widest text-[#35170f] dark:text-[#DB9E30] text-[10px] uppercase font-bold">
                {!isTester && (
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === events.length && events.length > 0}
                      onChange={toggleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                )}
                <th className="p-4">Event</th>
                <th className="p-4">Date</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-white/80 leading-normal divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a]/30">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  {!isTester && (
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(evt.id)}
                        onChange={() => toggleSelect(evt.id)}
                        className="cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="p-4 font-semibold text-gray-800 dark:text-white uppercase tracking-wide">{evt.title}</td>
                  <td className="p-4">{formatDate(evt.date)}</td>
                  <td className="p-4">{evt.location}</td>
                  <td className="p-4 text-center flex items-center justify-center gap-3">
                    {!isTester ? (
                      <>
                        <button
                          onClick={() => handleEdit(evt)}
                          className="p-1.5 bg-[#57a68f]/10 hover:bg-[#57a68f] text-[#42816f] hover:text-white border border-[#57a68f]/20 rounded-sm transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(evt.id)}
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
          No scheduled events. Start by scheduling an event.
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
