'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  title: string
  excerpt: string
  image: string
  slug: string
  index: number
}

export default function ProjectCard({
  title,
  excerpt,
  image,
  slug,
  index,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="group bg-white w-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.16)] transition-all duration-500 rounded-sm"
    >
      {/* Image with overlay */}
      <div className="relative w-full h-[230px] sm:h-[250px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Bottom gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Gold bottom accent on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DB9E30] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />
      </div>

      {/* Content */}
      <div className="px-6 sm:px-7 pt-6 pb-8 text-left flex flex-col">
        <h3 className="font-cinzel text-[18px] sm:text-[20px] font-bold text-[#35170f] uppercase leading-[1.3] mb-4 tracking-wide group-hover:text-[#DB9E30] transition-colors duration-300">
          {title}
        </h3>

        {/* Gold accent line */}
        <div className="w-12 h-[3px] bg-[#DB9E30] mb-5 group-hover:w-20 transition-all duration-500" />

        <p className="text-[#6b6560] text-[14px] sm:text-[15px] leading-[1.75] mb-7 line-clamp-3">
          {excerpt}
        </p>

        <Link
          href={`/${slug}`}
          className="btn-primary-hover inline-flex items-center gap-2 font-semibold text-[13px] sm:text-sm px-7 py-3 rounded-sm self-start uppercase tracking-wider"
        >
          Read More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  )
}
