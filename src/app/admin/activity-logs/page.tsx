'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ActivityLog {
  id: string
  userId: string | null
  action: string
  entity: string
  entityId: string | null
  message: string
  metadata: any
  ipAddress: string | null
  createdAt: string
  user: {
    name: string
    email: string
  } | null
}

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')
  
  // Pagination State
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const limit = 15

  const router = useRouter()

  const fetchLogs = async (currentPage = page, searchQuery = search, actionQ = actionFilter, entityQ = entityFilter) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        search: searchQuery,
        action: actionQ,
        entity: entityQ,
      })

      const res = await fetch(`/api/admin/activity-logs?${queryParams.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs)
        setTotalPages(data.totalPages)
        setTotalLogs(data.total)
      } else {
        if (res.status === 401) {
          router.push('/admin/login')
          return
        }
        toast.error('Failed to load activity logs')
      }
    } catch (e) {
      console.error('Error fetching activity logs:', e)
      toast.error('Error connecting to API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs(1, search, actionFilter, entityFilter)
    setPage(1)
  }, [actionFilter, entityFilter])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchLogs(1, search, actionFilter, entityFilter)
    setPage(1)
  }

  const handleReset = () => {
    setSearch('')
    setActionFilter('')
    setEntityFilter('')
    fetchLogs(1, '', '', '')
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      fetchLogs(newPage, search, actionFilter, entityFilter)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch (e) {
      return dateStr
    }
  }

  const getActionBadgeClass = (action: string) => {
    switch (action.toUpperCase()) {
      case 'LOGIN':
        return 'bg-[#57a68f]/10 border-[#57a68f]/20 text-[#42816f]'
      case 'LOGOUT':
        return 'bg-[#e05326]/10 border-[#e05326]/20 text-[#e05326]'
      case 'CREATE':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600'
      case 'UPDATE':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-600'
      case 'DELETE':
        return 'bg-red-500/10 border-red-500/20 text-red-600'
      default:
        return 'bg-zinc-500/10 border-zinc-500/20 text-zinc-600'
    }
  }

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-5">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#DB9E30]/80 uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
            System Activity Logs
          </h1>
          <p className="text-xs text-[#8b8178] dark:text-white/50 font-medium leading-none">
            Audit logs tracking administration panel operations and state changes.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search logs message or text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8b8178] dark:text-white/40" />
          </div>
          <button
            type="submit"
            className="btn-primary-hover px-4 py-2 text-white font-cinzel font-bold text-xs uppercase tracking-widest rounded-sm cursor-pointer shadow-sm"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white cursor-pointer min-w-[120px]"
          >
            <option value="">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="APPROVE">APPROVE</option>
            <option value="REJECT">REJECT</option>
          </select>

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white cursor-pointer min-w-[120px]"
          >
            <option value="">All Entities</option>
            <option value="USER">USER</option>
            <option value="SERVICE">SERVICE</option>
            <option value="PROJECT">PROJECT</option>
            <option value="EVENT">EVENT</option>
            <option value="GALLERY">GALLERY</option>
            <option value="NEWS">NEWS</option>
            <option value="DONATION">DONATION</option>
            <option value="COMMENT">COMMENT</option>
            <option value="SETTING">SETTING</option>
            <option value="NEWSLETTER">NEWSLETTER</option>
            <option value="CONTACT">CONTACT</option>
            <option value="COMMUNITY_GROUP">COMMUNITY_GROUP</option>
            <option value="EVENT_REGISTRATION">EVENT_REGISTRATION</option>
          </select>

          <button
            onClick={handleReset}
            title="Reset Filters"
            className="p-2 border border-[#e8dfc8] dark:border-[#2a211a] bg-[#fdfcfb] dark:bg-[#1c1510] hover:bg-[#fbfaf8] dark:hover:bg-[#2a211a] text-[#8b8178] dark:text-white/60 rounded-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d] shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
        </div>
      ) : logs.length > 0 ? (
        <div className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[#e8dfc8]/80 dark:border-[#2a211a] bg-[#fbfaf8] dark:bg-[#1c1510] text-xs font-cinzel tracking-wider text-[#35170f] dark:text-[#DB9E30] font-bold">
                  <th className="p-4 w-[18%]">Timestamp</th>
                  <th className="p-4 w-[15%]">User</th>
                  <th className="p-4 w-[12%]">Action</th>
                  <th className="p-4 w-[12%]">Entity</th>
                  <th className="p-4 w-[33%]">Message</th>
                  <th className="p-4 w-[10%]">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dfc8]/30 dark:divide-[#2a211a] text-xs font-medium text-[#5a5048] dark:text-white/70">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fbfaf8] dark:hover:bg-[#1c1510] transition-colors">
                    <td className="p-4 font-mono text-[10px] text-[#8b8178] dark:text-white/40">{formatDate(log.createdAt)}</td>
                    <td className="p-4">
                      {log.user ? (
                        <div>
                          <p className="font-bold text-[#35170f] dark:text-white">{log.user.name}</p>
                          <p className="text-[10px] text-[#8b8178] dark:text-white/50">{log.user.email}</p>
                        </div>
                      ) : (
                        <p className="text-zinc-400 dark:text-white/30 italic">System</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-semibold uppercase text-zinc-600 dark:text-white/60">{log.entity.replace('_', ' ')}</td>
                    <td className="p-4 leading-relaxed text-[#35170f] dark:text-white/80">{log.message}</td>
                    <td className="p-4 font-mono text-[10px] text-zinc-500 dark:text-white/40">{log.ipAddress || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="border-t border-[#e8dfc8]/80 dark:border-[#2a211a] p-4 bg-[#fbfaf8] dark:bg-[#1c1510] flex items-center justify-between text-xs font-cinzel text-[#8b8178] dark:text-white/60">
            <p className="font-bold uppercase tracking-wider">
              Showing <span className="text-[#35170f] dark:text-[#DB9E30]">{logs.length}</span> logs out of <span className="text-[#35170f] dark:text-[#DB9E30]">{totalLogs}</span> total
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1.5 border border-[#e8dfc8] dark:border-[#2a211a] bg-white dark:bg-[#17110d] text-[#35170f] dark:text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-[#2a211a] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="font-bold uppercase tracking-wider">
                Page <span className="text-[#35170f] dark:text-[#DB9E30]">{page}</span> of <span className="text-[#35170f] dark:text-[#DB9E30]">{totalPages}</span>
              </p>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 border border-[#e8dfc8] dark:border-[#2a211a] bg-white dark:bg-[#17110d] text-[#35170f] dark:text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-[#2a211a] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm bg-white dark:bg-[#17110d] shadow-sm">
          <p className="text-[#8b8178] dark:text-white/50 text-xs font-medium">No activity logs recorded matching criteria.</p>
        </div>
      )}
    </div>
  )
}
