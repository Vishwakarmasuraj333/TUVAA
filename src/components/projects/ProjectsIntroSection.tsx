'use client'

import { motion } from 'framer-motion'

export default function ProjectsIntroSection() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[920px] px-6 py-[55px] md:pt-[80px] md:pb-[60px] text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h3 className="font-cinzel text-[20px] md:text-[26px] font-normal text-[#35170f] tracking-wide leading-[1.4]">
            Some of the projects run by TUVAA over the years
          </h3>
          {/* Gold accent underline */}
          <div className="w-16 h-[3px] bg-[#DB9E30] mt-5" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="space-y-5 text-[#6b6560] text-[15px] leading-[1.85]"
        >
          <p>
            Since the inception in 2015 TUVAA ran numerous projects and events among them included: First aid, learn to ride refugee women&apos;s project, international women&apos;s day, hospital visits with group of volunteers, annual ABP Marathon, Computer skills, volunteer recognition events, spinning bike fitness classes, Christmas celebrations, food bank for deprived communities, fund days, Cultural days, Football, men and women swimming projects, culture and heritage projects, language classes, setting up community groups, work placement for schools, work experience for university students, supporting research, trainings, mentoring group leaders, workshops (yellow door) counselling, door knocking.
          </p>
          <p className="font-medium text-[#35170f]">
            Other activities we are involved in to help our community include:
          </p>
          <p>
            Children&apos;s art and poetry, with our partners, the Hansard Gallery, City Museum and Showcase Gallery participating in black history celebrations, online exhibitions dedicated to Black lives matter and platforms that address mental health and isolation.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
