'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function EventsSection() {
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

  return (
    <section className="bg-white text-[#8b8178] pt-16 md:pt-24 pb-0 font-sans border-t border-zinc-100">
      <div className="container max-w-[1100px] mx-auto px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center">
          <h2 className="font-cinzel text-3xl md:text-4.5xl text-[#35170f] font-bold tracking-wide uppercase">
            EVENTS
          </h2>
        </div>

        {/* Top Swimming Card Section */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative h-[240px] sm:h-[300px] w-full rounded-sm overflow-hidden shadow-md border border-zinc-100"
          >
            <Image
              src="/images/women-swimming.jpg"
              alt="Women Swimming Lesson"
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center bg-zinc-50"
            />
          </motion.div>
          <div className="space-y-4">
            <h3 className="font-cinzel text-xl sm:text-2xl text-[#35170f] font-bold tracking-wider leading-snug">
              WOMEN SWIMMING<br />LESSON
            </h3>
            <Link href="/our-events" className="inline-block">
              <button
                className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-sm shadow-md cursor-pointer text-white"
              >
                View More
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Light Cream Strip Section */}
      <div className="w-full bg-[#f7f3e8] mt-16 py-16 px-6 lg:px-8 border-y border-[#e8dfc8]">
        <div className="container max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Text */}
          <div className="space-y-6 text-[#8b8178] text-sm md:text-base leading-relaxed text-justify">
            <p>
              TUVAA has partnered with Energise Me and Active Nation to deliver accessible and affordable swimming lessons to TUVAA members and supporters in the Southampton community. The programme has been running for two years and is held on Sundays at Bitterne Leisure Centre for women and children, and at the Quays on Mondays for men. The lessons cater to over 40 women, 60 children and 20 men of different abilities in each term. Feedback from the participants is overwhelmingly positive with many returnees each term.
            </p>
            <p>
              Some of the participants have gone on to attend taster sessions in watersports such as sailing, canoeing, kayaking and paddleboarding after gaining the confidence to be in the water. Active Nation has extended support to providing free lessons throughout the summer for TUVAA members and supporters.
            </p>
          </div>

          {/* Right Image */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative h-[280px] sm:h-[350px] md:h-[400px] w-full rounded-sm overflow-hidden shadow-md border border-[#e8dfc8]"
          >
            <Image
              src="/images/events-cultural.jpg"
              alt="TUVAA Cultural Event"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center bg-zinc-50"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
