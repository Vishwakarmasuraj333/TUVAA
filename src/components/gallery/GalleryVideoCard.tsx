'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { DBGalleryItem } from '@/lib/gallery'

interface GalleryVideoCardProps {
  item: DBGalleryItem
  onClick: () => void
}

export default function GalleryVideoCard({ item, onClick }: GalleryVideoCardProps) {
  const [src, setSrc] = useState(item.thumbnailUrl || item.imageUrl || '/images/gallery-placeholder.jpg')

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
  }

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      className="relative aspect-[4/3] rounded-md overflow-hidden shadow border border-zinc-200 cursor-pointer group bg-zinc-900"
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
          className="object-cover object-center opacity-85 group-hover:opacity-60 transition-opacity duration-300"
          onError={() => setSrc('/images/gallery-placeholder.jpg')}
        />
      </motion.div>

      {/* Large centered play button overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none">
        <div
          className="w-14 h-14 rounded-full bg-[#57a68f]/90 group-hover:bg-[#DB9E30] border border-white/20 flex items-center justify-center text-white transition-colors duration-300 shadow-lg"
        >
          <Play className="h-6 w-6 fill-white ml-0.5" />
        </div>
        <span className="text-[10px] text-white group-hover:text-gold-400 font-cinzel font-bold uppercase tracking-widest mt-3 transition-colors duration-300">
          Play Video
        </span>
      </div>

      {/* Hover dark overlay details */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 z-10 text-left select-none pointer-events-none">
        {/* Category tag */}
        <span className="text-[10px] bg-[#DB9E30]/15 border border-[#DB9E30]/30 text-[#DB9E30] font-cinzel font-bold uppercase tracking-wider px-2.5 py-1 rounded self-start">
          {item.category || 'General'}
        </span>

        {/* Title */}
        <div>
          <h4 className="font-cinzel text-sm sm:text-base font-bold text-white uppercase tracking-wider line-clamp-2">
            {item.title}
          </h4>
        </div>
      </div>
    </motion.div>
  )
}
