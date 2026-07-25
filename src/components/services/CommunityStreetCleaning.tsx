'use client'

import { motion } from 'framer-motion'

export default function CommunityStreetCleaning() {
  return (
    <section className="relative w-full h-[350px] sm:h-[420px] lg:h-[500px] flex items-center justify-center text-center overflow-hidden select-none">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/community-street-cleaning.jpg')",
        }}
      />

      {/* Dark Overlay (rgba(0,0,0,0.35)) */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[780px] mx-auto px-6 flex flex-col items-center justify-center text-white space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-4"
        >
          {/* Heading */}
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-[34px] font-bold uppercase tracking-wider leading-tight drop-shadow-md">
            COMMMUNITY STREET CLEANING
          </h2>

          {/* Paragraph */}
          <p className="text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed font-roboto tracking-wide drop-shadow-sm max-w-2xl mx-auto">
            On the 7th of December, 2017, volunteers from the community set out to clean Derby Road, supported by Believer's Loveworld Church Southampton.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
