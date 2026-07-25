'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DBGalleryItem } from '@/lib/gallery'

interface VideoModalProps {
  item: DBGalleryItem | null
  onClose: () => void
}

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1`
  }
  return null
}

export default function VideoModal({ item, onClose }: VideoModalProps) {
  const isOpen = item !== null

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const embedUrl = item?.videoUrl ? getYoutubeEmbedUrl(item.videoUrl) : null

  return (
    <AnimatePresence>
      {isOpen && item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer"
          />

          {/* Video Modal Container */}
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
                {item.category || 'General'} • {item.title}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-gold-400 hover:text-gold-500 transition-colors duration-200 cursor-pointer"
                aria-label="Close Player"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Video Player Canvas */}
            <div className="relative w-full aspect-video bg-[#000] flex items-center justify-center rounded overflow-hidden border border-gold-500/20 shadow-2xl">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={item.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : item.videoUrl ? (
                <video
                  src={item.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fail-safe if video path fails to load
                    const target = e.target as HTMLVideoElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      // Check if already created message element to avoid duplicating
                      if (parent.querySelector('.err-msg')) return
                      const msgDiv = document.createElement('div')
                      msgDiv.className =
                        'err-msg w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-zinc-950 font-cinzel space-y-4'
                      msgDiv.innerHTML = `
                        <div class="text-gold-500 font-bold uppercase tracking-widest text-lg">Video Coming Soon</div>
                        <div class="text-xs text-white/50">Resource path "${item.videoUrl}" could not be loaded.</div>
                      `
                      parent.appendChild(msgDiv)
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-black via-zinc-950 to-black font-cinzel space-y-4">
                  <div className="text-gold-500 font-bold uppercase tracking-widest text-lg">Video Coming Soon</div>
                  <div className="text-xs text-white/50">Playback is currently unavailable.</div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
