'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EventData } from '@/lib/events'

interface EventMediaGalleryProps {
  event: EventData
}

export default function EventMediaGallery({ event }: EventMediaGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)

  const videoUrl = event.videoUrl || ''
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
  const thumbnail = event.posterImage || event.image || '/images/bbam-video-thumb.jpg'

  // Helper to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
      const match = url.match(regExp)
      return match && match[2].length === 11 ? match[2] : null
    } catch {
      return null
    }
  }

  const embedUrl = isYouTube && getYouTubeId(videoUrl)
    ? `https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=1`
    : null

  return (
    <div className="relative w-full mb-10 select-none">
      {/* Media Card Preview */}
      <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden shadow-md border border-zinc-200 group">
        <Image
          src={thumbnail}
          alt={event.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover object-center bg-zinc-100 transition-transform duration-500 group-hover:scale-102"
        />

        {/* Video Overlay and Play Button */}
        {videoUrl && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#DB9E30] hover:bg-[#57a68f] text-white flex items-center justify-center shadow-lg transition-colors duration-300 cursor-pointer"
              aria-label="Play video"
            >
              <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-current ml-1" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Lightbox Video Modal */}
      <AnimatePresence>
        {isOpen && videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors border border-white/20 hover:bg-white/10 rounded-full z-50 cursor-pointer"
              aria-label="Close video player"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl aspect-[16/9] relative overflow-hidden bg-black shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {isYouTube && embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${event.title} Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
