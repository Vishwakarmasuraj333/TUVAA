'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { ServiceViewModel } from '@/types/service'

interface ServiceCardProps {
  service: ServiceViewModel
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const initialImg = service.image === '/images/street-cleaning.jpg' ? '/images/community-street-cleaning.jpg' : (service.image || '/images/event-placeholder.jpg')
  const [imageSrc, setImageSrc] = useState(initialImg)

  const formattedDate = service.date

  // Framer Motion card container variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col h-full bg-white text-left group"
    >
      {/* Dynamic Image Wrapper with Aspect Ratio 16/9 */}
      <Link href={`/services/${service.slug}`} className="relative block aspect-[16/9] w-full overflow-hidden rounded-[4px] shadow-sm select-none">
        <motion.div
          className="relative w-full h-full"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <Image
            src={imageSrc}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center bg-zinc-50"
            onError={() => setImageSrc('/images/event-placeholder.jpg')}
          />
        </motion.div>

        {/* Hover Dark Overlay (0 to 0.40) & 3 Animated Dots */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none flex items-center justify-center z-10">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-white rounded-full"
              />
            ))}
          </div>
        </div>
      </Link>

      {/* Card Content block */}
      <div className="flex flex-col flex-grow pt-5 pb-2">
        
        {/* Date & Comments Row */}
        <div className="flex items-center gap-x-4 text-xs text-[#9a8f86] font-medium tracking-wide uppercase">
          <span>{formattedDate}</span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {service.comments === 1 ? '1 Comment' : `${service.comments} Comments`}
          </span>
        </div>

        {/* Dynamic Editorial Title */}
        <h3 className="font-cinzel text-lg sm:text-xl text-[#31170d] font-bold uppercase tracking-wider leading-snug mt-[13px] hover:text-[#DB9E30] transition-colors duration-200">
          <Link href={`/services/${service.slug}`}>{service.title}</Link>
        </h3>

        {/* Excerpt Summary */}
        <p className="text-[#666] text-sm leading-7 mt-[14px] flex-grow text-justify font-roboto">
          {service.excerpt}
        </p>

        {/* Read More button */}
        <div className="mt-[18px]">
          <Link href={`/services/${service.slug}`} className="inline-block">
            <button
              className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm shadow hover:shadow-md cursor-pointer"
            >
              Read more
            </button>
          </Link>
        </div>

      </div>
    </motion.div>
  )
}
