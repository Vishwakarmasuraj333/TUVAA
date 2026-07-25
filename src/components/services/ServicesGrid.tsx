'use client'

import { motion } from 'framer-motion'
import { ServiceViewModel } from '@/types/service'
import ServiceCard from './ServiceCard'

interface ServicesGridProps {
  services: ServiceViewModel[]
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  // Stagger container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  return (
    <section className="bg-white w-full pt-[50px] pb-[50px] lg:pt-[90px] lg:pb-[100px] text-zinc-800">
      <div className="container mx-auto px-6 max-w-[1180px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-[50px] lg:gap-y-[68px] gap-x-[46px]"
        >
          {services.map((service) => (
            <div key={service.id || service.slug} className="w-full">
              <ServiceCard service={service} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
