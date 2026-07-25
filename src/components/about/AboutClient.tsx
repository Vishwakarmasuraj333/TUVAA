'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import PageBanner from '@/components/common/PageBanner'

interface ExecutiveCardProps {
  name: string
  role: string
  imgPath: string
}

function ExecutiveCard({ name, role, imgPath }: ExecutiveCardProps) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div className="bg-white p-6 rounded-lg border border-[#e8dfc8]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left hover:shadow-[0_8px_30px_rgba(219,158,48,0.1)] transition-all duration-300 group">
      <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-[#e2ebf0] flex items-center justify-center text-[#90a4ae] shrink-0 shadow-inner relative ring-2 ring-[#DB9E30]/40 ring-offset-4 ring-offset-white group-hover:ring-[#DB9E30] transition-all duration-300">
        {!imgFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgPath}
            alt={name}
            className="w-full h-full object-cover object-center animate-fade-in group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <ImageIcon className="h-8 w-8 opacity-60" />
        )}
      </div>
      <div className="pt-2">
        <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#35170f] uppercase tracking-wider group-hover:text-[#DB9E30] transition-colors">{name}</h4>
        <p className="text-sm text-[#DB9E30] font-bold mt-1 tracking-widest uppercase">{role}</p>
      </div>
    </div>
  )
}

