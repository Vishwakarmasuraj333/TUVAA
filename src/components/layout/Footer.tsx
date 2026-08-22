'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowUp, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'
import NewsletterForm from '../forms/NewsletterForm'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function Footer() {
  const pathname = usePathname()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [bgSrc, setBgSrc] = useState('/images/bg-footer.jpg')

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', checkScrollTop)
    return () => window.removeEventListener('scroll', checkScrollTop)
  }, [])

  if (pathname.startsWith('/admin')) {
    return null
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <footer className="relative w-full text-white overflow-hidden bg-[#0f0b08] z-10 pt-[85px] pb-0 font-sans">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none w-full h-full">
        <Image
          src={bgSrc}
          alt="Footer Background"
          fill
          sizes="100vw"
          className="object-cover object-center animate-fade-in"
          priority
          onError={() => setBgSrc('/images/banner-2-v2.webp')}
        />
        {/* Gradient overlays: top 0.32, middle 0.52, bottom 0.72 */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.52) 50%, rgba(0,0,0,0.72) 100%)"
          }}
        />
      </div>

      {/* Main Container wrapping all content */}
      <div className="container max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Newsletter Section */}
        <div className="max-w-[760px] mx-auto text-center mb-[65px] lg:mb-[95px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 
              className="font-cinzel text-[34px] lg:text-[48px] text-white font-bold tracking-wider uppercase mb-4 leading-none"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.65)" }}
            >
              NEWSLETTER
            </h2>
            <p className="text-base text-[#8f8b86] mb-[34px] font-medium font-roboto">
              Subscribe to our mailing list
            </p>
            <NewsletterForm />
          </motion.div>
        </div>

        {/* Links & Columns Section */}
        <div 
          className="pt-[70px] pb-[70px]"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16"
          >
            {/* Column 1: Contact */}
            <div className="space-y-5 text-left">
              <h3 
                className="font-cinzel text-[22px] lg:text-[26px] text-white font-bold uppercase mb-[22px] pb-[18px]"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                Contact
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-[14px]">
                  <Phone className="h-[18px] w-[18px] text-[#DB9E30] shrink-0 mt-1" />
                  <a href="tel:07385932327" className="text-[#9b9690] hover:text-[#DB9E30] transition-colors font-medium">
                    07385932327
                  </a>
                </li>
                <li className="flex items-start gap-[14px]">
                  <Mail className="h-[18px] w-[18px] text-[#DB9E30] shrink-0 mt-1" />
                  <a href="mailto:info@tuvaa.org.uk" className="text-[#9b9690] hover:text-[#DB9E30] transition-colors font-medium">
                    info@tuvaa.org.uk
                  </a>
                </li>
                <li className="flex items-start gap-[14px] leading-relaxed">
                  <MapPin className="h-[18px] w-[18px] text-[#DB9E30] shrink-0 mt-1" />
                  <span className="text-[#9b9690] font-medium">
                    From the 1st of September TUVAA will be operating from Newtown Youth Centre. Graham Rd. Southampton. SO14 0AW
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 2: Services */}
            <div className="space-y-5 text-left">
              <h3 
                className="font-cinzel text-[22px] lg:text-[26px] text-white font-bold uppercase mb-[22px] pb-[18px]"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                Services
              </h3>
              <ul className="space-y-3.5 text-[#9b9690] uppercase font-semibold">
                <li>
                  <Link href="/services/hidden-histories" className="hover:text-[#DB9E30] transition-colors">
                    Hidden Histories
                  </Link>
                </li>
                <li>
                  <Link href="/services/poverty-and-hunger" className="hover:text-[#DB9E30] transition-colors">
                    Poverty and Hunger
                  </Link>
                </li>
                <li>
                  <Link href="/services/youth-empowerment" className="hover:text-[#DB9E30] transition-colors">
                    Youth Empowerment
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="space-y-5 text-left">
              <h3 
                className="font-cinzel text-[22px] lg:text-[26px] text-white font-bold uppercase mb-[22px] pb-[18px]"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                Quick Links
              </h3>
              <ul className="space-y-3.5 text-[#9b9690] font-semibold font-roboto-slab">
                <li>
                  <Link href="/our-projects" className="hover:text-[#DB9E30] transition-colors">
                    Our Projects
                  </Link>
                </li>
                <li>
                  <Link href="/membership" className="hover:text-[#DB9E30] transition-colors">
                    Membership
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-[#DB9E30] transition-colors">
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Social */}
            <div className="space-y-5 text-left">
              <h3 
                className="font-cinzel text-[22px] lg:text-[26px] text-white font-bold uppercase mb-[22px] pb-[18px]"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                Social
              </h3>
              <div className="flex gap-4 items-center justify-start">
                <motion.a
                  whileHover={{ scale: 1.08, y: -4 }}
                  href="https://www.facebook.com/UnitedVoiceofA1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[52px] w-[52px] bg-[#DB9E30] hover:bg-[#57a68f] text-white rounded-md transition-colors duration-300 cursor-pointer flex items-center justify-center shadow-md"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6 text-white" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.08, y: -4 }}
                  href="https://www.instagram.com/bbamfestival"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-[52px] w-[52px] bg-[#DB9E30] hover:bg-[#57a68f] text-white rounded-md transition-colors duration-300 cursor-pointer flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6 text-white" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Copyright Bar wrapper */}
      <div 
        className="py-[22px] text-center text-sm text-[#8f8b86] bg-black/25 relative z-10"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div className="container max-w-[1280px] mx-auto px-6 lg:px-8">
          <p>
            © TUVAA @2023. All Rights Reserved. Website designed & developed by{' '}
            <a 
              href="https://www.visualytes.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8f8b86] hover:text-[#DB9E30] transition-colors underline"
            >
              Visualytes Limited
            </a>.
          </p>
        </div>
      </div>

      {/* Scroll-To-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 lg:right-[95px] z-50 h-[54px] w-[54px] bg-[#DB9E30] text-white rounded-md shadow-2xl hover:bg-[#57a68f] transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center border border-white/10"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  )
}
