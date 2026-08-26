'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function CommunityStreetCleaningSection() {
  return (
    <section className="relative w-full h-[520px] md:h-[640px] lg:h-[700px] overflow-hidden bg-zinc-950 flex items-center justify-center">
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0d0905]/55 z-10" />
      </div>

      {/* Content wrapper */}
      <div className="container max-w-4xl mx-auto px-6 relative z-20 text-center text-white space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <h2 className="font-cinzel text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider leading-tight drop-shadow-md">
            COMMMUNITY STREET CLEANING
          </h2>
          <p className="font-roboto text-sm sm:text-base md:text-lg font-medium text-zinc-100 max-w-3xl mx-auto leading-relaxed drop-shadow-sm space-y-1">
            <span className="block">On the 7th of December, 2017, volunteers from the community set out to clean Derby road.</span>
            <span className="block">supported by Believer's Loveworld Church Southampton</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
