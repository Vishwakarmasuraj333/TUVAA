'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isNavigationItemActive, navigationItems } from '@/data/navigation'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 }
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
}

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [isOpen])

  useEffect(() => {
    onClose()
    setOpenDropdown(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          id="mobile-navigation" 
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md xl:hidden" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onPointerDown={onClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ x: '100%', borderTopLeftRadius: '100px', borderBottomLeftRadius: '100px' }}
            animate={{ x: 0, borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
            exit={{ x: '100%', borderTopLeftRadius: '100px', borderBottomLeftRadius: '100px' }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
            onPointerDown={(event) => event.stopPropagation()}
            className="ml-auto flex h-full w-[min(90vw,400px)] flex-col overflow-y-auto bg-gradient-to-b from-[#0a0704] to-[#120d08] p-6 shadow-[-20px_0_50px_rgba(219,158,48,0.1)] border-l border-[#DB9E30]/20"
          >
            <div className="mb-8 flex items-center justify-between border-b border-[#DB9E30]/20 pb-5">
              <Link href="/" onClick={onClose} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/tuvaa-final-png.png" alt="TUVAA" width="80" height="62" className="h-auto w-16 drop-shadow-[0_0_8px_rgba(219,158,48,0.3)]" />
                <span className="font-cinzel text-[13px] font-bold uppercase tracking-[0.2em] text-[#DB9E30]">TUVAA</span>
              </Link>
              <button 
                type="button" 
                onClick={onClose} 
                className="rounded-full border border-[#DB9E30]/30 bg-[#DB9E30]/5 p-2.5 text-[#DB9E30] transition-transform hover:scale-110 hover:bg-[#DB9E30]/20 active:scale-95" 
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <motion.nav 
              aria-label="Mobile navigation" 
              className="flex-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {navigationItems.map((item) => {
                const expanded = openDropdown === item.name
                const active = isNavigationItemActive(pathname, item)
                return (
                  <motion.div key={item.name} variants={itemVariants} className="border-b border-white/5 py-3">
                    <div className="flex items-center justify-between">
                      <Link 
                        href={item.href || item.dropdown?.[0]?.href || '/'} 
                        onClick={onClose} 
                        className={cn('flex-1 py-2 font-cinzel text-base tracking-wider transition-colors', active ? 'font-bold text-[#DB9E30]' : 'text-white/80 hover:text-white')}
                      >
                        {item.name}
                      </Link>
                      {item.dropdown && (
                        <button 
                          type="button" 
                          onClick={() => setOpenDropdown(expanded ? null : item.name)} 
                          className="p-2 text-[#DB9E30]/70 hover:text-[#DB9E30] transition-colors" 
                          aria-label={`Toggle ${item.name} submenu`} 
                          aria-expanded={expanded}
                        >
                          <ChevronDown className={cn('h-5 w-5 transition-transform duration-300', expanded && 'rotate-180')} />
                        </button>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {item.dropdown && expanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mb-2 mt-2 ml-4 flex flex-col gap-1 border-l-2 border-[#DB9E30]/30 pl-4 py-2">
                            {item.dropdown.map((sub) => (
                              <Link 
                                key={sub.href} 
                                href={sub.href} 
                                onClick={onClose} 
                                className={cn('block py-2.5 text-[13px] tracking-wide transition-colors', pathname === sub.href ? 'font-bold text-[#DB9E30]' : 'text-white/60 hover:text-[#DB9E30]')} 
                                aria-current={pathname === sub.href ? 'page' : undefined}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.nav>
            
            <motion.div variants={itemVariants} initial="hidden" animate="visible" exit="exit" className="pt-8">
              <Link 
                href="/donate" 
                onClick={onClose} 
                className="w-full flex items-center justify-center bg-gradient-to-r from-[#DB9E30] to-[#b37a1e] hover:from-[#e9ab2d] hover:to-[#c9881d] text-black font-cinzel font-bold text-sm uppercase tracking-[0.2em] py-4 rounded-sm shadow-[0_5px_20px_rgba(219,158,48,0.25)] transition-all active:scale-[0.98]"
              >
                Support Us Now
              </Link>
            </motion.div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
