'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DonateSection() {
  return (
    <section className="bg-white w-full py-16 sm:py-20 lg:py-[90px] overflow-hidden text-zinc-800">
      <div className="container mx-auto px-6 max-w-[1180px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Image with slide-in from left on desktop, fade-up on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 relative aspect-[570/380] w-full rounded-sm overflow-hidden shadow-sm border border-zinc-200"
          >
            <Image
              src="/images/support-tuvaa-donate.jpg"
              alt="Support TUVAA"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center bg-zinc-50"
            />
          </motion.div>

          {/* Right Column: Text Content with slide-in from right on desktop, fade-up on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 text-left space-y-6"
          >
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#31170d] font-bold uppercase tracking-wider">
              DONATE
            </h2>
            <p className="text-[#555] text-sm sm:text-base leading-relaxed text-justify font-roboto">
              There are many activities supporting black communities. To learn more or help our programmes, please get in touch or make a donation.
            </p>
            <div>
              <Link href="/donate" className="inline-block">
                <button
                  className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm shadow hover:shadow-md cursor-pointer"
                >
                  Learn More
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
