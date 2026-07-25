'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { DBGalleryItem } from '@/lib/gallery'

interface GalleryImageCardProps {
  item: DBGalleryItem
  onClick: () => void
}

export default function GalleryImageCard({ item, onClick }: GalleryImageCardProps) {
  const [src, setSrc] = useState(item.imageUrl || '/images/gallery-placeholder.jpg')

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
  }

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      className="relative aspect-[4/3] rounded-md overflow-hidden shadow border border-zinc-200 cursor-pointer group bg-zinc-100"
    >
      {/* Zoom scale transition */}
      <motion.div
        className="relative w-full h-full"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <Image
          src={src}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center"
          onError={() => setSrc('/images/gallery-placeholder.jpg')}
        />
      </motion.div>

      {/* Hover dark overlay */}
      <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 z-10 text-left select-none">
        {/* Category tag */}
        <span className="text-[10px] bg-[#DB9E30]/15 border border-[#DB9E30]/30 text-[#DB9E30] font-cinzel font-bold uppercase tracking-wider px-2.5 py-1 rounded self-start">
          {item.category || 'General'}
        </span>

        {/* Title & Zoom Indicator */}
        <div className="space-y-2">
          <h4 className="font-cinzel text-sm sm:text-base font-bold text-white uppercase tracking-wider line-clamp-2">
            {item.title}
          </h4>
          <p className="text-xs text-gold-400 flex items-center gap-1.5 font-cinzel uppercase font-bold tracking-widest">
            <Eye className="h-4 w-4" /> Expand Photo
          </p>
        </div>
      </div>
    </motion.div>
  )
}
