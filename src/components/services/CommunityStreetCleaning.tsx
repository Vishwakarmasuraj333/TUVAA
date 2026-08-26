'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function CommunityStreetCleaning() {
  return (
    <section className="relative w-full h-[380px] sm:h-[450px] lg:h-[520px] flex items-center justify-center text-center overflow-hidden select-none bg-zinc-950">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/community-street-cleaning.jpg"
          alt="Community Street Cleaning Derby Road"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Clean dark overlay for legibility */}
        <div className="absolute inset-0 bg-[#0d0905]/55 z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-[780px] mx-auto px-6 flex flex-col items-center justify-center text-white space-y-4">
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
          <p className="text-xs sm:text-sm lg:text-base text-white/95 leading-relaxed font-roboto tracking-wide drop-shadow-sm max-w-2xl mx-auto">
            On the 7th of December, 2017, volunteers from the community set out to clean Derby road. supported by Believer's Loveworld Church Southampton
          </p>
        </motion.div>
      </div>
    </section>
  )
}