export default function AboutClient() {
  const [showMoreMembers, setShowMoreMembers] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as any,
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as any },
    },
  }

  return (
    <div className="w-full bg-white min-h-screen pb-20">
      <PageBanner
        title="About"
        breadcrumb="About"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="container mx-auto px-6 py-16 md:py-24 max-w-[1100px] space-y-20 text-[#8b8178]"
      >
        {/* Welcome Section (Replacing Our Story) */}
        <div className="space-y-12">
          {/* Centered Heading */}
          <div className="text-center">
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#DB9E30] via-[#c9881d] to-[#DB9E30]">
              WELCOME TO THE TUVAA
            </h2>
            <div className="w-24 h-0.5 bg-[#DB9E30] mx-auto mt-4" />
          </div>

          {/* 2-Column Row for Photo & Paragraphs 1-2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
            {/* Left Column: Image */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.3 }}
              className="md:col-span-6 relative h-[250px] sm:h-[350px] md:h-[380px] w-full rounded-sm overflow-hidden shadow-md border border-zinc-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/tuvaa-about-team.jpg"
                alt="TUVAA Team and Volunteers"
                className="w-full h-full object-cover object-center bg-zinc-50"
              />
            </motion.div>

            {/* Right Column: Paragraph 1 & 2 */}
            <motion.div variants={itemVariants} className="md:col-span-6 space-y-6 text-left text-sm md:text-base leading-relaxed text-zinc-600 font-medium">
              <p>
                Founded in 2015, the United Voice of African Associations, now commonly known as TUVAA, is an umbrella organisation for Africans living in Southampton and the surrounding areas of this beautiful county of Hampshire. The birth of TUVAA was a milestone achievement for our individual African societies. Through TUVAA, the African member associations forged a unity of purpose and enhanced the promotion of our collective interests, our diverse cultures, customs, and values.
              </p>
              <p>
                In TUVAA we created a platform that would enable us to speak with one voice and make us more visible in our community. Part of our agenda, as various nationalities, was to share in our diverse cultural heritage, our sense of pride in our roots and who we are. We are proud of our African roots and our rich cultural heritage and will always thrive to maintain this, for posterity.
              </p>
            </motion.div>
          </div>

          {/* Full Width Paragraph 3 & 4 */}
          <motion.div variants={itemVariants} className="space-y-6 text-left text-sm md:text-base leading-relaxed text-zinc-600 font-medium border-t border-zinc-100 pt-10">
            <p>
              However, we are also cognisant of the fact that in this beautiful country which we have made our home, are people, the British people, who are just as proud of their own culture as we are about ours. It is in this light that, as part of our agenda, we sought to do our part, in whatever way we can, towards making this country a better place. We have forged relationships, not only amongst ourselves as Africans but also with our host population. This is because, in addition to promoting our own African culture, social cohesion, even in the face of cultural diversity within the various communities, have been and always will be at the core of our agenda as TUVAA.
            </p>
            <p>
              We have fostered stronger relationships, not only amongst ourselves as Africans but also between us and the white British communities and other minority ethnic groups we live alongside. We think that it is only right that, we work alongside our British counterparts, towards a society we can all be proud of.
            </p>
          </motion.div>
        </div>

        {/* Three Action Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4">
          <Link href="/gallery" className="block group">
            <div className="bg-[#DB9E30] hover:bg-[#c9881d] text-white font-cinzel font-bold text-2xl uppercase tracking-[0.12em] h-[150px] flex items-center justify-center rounded-sm shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
              Gallery
            </div>
          </Link>
          <Link href="/donate" className="block group">
            <div className="bg-[#e05326] hover:bg-[#c2411b] text-white font-cinzel font-bold text-2xl uppercase tracking-[0.12em] h-[150px] flex items-center justify-center rounded-sm shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
              Donate Online
            </div>
          </Link>
          <Link href="/contact" className="block group">
            <div className="bg-[#57a68f] hover:bg-[#468c77] text-white font-cinzel font-bold text-2xl uppercase tracking-[0.12em] h-[150px] flex items-center justify-center rounded-sm shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
              Get In Touch
            </div>
          </Link>
        </motion.div>

        {/* OUR TUVAA EXECUTIVES SECTION */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-start border-t border-zinc-100">
          {/* Left Column: Title & Objectives */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold tracking-wide uppercase leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#DB9E30] via-[#c9881d] to-[#DB9E30]">
              OUR TUVAA<br />EXECUTIVES
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-left font-bold text-[#35170f]">
              As TUVAA executive, we are responsible for the daily running of the group and here are our objects:
            </p>
            <ul className="space-y-4 text-xs md:text-sm leading-relaxed text-left text-zinc-600 font-medium">
              <li>
                <strong className="text-[#35170f] font-mono">i)</strong> Promote social cohesion by fostering stronger relationships between Africans living in Southampton and its Surroundings with locals living in their neighbourhoods.
              </li>
              <li>
                <strong className="text-[#35170f] font-mono">ii)</strong> Promote cultural diversity by engaging Africans, other migrants and minorities living in Southampton and its environs.
              </li>
              <li>
                <strong className="text-[#35170f] font-mono">iii)</strong> Encourage training, sharing of information and experiences with members of the group on a regular basis.
              </li>
              <li>
                <strong className="text-[#35170f] font-mono">iv)</strong> Bring African groups together under one umbrella. Facilitate the creation of one voice to promote African interest, values and culture. Represent the unified voice emerging from affiliated associations on issues that affect Africans living in Hampshire as agreed by the committee.
              </li>
              <li>
                <strong className="text-[#35170f] font-mono">v)</strong> Forge partnership with other organisations with similar interest and or establish partnership with groups, individuals and organisations of interest to the committee.
              </li>
            </ul>

            <button
              onClick={() => setShowMoreMembers(!showMoreMembers)}
              className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm shadow-md cursor-pointer text-white"
            >
              {showMoreMembers ? 'Hide Board Members' : 'More Board Members'}
            </button>
          </div>

          {/* Right Column: Executives Cards */}
          <div className="lg:col-span-7 space-y-6 w-full">
            <ExecutiveCard
              name="Dr. Abdoulie Sanneh"
              role="TUVAA Chair"
              imgPath="/images/sanneh.jpg"
            />
            <ExecutiveCard
              name="Tsepiso Kumalo"
              role="V. chair"
              imgPath="/images/kumalo.jpg"
            />
            <ExecutiveCard
              name="Darlington Odum"
              role="Secretary"
              imgPath="/images/odum.jpg"
            />

            {/* Collapsible Additional Members */}
            <AnimatePresence>
              {showMoreMembers && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 overflow-hidden pt-2"
                >
                  <ExecutiveCard
                    name="Leon"
                    role="Raffle Coordinator"
                    imgPath="/images/leon.jpg"
                  />
                  <ExecutiveCard
                    name="Pee"
                    role="Volunteer & Event Coordinator"
                    imgPath="/images/pee.jpg"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* OUR PHILOSOPHY SECTION */}
        <motion.div variants={itemVariants} className="pt-24 space-y-12">
          <h2 className="font-cinzel text-3xl md:text-5xl text-[#35170f] font-bold tracking-wide uppercase text-center">
            OUR PHILOSOPHY
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Card 1 */}
            <div className="flex flex-col items-center space-y-6 group cursor-pointer">
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-zinc-100 rounded-sm shadow-sm group-hover:shadow-md transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/african-dance.jpg"
                  alt="Promoting African Cultures and Traditions"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none flex items-center justify-center z-10">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={`card1-${i}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          delay: i * 0.2,
                        }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="font-cinzel text-lg md:text-xl text-[#DB9E30] font-bold uppercase text-center leading-snug group-hover:text-[#c9881d] transition-colors">
                PROMOTING AFRICAN CULTURES AND TRADITIONS
              </h3>
            </div>

            {/* Card 2 */}
            <Link href="/services/bame-mental-health-and-wellbeing" className="flex flex-col items-center space-y-6 group">
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-zinc-100 rounded-sm shadow-sm group-hover:shadow-md transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/community-meeting.jpg"
                  alt="BAME Mental Health and Wellbeing"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none flex items-center justify-center z-10">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={`card2-${i}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          delay: i * 0.2,
                        }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="font-cinzel text-lg md:text-xl text-[#DB9E30] font-bold uppercase text-center leading-snug group-hover:text-[#c9881d] transition-colors">
                BAME MENTAL HEALTH AND WELLBEING
              </h3>
            </Link>

            {/* Card 3 */}
            <Link href="/services/hidden-histories" className="flex flex-col items-center space-y-6 group">
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-zinc-100 rounded-sm shadow-sm group-hover:shadow-md transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hidden-histories.png"
                  alt="Hidden Histories"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none flex items-center justify-center z-10">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={`card3-${i}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          delay: i * 0.2,
                        }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="font-cinzel text-lg md:text-xl text-[#DB9E30] font-bold uppercase text-center leading-snug group-hover:text-[#c9881d] transition-colors">
                HIDDEN HISTORIES
              </h3>
            </Link>
          </div>

          {/* View More Button */}
          <div className="flex justify-center pt-8">
            <Link
              href="/our-services"
              className="btn-primary-hover text-white transition-colors font-cinzel font-bold text-sm md:text-base tracking-widest px-10 py-4 rounded-sm shadow-md"
            >
              View More
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
