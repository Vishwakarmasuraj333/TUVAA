'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Play, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { fallbackGalleryItems, GalleryItem } from '@/data/gallery'

export default function HomeGallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeVideo, setActiveVideo] = useState<GalleryItem | null>(null)

  const categories = ['ALL', 'BBAM FESTIVAL', 'MILITARY PARADE', 'CULTURE', 'COMMUNITY']

  const filteredItems = activeCategory === 'ALL'
    ? fallbackGalleryItems
    : fallbackGalleryItems.filter((i) => {
        const cat = (i.category || '').toUpperCase()
        if (activeCategory === 'BBAM FESTIVAL') return cat.includes('FESTIVAL') || cat.includes('BBAM')
        if (activeCategory === 'MILITARY PARADE') return cat.includes('MILITARY') || cat.includes('PARADE')
        if (activeCategory === 'CULTURE') return cat.includes('CULTURE') || cat.includes('HERITAGE')
        if (activeCategory === 'COMMUNITY') return cat.includes('COMMUNITY') || cat.includes('VOLUNTEER')
        return cat.includes(activeCategory)
      })

  const galleryImages = filteredItems.filter((i) => i.type === 'image')

  const handleCardClick = (item: GalleryItem, index: number) => {
    if (item.type === 'video') {
      setActiveVideo(item)
    } else {
      const imgIdx = galleryImages.findIndex((g) => g.id === item.id)
      setLightboxIndex(imgIdx >= 0 ? imgIdx : 0)
    }
  }

  return (
    <section className="bg-[#faf8ef] py-16 md:py-24 relative overflow-hidden font-sans border-t border-[#eee7dc]">
      <div className="container max-w-[1200px] mx-auto px-5 md:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="font-cinzel text-3xl md:text-5xl text-[#35170f] font-extrabold tracking-[0.08em] uppercase mb-3">
            BBAM 2025 GALLERY
          </h2>
          <p className="text-[#DB9E30] font-cinzel text-sm md:text-base tracking-[0.15em] font-semibold uppercase">
            Capturing Moments of Culture, Community, Military Parade & Celebration
          </p>
          <div className="w-24 h-1 bg-[#DB9E30] rounded-full mt-4" />
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => {
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-cinzel text-xs font-bold tracking-wider uppercase px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  active
                    ? 'bg-[#DB9E30] text-white shadow-md scale-105'
                    : 'bg-white text-[#35170f] hover:bg-[#57a68f] hover:text-white border border-[#eee7dc]'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.slice(0, 9).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => handleCardClick(item, idx)}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer border border-[#eee7dc]"
            >
              {/* Image */}
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Badge & Video Icon */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="bg-[#DB9E30] text-white font-cinzel text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
                  {item.category || 'TUVAA'}
                </span>
              </div>

              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-14 h-14 rounded-full bg-[#57a68f]/90 group-hover:bg-[#DB9E30] border-2 border-white/40 flex items-center justify-center text-white transition-all duration-300 shadow-xl group-hover:scale-110">
                    <Play className="h-6 w-6 fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Bottom Caption Info */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-10 text-left">
                <h3 className="font-cinzel text-base font-bold text-white uppercase tracking-wide leading-snug drop-shadow-sm group-hover:text-[#DB9E30] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 font-cinzel tracking-wider mt-1.5 flex items-center gap-1.5">
                  {item.type === 'video' ? (
                    <>
                      <Play className="h-3.5 w-3.5 fill-[#DB9E30] text-[#DB9E30]" /> Play Video
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 text-[#DB9E30]" /> View Full Image
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="btn-primary-hover inline-flex items-center justify-center gap-2 bg-[#DB9E30] hover:bg-[#57a68f] text-white font-cinzel font-bold text-sm tracking-[0.15em] uppercase px-8 py-4 rounded shadow-lg transition-all duration-300"
          >
            <span>VIEW FULL GALLERY</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryImages[lightboxIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col justify-center items-center z-10"
            >
              <div className="w-full flex items-center justify-between text-white border-b border-white/10 pb-3 mb-4 px-2">
                <span className="font-cinzel text-xs sm:text-sm font-bold tracking-widest uppercase text-[#DB9E30]">
                  {galleryImages[lightboxIndex].category} • {galleryImages[lightboxIndex].title}
                </span>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-1.5 text-[#DB9E30] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="relative w-full aspect-[16/10] bg-black flex items-center justify-center rounded overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src={galleryImages[lightboxIndex].imageUrl}
                  alt={galleryImages[lightboxIndex].title}
                  fill
                  priority
                  className="object-contain"
                  sizes="100vw"
                />

                {galleryImages.length > 1 && (
                  <button
                    onClick={() => setLightboxIndex((prev) => (prev! - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#DB9E30] hover:border-[#DB9E30] transition-all cursor-pointer z-20"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {galleryImages.length > 1 && (
                  <button
                    onClick={() => setLightboxIndex((prev) => (prev! + 1) % galleryImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#DB9E30] hover:border-[#DB9E30] transition-all cursor-pointer z-20"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
              </div>

              <div className="mt-3 text-center text-white/80 font-cinzel text-xs tracking-wider">
                Photo {lightboxIndex + 1} of {galleryImages.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[85vh] flex flex-col justify-center items-center z-10"
            >
              <div className="w-full flex items-center justify-between text-white border-b border-white/10 pb-3 mb-4 px-2">
                <span className="font-cinzel text-xs sm:text-sm font-bold tracking-widest uppercase text-[#DB9E30]">
                  {activeVideo.category || 'Video'} • {activeVideo.title}
                </span>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 text-[#DB9E30] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="relative w-full aspect-video bg-black flex items-center justify-center rounded overflow-hidden shadow-2xl border border-white/10">
                <video
                  src={activeVideo.videoUrl || '/images/v.mp4'}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
