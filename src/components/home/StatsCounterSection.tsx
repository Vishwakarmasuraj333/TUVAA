'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

interface CountUpProps {
  target: number
  suffix?: string
}

function CountUp({ target, suffix = '' }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = target
    const duration = 2000 // 2 seconds
    const startTime = performance.now()

    const updateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      
      // Ease out quad
      const easeProgress = progress * (2 - progress)
      
      const currentCount = Math.floor(easeProgress * (end - start) + start)
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isInView, target])

  return (
    <span ref={ref} className="font-cinzel font-extrabold text-[42px] md:text-5xl leading-none">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function StatsCounterSection() {
  const [imgFailed, setImgFailed] = useState(false)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as any,
      },
    },
  }

  const stats = [
    {
      target: 54,
      suffix: '',
      label: 'Diverse',
      text: 'Community with over 54 different nationalities represented.',
    },
    {
      target: 4000,
      suffix: '',
      label: 'Festival',
      text: 'Over 4000 men & women attend African and Caribbean festival',
    },
    {
      target: 70,
      suffix: '%',
      label: 'Young',
      text: '70 percent of our community is under the age of 35.',
    },
  ]

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#DB9E30] to-[#b8791f] text-white py-12 md:py-[70px] flex items-center justify-center">
      {/* Pattern background image */}
      {!imgFailed && (
        <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-15">
          <Image
            src="/images/bg-footer.jpg"
            alt="Stats Background"
            fill
            sizes="100vw"
            className="object-cover object-center mix-blend-overlay"
            onError={() => setImgFailed(true)}
          />
        </div>
      )}

      <div className="container max-w-[1180px] mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center"
        >
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col items-center space-y-3 max-w-sm mx-auto"
            >
              {/* Number CountUp */}
              <CountUp target={item.target} suffix={item.suffix} />
              
              {/* Label */}
              <h3 className="font-cinzel text-sm sm:text-base font-bold tracking-widest uppercase">
                {item.label}
              </h3>
              
              {/* Info Text */}
              <p className="font-roboto text-xs sm:text-sm font-medium text-white/90 leading-relaxed max-w-[280px]">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
