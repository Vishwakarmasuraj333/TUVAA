'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { DBGalleryItem } from '@/lib/gallery'
import GalleryImageCard from './GalleryImageCard'
import GalleryVideoCard from './GalleryVideoCard'

interface GalleryGridProps {
  items: DBGalleryItem[]
  activeTab: 'all' | 'image' | 'video' | null
  onImageClick: (index: number) => void
  onVideoClick: (item: DBGalleryItem) => void
}

export default function GalleryGrid({
  items,
  activeTab,
  onImageClick,
  onVideoClick,
}: GalleryGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  if (activeTab === null) {
    return (
      <div className="text-center py-20 text-[#666] font-cinzel text-sm sm:text-base tracking-wider select-none">
        Please select a category above to view the gallery.
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-[#666] font-cinzel text-sm sm:text-base tracking-wider select-none">
        No gallery items found.
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1180px] mx-auto px-6 py-16"
      >
      {items.map((item, index) => (
        <div key={item.id}>
          {item.type === 'image' ? (
            <GalleryImageCard item={item} onClick={() => onImageClick(index)} />
          ) : (
            <GalleryVideoCard item={item} onClick={() => onVideoClick(item)} />
          )}
        </div>
      ))}
      </motion.div>
    </AnimatePresence>
  )
}
