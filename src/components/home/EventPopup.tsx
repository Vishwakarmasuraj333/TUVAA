'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EventPopup() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Removed sessionStorage check so the popup appears on every refresh as requested
    setIsOpen(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
  }

  // Prevent server-side rendering issues by returning null until mounted
  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Full Screen Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose}
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.78)', backdropFilter: 'blur(6px)' }}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-[90%] max-w-[760px]"
          >
            {/* Close Button: Gold Circular Button */}
            <motion.button
              onClick={handleClose}
              whileHover={{
                scale: 1.1,
                rotate: 90,
                backgroundColor: '#57a68f',
                boxShadow: '0 0 15px rgba(219, 158, 48, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-3.5 -right-3.5 md:-top-5 md:-right-5 z-20 w-[38px] h-[38px] md:w-[46px] md:h-[46px] rounded-full bg-[#DB9E30] text-white flex items-center justify-center font-bold shadow-xl cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 md:h-6 md:w-6 stroke-[2.5px]" />
            </motion.button>

            {/* Poster / Flyer image container */}
            <div className="relative w-full aspect-[1620/1146] max-h-[85vh] overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#120c08] border border-[#DB9E30]/20 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 rounded-full border-2 border-[#DB9E30] border-t-transparent animate-spin"></div>
              </div>
              <Image
                src="/images/Untitled-1620-x-1146-px.jpg"
                alt="TUVAA Event Poster"
                fill
                priority
                onLoad={() => setImageLoaded(true)}
                className={`object-cover relative z-10 transition-opacity duration-700 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 768px) 90vw, 760px"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

