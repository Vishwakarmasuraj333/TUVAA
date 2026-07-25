'use client'

import { useState, useEffect, useRef } from 'react'
import { ShieldCheck, ShieldAlert, User, Search, Globe, Loader2, ArrowRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AdminUser } from '@/app/admin/layout'
import ThemeToggle from '@/components/admin/ThemeToggle'

interface AdminHeaderProps {
  activeUser: AdminUser | null
  onMenuClick?: () => void
}

interface SearchResult {
  id: string
  type: string
  title: string
  link: string
}

export default function AdminHeader({ activeUser, onMenuClick }: AdminHeaderProps) {
  const isTester = activeUser?.role === 'tester'
  const router = useRouter()

  // Search State
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Click outside listener for search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounce API call
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
          setShowResults(true)
        }
      } catch (error) {
        console.error('Search query error:', error)
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleResultClick = (link: string) => {
    setQuery('')
    setShowResults(false)
    router.push(link)
  }

  return (
    <header className="h-16 bg-white/90 dark:bg-[#120c08]/90 backdrop-blur-md border-b border-[#eadfcf] dark:border-[#2a211a] px-4 sm:px-8 flex items-center justify-between sticky top-0 right-0 z-20 shadow-sm transition-colors duration-300">
      
      {/* Left Area: Hamburger, Role Badge & Search */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-xl">
        {/* Hamburger Menu (Mobile Only) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-sm text-[#120c08] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block shrink-0">
          {isTester ? (
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 font-cinzel uppercase tracking-widest px-3 py-1.5 rounded-sm flex items-center gap-1.5 font-bold animate-pulse">
              <ShieldAlert className="h-3.5 w-3.5" />
              READ ONLY MODE
            </span>
          ) : (
            <span className="text-[10px] bg-[#57a68f]/10 border border-[#57a68f]/30 text-[#42816f] dark:text-[#57a68f] font-cinzel uppercase tracking-widest px-3 py-1.5 rounded-sm flex items-center gap-1.5 font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Control
            </span>
          )}
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full max-w-sm">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              placeholder="Search dashboard..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#f8f6f2] dark:bg-[#17110d] border border-[#eadfcf] dark:border-[#2a211a] rounded text-[#120c08] dark:text-white placeholder:text-[#8b8178] dark:placeholder:text-white/45 focus:outline-none focus:border-[#DB9E30] transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8b8178]" />
            {searching && (
              <Loader2 className="absolute right-3 top-2.5 h-3.5 w-3.5 animate-spin text-[#DB9E30]" />
            )}
          </div>

          {/* Search Dropdown suggestions */}
          {showResults && query.trim().length >= 2 && (
            <div className="absolute top-11 left-0 right-0 max-h-80 overflow-y-auto bg-white dark:bg-[#17110d] border border-[#eadfcf] dark:border-[#2a211a] rounded shadow-xl z-50 text-left divide-y divide-gray-100 dark:divide-[#2a211a]">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result.link)}
                    className="w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between text-xs cursor-pointer text-left"
                  >
                    <div>
                      <span className="inline-block px-1.5 py-0.5 bg-[#DB9E30]/10 text-[#DB9E30] dark:text-[#DB9E30] font-cinzel rounded-sm text-[9px] uppercase tracking-wide mr-2">
                        {result.type}
                      </span>
                      <span className="font-semibold text-[#120c08] dark:text-white">{result.title}</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-gray-400 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-xs text-[#8b8178] dark:text-white/65 text-center">
                  No matching records found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Buttons, Theme, User Dropdown */}
      <div className="flex items-center gap-4">
        {/* View Public Site */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 text-[10px] font-cinzel tracking-widest text-[#DB9E30] hover:text-[#57a68f] uppercase font-bold border border-[#DB9E30]/20 hover:border-[#57a68f]/20 px-3 py-1.5 rounded transition-all"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Public Site</span>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User profile */}
        {activeUser && (
          <div className="flex items-center gap-3 pl-2 border-l border-[#eadfcf] dark:border-[#2a211a]">
            <Link href="/admin/settings" className="hidden sm:block text-right hover:opacity-80 transition-opacity">
              <p className="text-xs font-bold text-[#120c08] dark:text-white uppercase tracking-wider font-cinzel leading-tight">
                {activeUser.name}
              </p>
              <p className="text-[10px] text-[#8b8178] dark:text-white/50 font-medium leading-none mt-0.5">{activeUser.email}</p>
            </Link>
            <Link
              href="/admin/settings"
              className="w-10 h-10 rounded-full border border-[#DB9E30]/50 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_15px_rgba(219,158,48,0.2)] relative overflow-hidden bg-[#1c1510]"
            >
              <img 
                src={activeUser.dpUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

