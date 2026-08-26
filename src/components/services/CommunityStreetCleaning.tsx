'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function CommunityStreetCleaning() {
  return (
    <section className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] flex items-center justify-center text-center overflow-hidden select-none bg-zinc-950">
      {/* Background Image Layer with crystal clear resolution */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/community-street-cleaning.jpg"
          alt="Community Street Cleaning Derby Road"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Soft, clean dark overlay allowing photo details to shine */}
        <div className="absolute inset-0 bg-[#0d0905]/45 z-10" />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(13,9,5,0.40) 0%, rgba(13,9,5,0.20) 50%, rgba(13,9,5,0.60) 100%)',
          }}
        />
      </div>

      {/* Content Container with elegant frosted contrast */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-6 flex flex-col items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-black/35 backdrop-blur-[2px] p-6 sm:p-10 rounded-lg border border-white/15 shadow-2xl space-y-4 max-w-2xl"
        >
          {/* Heading */}
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wider leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            COMMMUNITY STREET CLEANING
          </h2>

          {/* Paragraph */}
          <p className="text-sm sm:text-base lg:text-lg text-white font-medium leading-relaxed font-roboto tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            On the 7th of December, 2017, volunteers from the community set out to clean Derby road. supported by Believer's Loveworld Church Southampton
          </p>
        </motion.div>
      </div>
    </section>
  )
}
