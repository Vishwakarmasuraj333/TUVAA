'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Calendar } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image: string | null
  createdAt: string
}

export default function RecentNewsSection() {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news')
        if (response.ok) {
          const data = await response.json()
          setNewsList(data)
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  // Static fallback data matching screenshot specifications
  const fallbackMain = {
    title: 'KAYAK & Sailing',
    date: 'May 21, 2022',
    image: '/images/kayak-sailing.jpg',
    excerpt: 'TUVAA in partnership with Active Nation and the Royal Yacht Association. For more information and how you can register please click the link below: https://widget.eola.co/550/activities/7zcf LAST CHANCE FOR KAYAKING THIS YEAR SEPT 23/24 BOOK AT LINK BELOW https://widget.eola.co/752/activities/tuvaa-watersports Announcement- water, sailing or kayak TUVAA’s partnership with Active Nation in watersports…',
    href: '/news/kayak-and-sailing',
  }

  const fallbackList = [
    { title: 'MEN SWIMMING', date: 'May 11, 2023', href: '/news' },
    { title: 'Women’s Swimming', date: 'May 10, 2023', href: '/news' },
  ]

  // Decide what to display
  const hasDynamicData = newsList.length > 0
  const mainPost = hasDynamicData ? newsList[0] : null
  const sidePosts = hasDynamicData ? newsList.slice(1, 3) : []

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
    <section className="bg-white text-[#8b8178] py-16 md:py-24 font-sans relative z-10 border-t border-zinc-100">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="container max-w-[1100px] mx-auto px-6 lg:px-8 space-y-16"
      >
        {/* Section Title */}
        <div className="text-center">
          <h2 className="font-cinzel text-3xl md:text-4.5xl text-[#35170f] font-bold tracking-wide uppercase">
            OUR RECENT NEWS
          </h2>
        </div>

        {/* 2 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Column 1: Left Main News Card */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.3 }}
              className="relative h-[250px] sm:h-[320px] w-full rounded-sm overflow-hidden shadow border border-zinc-100"
            >
              <Image
                src={mainPost?.image || fallbackMain.image}
                alt={mainPost?.title || fallbackMain.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center bg-zinc-50"
              />
            </motion.div>

            <div className="space-y-3.5 text-left">
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                <Calendar className="h-4 w-4 text-[#DB9E30]" />
                <span>
                  {mainPost
                    ? new Date(mainPost.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                    : fallbackMain.date}
                </span>
              </div>

              <h3 className="font-cinzel text-xl md:text-2xl text-[#DB9E30] font-bold tracking-wider leading-snug">
                {mainPost?.title || fallbackMain.title}
              </h3>

              <p className="text-[#8b8178] text-sm md:text-base leading-relaxed">
                {mainPost?.excerpt || fallbackMain.excerpt}
              </p>

              <Link href={mainPost ? `/news/${mainPost.slug}` : fallbackMain.href} className="inline-block pt-2">
                <button
                  className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-sm shadow-md cursor-pointer text-white"
                >
                  Read more
                </button>
              </Link>
            </div>
          </div>

          {/* Column 2: Right Column (List + Media block) */}
          <div className="space-y-12">

            {/* Top Part: Side News List */}
            <div className="space-y-6 text-left">
              <div className="divide-y divide-zinc-100 border-b border-zinc-100">
                {hasDynamicData && sidePosts.length > 0 ? (
                  sidePosts.map((post) => (
                    <div key={post.id} className="py-4 first:pt-0 space-y-1.5">
                      <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#DB9E30]" />
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <Link href={`/news/${post.slug}`} className="block group">
                        <h4 className="font-cinzel text-base md:text-lg text-[#35170f] group-hover:text-[#DB9E30] font-bold tracking-wide transition-colors leading-snug">
                          {post.title}
                        </h4>
                      </Link>
                    </div>
                  ))
                ) : (
                  fallbackList.map((post, idx) => (
                    <div key={idx} className="py-4 first:pt-0 space-y-1.5">
                      <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#DB9E30]" />
                        {post.date}
                      </span>
                      <Link href={post.href} className="block group">
                        <h4 className="font-cinzel text-base md:text-lg text-[#35170f] group-hover:text-[#DB9E30] font-bold tracking-wide transition-colors leading-snug">
                          {post.title}
                        </h4>
                      </Link>
                    </div>
                  ))
                )}
              </div>

              <Link href="/news" className="inline-block">
                <button
                  className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-sm shadow-md cursor-pointer text-white"
                >
                  All News
                </button>
              </Link>
            </div>

            {/* Bottom Part: Embedded Media Card */}
            <div className="space-y-4 text-left">
              <h4 className="font-cinzel text-sm sm:text-base text-[#35170f] font-extrabold tracking-wider leading-snug uppercase">
                BBAM RAFFLE PRIZES PLEASE GET IN TOUCH WITH LEON IF YOU HAVE A PRIZE
              </h4>

              <div className="relative aspect-video w-full rounded-sm overflow-hidden shadow border border-zinc-100 group cursor-pointer bg-zinc-950">
                <Image
                  src="/images/bbam-gala-video.jpg"
                  alt="BBAM Gala Video"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center opacity-85 group-hover:opacity-75 transition-opacity"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="h-14 w-14 rounded-full bg-[#DB9E30] hover:bg-[#57a68f] text-white flex items-center justify-center shadow-lg transition-colors duration-300 active:scale-95"
                  >
                    <Play className="h-6 w-6 fill-white ml-0.5" />
                  </motion.div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  )
}
