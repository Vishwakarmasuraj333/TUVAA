'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DBGalleryItem } from '@/lib/gallery'
import GalleryGrid from './GalleryGrid'
import GalleryLightbox from './GalleryLightbox'
import VideoModal from './VideoModal'

interface GalleryTabsProps {
  initialItems: DBGalleryItem[]
}

const ITEMS_PER_PAGE = 9

export default function GalleryTabs({ initialItems }: GalleryTabsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video'>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeVideo, setActiveVideo] = useState<DBGalleryItem | null>(null)

  const galleryRef = useRef<HTMLDivElement>(null)

  // Filter items based on active tab selection
  const tabItems = activeTab === 'all' ? initialItems : initialItems.filter((item) => item.type === activeTab)

  // Paginated items calculation
  const totalPages = Math.max(1, Math.ceil(tabItems.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentPaginatedItems = tabItems.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleTabChange = (tab: 'all' | 'image' | 'video') => {
    setActiveTab(tab)
    setCurrentPage(1)
    handleLightboxClose()
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    handleLightboxClose()
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleImageClick = (index: number) => {
    setLightboxIndex(startIndex + index)
  }

  const handleVideoClick = (item: DBGalleryItem) => {
    setActiveVideo(item)
  }

  const handleLightboxClose = () => {
    setLightboxIndex(null)
  }

  const handleLightboxPrev = () => {
    if (lightboxIndex !== null && tabItems.length > 0) {
      setLightboxIndex((prev) => (prev! - 1 + tabItems.length) % tabItems.length)
    }
  }

  const handleLightboxNext = () => {
    if (lightboxIndex !== null && tabItems.length > 0) {
      setLightboxIndex((prev) => (prev! + 1) % tabItems.length)
    }
  }

  const pageNumbers: number[] = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="w-full" ref={galleryRef}>
      {/* Centered Tab Selectors */}
      <div className="mt-[60px] sm:mt-[90px] flex flex-col items-center select-none px-4">
        <div className="flex flex-wrap gap-3 sm:gap-6 justify-center z-10">
          {/* All Tab Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange('all')}
            className={`font-cinzel font-bold text-xs sm:text-base uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 rounded-t-md cursor-pointer transition-colors duration-300 ${
              activeTab === 'all'
                ? 'bg-[#DB9E30] text-white shadow-md'
                : 'bg-[#57a68f] hover:bg-[#57a68f]/90 text-white'
            }`}
          >
            All Items
          </motion.button>

          {/* Images Tab Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange('image')}
            className={`font-cinzel font-bold text-xs sm:text-base uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 rounded-t-md cursor-pointer transition-colors duration-300 ${
              activeTab === 'image'
                ? 'bg-[#DB9E30] text-white shadow-md'
                : 'bg-[#57a68f] hover:bg-[#57a68f]/90 text-white'
            }`}
          >
            Images
          </motion.button>

          {/* Videos Tab Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange('video')}
            className={`font-cinzel font-bold text-xs sm:text-base uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 rounded-t-md cursor-pointer transition-colors duration-300 ${
              activeTab === 'video'
                ? 'bg-[#DB9E30] text-white shadow-md'
                : 'bg-[#57a68f] hover:bg-[#57a68f]/90 text-white'
            }`}
          >
            Videos
          </motion.button>
        </div>

        {/* Gold divider line full width */}
        <div className="w-full h-[2px] bg-[#DB9E30] -mt-[2px]" />
      </div>

      {/* Grid Content block */}
      <GalleryGrid
        items={currentPaginatedItems}
        activeTab={activeTab}
        onImageClick={handleImageClick}
        onVideoClick={handleVideoClick}
      />

      {/* High-Contrast Professional Pagination Bar */}
      {tabItems.length > 0 && totalPages > 1 && (
        <div className="mt-8 mb-16 flex flex-col items-center justify-center space-y-4 select-none">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Previous Page Button */}
            <motion.button
              whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
              whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`flex items-center gap-1.5 font-cinzel font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-md border transition-all duration-300 ${
                currentPage === 1
                  ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'border-[#DB9E30] bg-[#35170f] text-white hover:bg-[#DB9E30] shadow-md cursor-pointer'
              }`}
            >
              <ChevronLeft className="h-4 w-4 text-[#DB9E30]" />
              <span className="hidden sm:inline">Previous</span>
            </motion.button>

            {/* Numeric Page Buttons */}
            {pageNumbers.map((pageNum) => {
              const isActive = currentPage === pageNum
              return (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-md font-cinzel font-extrabold text-sm flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-[#DB9E30] text-white shadow-lg shadow-[#DB9E30]/40 scale-105 border-2 border-[#DB9E30]'
                      : 'bg-[#35170f] text-white hover:bg-[#57a68f] border border-[#DB9E30]/40 cursor-pointer shadow-sm'
                  }`}
                >
                  {pageNum}
                </motion.button>
              )
            })}

            {/* Next Page Button */}
            <motion.button
              whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
              whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`flex items-center gap-1.5 font-cinzel font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-md border transition-all duration-300 ${
                currentPage >= totalPages
                  ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'border-[#DB9E30] bg-[#35170f] text-white hover:bg-[#DB9E30] shadow-md cursor-pointer'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 text-[#DB9E30]" />
            </motion.button>
          </div>

          {/* Current Page Summary indicator */}
          <div className="text-xs sm:text-sm font-cinzel font-semibold tracking-wider text-[#35170f]">
            Page <span className="font-extrabold text-[#DB9E30]">{currentPage}</span> of{' '}
            <span className="font-extrabold text-[#DB9E30]">{totalPages}</span> ({tabItems.length} items total)
          </div>
        </div>
      )}

      {/* Lightbox component */}
      <GalleryLightbox
        items={tabItems}
        activeIndex={lightboxIndex}
        onClose={handleLightboxClose}
        onPrev={handleLightboxPrev}
        onNext={handleLightboxNext}
      />

      {/* Video Modal component */}
      <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  )
}
