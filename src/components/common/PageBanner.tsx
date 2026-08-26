'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface PageBannerProps {
  title: string
  breadcrumb: React.ReactNode
  backgroundImage?: string
}

export default function PageBanner({
  title,
  breadcrumb,
  backgroundImage = '/images/inner-page-bg.png',
}: PageBannerProps) {
  // Format title into 2 lines if it contains (BBAM) or long festival title
  const renderFormattedTitle = () => {
    if (typeof title === 'string' && title.toUpperCase().includes('(BBAM)')) {
      const mainText = title.replace(/\s*\(BBAM\)/i, '').trim()
      return (
        <span className="flex flex-col items-center gap-1.5 sm:gap-3">
          <span>{mainText}</span>
          <span className="block text-[#DB9E30] text-[28px] sm:text-[38px] lg:text-[50px] font-extrabold tracking-widest">(BBAM)</span>
        </span>
      )
    }
    return title
  }

  return (
    <div className="relative w-full min-h-[520px] sm:min-h-[600px] xl:min-h-[680px] flex flex-col overflow-hidden select-none bg-[#0d0905]">
      {/* Background Image Layer with controlled opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-300"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />

      {/* Dark Base Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Multi-stop Contrast Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(13,9,5,0.65) 0%, rgba(13,9,5,0.45) 40%, rgba(13,9,5,0.85) 100%)',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start text-center px-4 pt-[280px] sm:pt-[315px] xl:pt-[350px] pb-14 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center max-w-5xl mx-auto"
        >
          {/* Page Title with Enhanced Text Shadow */}
          <h1 className="font-cinzel text-[26px] sm:text-[38px] lg:text-[52px] font-bold text-white uppercase tracking-wider leading-tight mb-5 select-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {renderFormattedTitle()}
          </h1>

          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center flex-wrap justify-center font-cinzel text-xs sm:text-sm lg:text-base text-white/90 tracking-widest select-text">
            <Link
              href="/"
              className="text-white hover:text-[#DB9E30] transition-colors duration-250 font-medium"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90 font-medium flex items-center">{breadcrumb}</span>
          </nav>
        </motion.div>
      </div>

      {/* Premium bottom gold line border matching TUVAA theme */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#DB9E30]/40 to-transparent z-10" />
    </div>
  )
}
