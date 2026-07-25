'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isNavigationItemActive, navigationItems } from '@/data/navigation'
import MobileMenu from './MobileMenu'
import { motion } from 'framer-motion'

export default function Header() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setOpenDropdown(null)
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenDropdown(null)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  if (pathname.startsWith('/admin')) return null

  return (
    <header
      ref={headerRef}
      className={cn(
        'absolute left-0 top-0 z-50 w-full transition-colors duration-300',
        scrolled && 'bg-[#0d0905]/95 shadow-lg shadow-black/35 backdrop-blur-md'
      )}
    >
      <div className="container relative mx-auto flex items-center justify-between px-4 pt-[18px] xl:justify-center xl:pt-[28px]">
        <Link href="/" className="group mx-auto flex flex-col items-center gap-1 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.div
            animate={{ scale: [1, 1.03, 1], filter: ['drop-shadow(0px 0px 0px rgba(219,158,48,0))', 'drop-shadow(0px 0px 10px rgba(219,158,48,0.3))', 'drop-shadow(0px 0px 0px rgba(219,158,48,0))'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <img src="/images/tuvaa-final-png.png" alt="TUVAA" width="205" height="159" className="h-auto w-[135px] object-contain xl:w-[205px]" />
          </motion.div>
          <span className="mt-1.5 max-w-xs px-4 text-center font-cinzel text-[11px] font-bold uppercase tracking-[0.18em] text-[#DB9E30] xl:max-w-none xl:text-[14px] xl:tracking-[0.25em]">
            The United Voice of African Associations
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="absolute right-4 rounded-md border border-[#DB9E30]/30 p-2 text-[#DB9E30] xl:hidden"
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <nav aria-label="Main navigation" className="mt-[22px] hidden border-y border-white/10 bg-black/15 xl:block">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3 text-sm">
            {navigationItems.map((item) => {
              const active = isNavigationItemActive(pathname, item)
              const expanded = openDropdown === item.name
              return (
                <li
                  key={item.name}
                  className="group relative py-1"
                  onMouseEnter={() => item.dropdown && setOpenDropdown(item.name)}
                  onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
                >
                  <div className="flex items-center">
                    <Link
                      href={item.href || item.dropdown?.[0]?.href || '/'}
                      onClick={() => setOpenDropdown(null)}
                      className={cn('block py-1 font-cinzel font-medium tracking-wide transition-colors', active ? 'text-[#DB9E30]' : 'text-white/90 hover:text-[#DB9E30]')}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                    {item.dropdown && (
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(expanded ? null : item.name)}
                        className="ml-1 rounded p-1 text-[#DB9E30] focus-visible:outline-2 focus-visible:outline-[#DB9E30]"
                        aria-label={`Toggle ${item.name} submenu`}
                        aria-expanded={expanded}
                      >
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                  <span className={cn('absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-[#DB9E30] transition-transform group-hover:scale-x-100', active && 'scale-x-100')} />

                  {item.dropdown && (
                    <div className={cn('absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2 transition-all', expanded ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0')}>
                      <div className="rounded-md border border-[#DB9E30]/25 bg-[#120c08]/98 py-2 shadow-2xl backdrop-blur-xl">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setOpenDropdown(null)}
                            aria-current={pathname === sub.href ? 'page' : undefined}
                            className={cn('block border-l-2 border-transparent px-4 py-2.5 text-left font-cinzel text-xs tracking-wider text-white/85 transition-colors hover:border-[#DB9E30] hover:bg-[#DB9E30]/10 hover:text-[#DB9E30]', pathname === sub.href && 'border-[#DB9E30] bg-[#DB9E30]/10 font-bold text-[#DB9E30]')}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}
