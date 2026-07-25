'use client'

import { useState, useEffect } from 'react'
import { Trash2, Loader2, Search, Filter } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'
import { format } from 'date-fns'

interface AfricanGroupApplication {
  id: string
  fullName: string
  emailAddress: string
  contactNumber: string
  communityGroupName: string
  communityGroupAddress: string
  message: string | null
  status: string
  createdAt: string
}

export default function AdminGroupsPage() {
  const [applications, setApplications] = useState<AfricanGroupApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [updating, setUpdating] = useState<string | null>(null)

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/community-groups')
      if (res.ok) {
        const data = await res.json()
        setApplications(data)
      }
    } catch (e) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleDelete = async (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/community-groups?id=${itemToDelete}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Application deleted')
        fetchApplications()
      } else {
        toast.error('Delete failed (Tester?)')
      }
    } catch (e) {
      toast.error('Failed to delete application')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/community-groups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        toast.success(`Status updated to ${status}`)
        fetchApplications()
      } else {
        toast.error('Update failed (Tester?)')
      }
    } catch (e) {
      toast.error('Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.communityGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || app.status.toUpperCase() === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gold-500/20 pb-4 gap-4">
        <div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
            Community Group Applications
          </h1>
          <p className="text-xs text-white/55 mt-1">Manage African community group registrations.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by group name, applicant, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-white"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-white appearance-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="w-full h-40 flex items-center justify-center text-gold-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="glass-panel border border-gold-500/20 rounded-lg overflow-x-auto shadow-md">
          <table className="w-full text-xs text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gold-500/20 bg-gold-500/5 font-cinzel tracking-widest text-gold-500 text-[10px] uppercase">
                <th className="p-4">Date</th>
                <th className="p-4">Group Name</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white/80 leading-normal divide-y divide-gold-500/10">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gold-500/5 transition-colors group">
                  <td className="p-4">{format(new Date(app.createdAt), 'MMM d, yyyy')}</td>
                  <td className="p-4">
                    <div className="font-semibold text-white uppercase tracking-wide">{app.communityGroupName}</div>
                    <div className="text-[10px] text-white/50">{app.communityGroupAddress}</div>
                  </td>
                  <td className="p-4">
                    <div>{app.fullName}</div>
                    <div className="text-[10px] text-white/50">{app.emailAddress}</div>
                    <div className="text-[10px] text-white/50">{app.contactNumber}</div>
                  </td>
                  <td className="p-4">
                    <select
                      value={app.status.toUpperCase()}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      disabled={updating === app.id}
                      className="bg-black/60 border border-gold-500/30 rounded px-2 py-1 text-xs text-white disabled:opacity-50"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-1.5 bg-sunset-600/10 hover:bg-sunset-600 text-sunset-500 hover:text-white border border-sunset-500/20 rounded transition-all cursor-pointer inline-flex"
                      title="Delete"
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
        <div className="text-center py-12 text-white/40 text-sm border border-gold-500/10 rounded-lg glass-panel">
          No applications found matching your criteria.
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this community group application? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  )
}
