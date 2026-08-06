'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function BBAMVolunteersSection() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  }

  const highlightList = [
    'Military parade by commonwealth veterans and servicemen',
    'Cultural displays and entertainment from Africa and Caribbean Islands including: Nigeria, Gambia, Ghana, Zimbabwe, Zambia, Malawi, Guinea, Somalia, Sudan, Cameroon, Kenya, Commonwealth and Caribbean Islands.',
    'Varieties of live music and entertainment by black artists',
    'Jolof rice competition - let the judges decide the winner',
    'Dance and Fashion show - try out our fashion',
    'Art exhibition and sales',
    'Children\'s bouncy castle',
    'And more',
  ]

  return (
    <section id="bbam-section" className="bg-white text-[#8b8178] py-16 md:py-24 relative overflow-hidden font-sans scroll-mt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="container max-w-[1100px] mx-auto px-6 lg:px-8 space-y-16"
      >
        {/* Headings */}
        <div className="text-center space-y-4">
          <h2 className="font-cinzel text-3xl md:text-4.5xl text-[#35170f] font-bold tracking-wide leading-tight">
            BBAM FESTIVAL VOLUNTEERS WANTED!
          </h2>
          <p className="italic text-base md:text-lg text-[#8b8178] font-medium max-w-3xl mx-auto leading-relaxed">
            Join us for the Black Business Art and Music Festival (BBAM) on Sunday, October 12th, 2025 at the Guildhall Square!
          </p>
        </div>

        {/* Row 1: Collage Left, Text Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Left Collage Image */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative h-[380px] sm:h-[480px] md:h-[500px] w-full rounded-sm overflow-hidden shadow-md border border-zinc-100"
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/bbam-collage.jpg"
                alt="BBAM Festival Collage"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center bg-zinc-50"
              />
            </div>
          </motion.div>

          {/* Right Text Content */}
          <div className="space-y-6 text-[#8b8178] text-sm md:text-base leading-relaxed">
            <p className="font-medium text-[#35170f]">
              We're looking for enthusiastic and dedicated volunteers willing to give their time free to help make this event a success. Various roles are available and your lunch is on us.
            </p>
            <p>
              If you're passionate about art, music, and community, we want YOU to be part of our team!
            </p>
            <div className="bg-[#f7f3e8] border-l-4 border-[#DB9E30] p-5 rounded-sm">
              <p className="font-semibold text-[#35170f] font-cinzel">Contact Pee for More Information</p>
              <p className="font-medium text-zinc-700 mt-1">Call/text: +44 7843 106868</p>
            </div>
            <p>
              Join us in celebrating African, Caribbean, and Black British cultures. Let's make this festival unforgettable!
            </p>
            <p className="font-semibold text-[#35170f]">
              Get involved, give your time and be part of something amazing!
            </p>
          </div>
        </div>

        {/* Row 2: Highlights Left, Flyer Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start pt-6">
          {/* Left Highlights List */}
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-[#35170f] font-cinzel leading-tight">
                BBAM is back with a Bang and it is free entry.
              </h3>
              <p className="text-[#DB9E30] font-semibold text-sm">Highlights include:</p>
            </div>
            <ol className="space-y-3.5 text-[#8b8178] text-sm md:text-base">
              {highlightList.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="font-bold text-[#DB9E30] shrink-0">{idx + 1}.</span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Right Flyer Image */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative h-[380px] sm:h-[480px] md:h-[500px] w-full rounded-sm overflow-hidden shadow-md border border-zinc-100"
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/bbam-festival-2025.jpg"
                alt="BBAM Festival 2025 Flyer"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center bg-zinc-50"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Register Button */}
        <div className="text-center pt-8">
          <Link href="/events/black-business-art-and-music-festival-bbam" className="inline-block">
            <button
              className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-11 py-4 sm:px-14 sm:py-[18px] rounded-sm shadow-md cursor-pointer text-white"
            >
              Register
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
