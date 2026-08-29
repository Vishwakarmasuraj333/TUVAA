'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DBGalleryItem } from '@/lib/gallery'

interface GalleryLightboxProps {
  items: DBGalleryItem[]
  activeIndex: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const isOpen = activeIndex !== null
  const selectedItem = activeIndex !== null ? items[activeIndex] : null

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      {isOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer"
          />

          {/* Lightbox Modal Wrapper */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col justify-center items-center z-10"
          >
            {/* Header Control Bar */}
            <div className="w-full flex items-center justify-between text-white border-b border-white/10 pb-2.5 mb-4 px-2">
              <span className="font-cinzel text-xs font-bold tracking-widest uppercase text-gold-400">
                {selectedItem.category || 'General'} • {selectedItem.title}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-gold-400 hover:text-gold-500 transition-colors duration-200 cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Media Canvas Block */}
            <div className="relative w-full aspect-video bg-[#000] flex items-center justify-center rounded overflow-hidden border border-gold-500/20 shadow-2xl">
              <Image
                src={selectedItem.imageUrl || '/images/gallery-placeholder.jpg'}
                alt={selectedItem.title}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />

              {/* Prev Navigation Button */}
              {items.length > 1 && (
                <button
                  onClick={onPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:text-gold-500 hover:border-gold-500 transition-all duration-200 cursor-pointer z-20"
                  aria-label="Previous item"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              {/* Next Navigation Button */}
              {items.length > 1 && (
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:text-gold-500 hover:border-gold-500 transition-all duration-200 cursor-pointer z-20"
                  aria-label="Next item"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
