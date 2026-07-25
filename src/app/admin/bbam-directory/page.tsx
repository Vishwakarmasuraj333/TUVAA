'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit, Eye, EyeOff, Loader2, Plus, Search, ShieldAlert, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { directoryTypes, DirectoryType } from '@/data/directory'

interface Listing {
  id: string
  type: DirectoryType
  title: string
  slug: string
  description: string
  image: string | null
  gallery: string[] | null
  category: string | null
  email: string | null
  phone: string | null
  website: string | null
  socialUrl: string | null
  isPublished: boolean
  order: number
}

const emptyForm = {
  type: 'artist' as DirectoryType,
  title: '', slug: '', description: '', image: '', gallery: '', category: '', email: '', phone: '', website: '', socialUrl: '', isPublished: true, order: 0,
}

const typeLabels: Record<DirectoryType, string> = {
  artist: 'Artist', musician: 'Musician', business: 'Business', professional: 'Skills / Professional', community_group: 'Community Group',
}

export default function BbamDirectoryAdminPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [role, setRole] = useState('tester')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [editing, setEditing] = useState<Listing | null | 'new'>(null)
  const [form, setForm] = useState(emptyForm)

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ ids: string[]; title: string }>({ ids: [], title: '' })
  const [isDeleting, setIsDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [meResponse, listingResponse] = await Promise.all([fetch('/api/admin/auth/me'), fetch('/api/admin/bbam-directory')])
      if (meResponse.ok) setRole((await meResponse.json()).user.role)
      if (!listingResponse.ok) throw new Error('Could not load directory listings')
      setListings(await listingResponse.json())
    } catch (error) {
      console.error(error)
      toast.error('Could not load BBAM directory')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const isTester = role === 'tester'
  const filtered = useMemo(() => listings.filter((listing) => {
    const query = search.toLowerCase()
    return (!typeFilter || listing.type === typeFilter) && (!query || `${listing.title} ${listing.description} ${listing.category || ''}`.toLowerCase().includes(query))
  }), [listings, search, typeFilter])

  const openNew = () => { setForm(emptyForm); setEditing('new') }
  const openEdit = (listing: Listing) => {
    setForm({
      type: listing.type, title: listing.title, slug: listing.slug, description: listing.description, image: listing.image || '', gallery: Array.isArray(listing.gallery) ? listing.gallery.join('\n') : '', category: listing.category || '', email: listing.email || '', phone: listing.phone || '', website: listing.website || '', socialUrl: listing.socialUrl || '', isPublished: listing.isPublished, order: listing.order,
    })
    setEditing(listing)
  }

  const updateForm = (field: keyof typeof form, value: string | boolean | number) => setForm((current) => ({ ...current, [field]: value }))
  const generateSlug = (title: string) => title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (isTester) return
    setSaving(true)
    const isNew = editing === 'new'
    try {
      const response = await fetch(isNew ? '/api/admin/bbam-directory' : `/api/admin/bbam-directory/${(editing as Listing).id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, gallery: form.gallery.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean), order: Number(form.order) }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not save listing')
      toast.success(isNew ? 'Listing created' : 'Listing updated')
      setEditing(null)
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save listing')
    } finally { setSaving(false) }
  }

  const openDeleteConfirm = (ids: string[], title: string) => {
    if (isTester || !ids.length) return
    setItemToDelete({ ids, title })
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    setIsDeleting(true)
    try {
      const results = await Promise.all(itemToDelete.ids.map((id) => fetch(`/api/admin/bbam-directory/${id}`, { method: 'DELETE' })))
      const failed = results.filter((result) => !result.ok).length
      failed ? toast.error(`${failed} listing(s) could not be deleted`) : toast.success('Selected listings deleted')
      setSelected([])
      await load()
    } catch (error) {
      toast.error('Error executing delete action')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const togglePublished = async (listing: Listing) => {
    if (isTester) return
    const response = await fetch(`/api/admin/bbam-directory/${listing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !listing.isPublished }) })
    response.ok ? toast.success(listing.isPublished ? 'Listing unpublished' : 'Listing published') : toast.error('Status update failed')
    await load()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12 text-left">
      <header className="flex flex-col justify-between gap-4 border-b border-[#e8dfc8] pb-5 sm:flex-row sm:items-end">
        <div><Link href="/admin" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#DB9E30]"><ArrowLeft className="h-3.5 w-3.5" /> Dashboard</Link><h1 className="mt-2 font-cinzel text-3xl font-extrabold uppercase tracking-wider text-[#35170f] dark:text-white">BBAM Directory</h1></div>
        {!isTester && <button type="button" onClick={openNew} className="btn-primary-hover inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 font-cinzel text-xs font-bold uppercase tracking-widest"><Plus className="h-4 w-4" /> Add listing</button>}
      </header>

      {isTester && <div className="flex items-center gap-2 rounded border border-amber-500/25 bg-amber-500/10 p-4 text-xs text-amber-700 dark:text-amber-400"><ShieldAlert className="h-4 w-4" /> Tester accounts have read-only access.</div>}

      <div className="grid gap-3 rounded-sm border border-[#e8dfc8] bg-white p-4 dark:border-[#2a211a] dark:bg-[#17110d] sm:grid-cols-[1fr_240px_auto]">
        <label className="relative"><span className="sr-only">Search listings</span><Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8b8178]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search directory…" className="w-full border border-[#e8dfc8] bg-[#fdfcfb] py-2 pl-9 pr-3 text-xs text-[#35170f] outline-none focus:border-[#DB9E30]" /></label>
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="border border-[#e8dfc8] bg-[#fdfcfb] px-3 py-2 text-xs text-[#35170f] outline-none"><option value="">All listing types</option>{directoryTypes.map((type) => <option key={type} value={type}>{typeLabels[type]}</option>)}</select>
        {!isTester && selected.length > 0 && <button type="button" onClick={() => openDeleteConfirm(selected, `${selected.length} selected listings`)} className="rounded bg-red-600 px-4 py-2 text-xs font-bold text-white">Delete {selected.length}</button>}
      </div>

      {loading ? <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" /></div> : (
        <div className="overflow-x-auto rounded-sm border border-[#e8dfc8] bg-white dark:border-[#2a211a] dark:bg-[#17110d]">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="border-b border-[#e8dfc8] bg-[#faf8ef] font-cinzel uppercase tracking-wider text-[#35170f]"><tr>{!isTester && <th className="p-4"><input type="checkbox" aria-label="Select all visible listings" checked={filtered.length > 0 && filtered.every((item) => selected.includes(item.id))} onChange={() => setSelected(filtered.every((item) => selected.includes(item.id)) ? selected.filter((id) => !filtered.some((item) => item.id === id)) : [...new Set([...selected, ...filtered.map((item) => item.id)])])} /></th>}<th className="p-4">Order</th><th className="p-4">Title</th><th className="p-4">Type</th><th className="p-4">Category</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-[#e8dfc8]/60 text-[#5a5048] dark:text-white/70">{filtered.map((listing) => <tr key={listing.id} className="hover:bg-[#faf8ef]/60 dark:hover:bg-white/5">{!isTester && <td className="p-4"><input type="checkbox" aria-label={`Select ${listing.title}`} checked={selected.includes(listing.id)} onChange={() => setSelected((ids) => ids.includes(listing.id) ? ids.filter((id) => id !== listing.id) : [...ids, listing.id])} /></td>}<td className="p-4 font-mono text-[#DB9E30]">{listing.order}</td><td className="p-4 font-bold text-[#35170f] dark:text-white">{listing.title}</td><td className="p-4">{typeLabels[listing.type]}</td><td className="p-4">{listing.category || '—'}</td><td className="p-4"><span className={listing.isPublished ? 'text-[#42816f]' : 'text-zinc-500'}>{listing.isPublished ? 'Published' : 'Draft'}</span></td><td className="p-4"><div className="flex justify-end gap-2">{!isTester && <><button type="button" onClick={() => void togglePublished(listing)} className="rounded border border-[#e8dfc8] p-2" aria-label={listing.isPublished ? 'Unpublish listing' : 'Publish listing'}>{listing.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button><button type="button" onClick={() => openEdit(listing)} className="rounded bg-[#57a68f]/15 p-2 text-[#42816f]" aria-label="Edit listing"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => openDeleteConfirm([listing.id], listing.title)} className="rounded bg-red-500/10 p-2 text-red-600" aria-label="Delete listing"><Trash2 className="h-4 w-4" /></button></>}</div></td></tr>)}</tbody>
          </table>
          {!filtered.length && <p className="py-20 text-center text-[#8b8178]">No directory listings found.</p>}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/65 p-4 sm:p-8" onPointerDown={() => !saving && setEditing(null)}>
          <form onSubmit={submit} onPointerDown={(event) => event.stopPropagation()} className="w-full max-w-3xl space-y-5 rounded-sm bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] p-6 text-[#35170f] dark:text-white shadow-2xl sm:p-8">
            <div className="flex items-center justify-between"><h2 className="font-cinzel text-2xl font-bold">{editing === 'new' ? 'Add listing' : 'Edit listing'}</h2><button type="button" onClick={() => setEditing(null)} aria-label="Close editor"><X /></button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title"><input required value={form.title} onChange={(event) => { updateForm('title', event.target.value); if (editing === 'new') updateForm('slug', generateSlug(event.target.value)) }} className="admin-directory-input" /></Field>
              <Field label="Type"><select value={form.type} onChange={(event) => updateForm('type', event.target.value)} className="admin-directory-input">{directoryTypes.map((type) => <option key={type} value={type}>{typeLabels[type]}</option>)}</select></Field>
              <Field label="Slug"><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => updateForm('slug', event.target.value)} className="admin-directory-input" /></Field>
              <Field label="Category"><input value={form.category} onChange={(event) => updateForm('category', event.target.value)} className="admin-directory-input" /></Field>
              <Field label="Image path / URL"><input value={form.image} onChange={(event) => updateForm('image', event.target.value)} placeholder="/images/example.jpg" className="admin-directory-input" /></Field>
              <Field label="Sort order"><input type="number" min="0" value={form.order} onChange={(event) => updateForm('order', Number(event.target.value))} className="admin-directory-input" /></Field>
              <Field label="Email"><input type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} className="admin-directory-input" /></Field>
              <Field label="Phone"><input type="tel" maxLength={20} value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} className="admin-directory-input" /></Field>
              <Field label="Website"><input value={form.website} onChange={(event) => updateForm('website', event.target.value)} className="admin-directory-input" /></Field>
              <Field label="Social URL"><input value={form.socialUrl} onChange={(event) => updateForm('socialUrl', event.target.value)} className="admin-directory-input" /></Field>
            </div>
            <Field label="Description"><textarea required minLength={10} rows={5} value={form.description} onChange={(event) => updateForm('description', event.target.value)} className="admin-directory-input resize-y" /></Field>
            <Field label="Gallery image paths (one per line)"><textarea rows={4} value={form.gallery} onChange={(event) => updateForm('gallery', event.target.value)} placeholder="/images/artist-1.jpg" className="admin-directory-input resize-y" /></Field>
            <label className="flex items-center gap-3 text-xs font-bold"><input type="checkbox" checked={form.isPublished} onChange={(event) => updateForm('isPublished', event.target.checked)} /> Publish listing</label>
            <button type="submit" disabled={saving} className="btn-primary-hover flex w-full items-center justify-center gap-2 rounded-sm py-3 font-cinzel text-xs font-bold uppercase tracking-widest disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? 'Saving…' : 'Save listing'}</button>
          </form>
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${itemToDelete.title}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="block font-cinzel text-[10px] font-bold uppercase tracking-widest">{label}</span>{children}</label>
}
