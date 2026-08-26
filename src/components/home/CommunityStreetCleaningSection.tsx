'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function CommunityStreetCleaningSection() {
  return (
    <section className="relative w-full h-[500px] md:h-[620px] overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/community-street-cleaning.jpg"
          alt="Community Street Cleaning Derby Road"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Soft, clean dark overlay */}
        <div className="absolute inset-0 bg-[#0d0905]/45 z-10" />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(13,9,5,0.40) 0%, rgba(13,9,5,0.20) 50%, rgba(13,9,5,0.60) 100%)',
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="container max-w-4xl mx-auto px-6 relative z-20 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="bg-black/35 backdrop-blur-[2px] p-6 sm:p-10 rounded-lg border border-white/15 shadow-2xl space-y-4 max-w-2xl mx-auto"
        >
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            COMMMUNITY STREET CLEANING
          </h2>
          <p className="font-roboto text-sm sm:text-base md:text-lg font-medium text-white max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            On the 7th of December, 2017, volunteers from the community set out to clean Derby road. supported by Believer's Loveworld Church Southampton
          </p>
        </motion.div>
      </div>
    </section>
  )
}
