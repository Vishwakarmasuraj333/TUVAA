'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, FolderKanban } from 'lucide-react'

interface PostSummary {
  title: string
  date: string
  image: string
  href: string
}

const defaultCategories = [
  'All',
  'General',
  'Festival',
  'Culture',
  'Youth',
  'Sports',
  'Health',
  'Community',
]

const fallbackPosts: PostSummary[] = [
  {
    title: 'BBAM fundraiser, gala and awards night',
    date: 'February 7, 2024',
    image: '/images/bbam-gala.jpg',
    href: '/news/bbam-fundraiser-gala-and-awards-night',
  },
  {
    title: 'Black History Month – Story Telling',
    date: 'November 17, 2023',
    image: '/images/hidden-histories.png',
    href: '/news/black-history-month-story-telling',
  },
  {
    title: 'Grant to the United Voice of Africa Association Southampton',
    date: 'November 1, 2023',
    image: '/images/tuva1-400x450.jpg',
    href: '/news/grant-to-the-united-voice-of-africa-association-southampton',
  },
]

export default function BlogSidebar() {
  const [recentPosts, setRecentPosts] = useState<PostSummary[]>(fallbackPosts)

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch('/api/news')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            const formatted: PostSummary[] = data.slice(0, 4).map((post: any) => ({
              title: post.title,
              date: post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Recent',
              image: post.image || '/images/event-placeholder.jpg',
              href: `/news/${post.slug}`,
            }))
            setRecentPosts(formatted)
          }
        }
      } catch (e) {
        // Fallback remains
      }
    }
    fetchRecent()
  }, [])

  return (
    <aside aria-label="News search, categories and recent posts" className="h-fit bg-[#faf8ef] text-[#35170f] lg:sticky lg:top-[120px] rounded-sm border border-[#e7e0d5]">
      {/* Search Section */}
      <section className="border-b border-[#e7e0d5] px-6 py-8 sm:px-8">
        <h2 className="mb-6 font-cinzel text-xl font-bold uppercase tracking-wider">Search</h2>
        <form action="/news" method="get" role="search" className="relative">
          <label htmlFor="news-search" className="sr-only">Search news and directories</label>
          <input
            id="news-search"
            name="search"
            type="search"
            placeholder="Search news..."
            className="w-full rounded-md bg-[#efeee7] py-3.5 pl-4 pr-12 text-xs text-[#5b4b43] outline-none transition-shadow placeholder:text-[#9a8d83] focus:ring-2 focus:ring-[#DB9E30]"
          />
          <button type="submit" aria-label="Submit search" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#35170f] hover:text-[#DB9E30]">
            <Search className="h-4 w-4" />
          </button>
        </form>
      </section>

      {/* Categories Section */}
      <section className="border-b border-[#e7e0d5] px-6 py-8 sm:px-8">
        <h2 className="mb-6 font-cinzel text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-[#DB9E30]" /> Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {defaultCategories.map((cat) => (
            <Link
              key={cat}
              href={cat === 'All' ? '/news' : `/news?category=${encodeURIComponent(cat)}`}
              className="inline-block rounded-sm border border-[#e8dfc8] bg-white px-3 py-1.5 text-xs text-[#5b4b43] transition-colors hover:border-[#DB9E30] hover:bg-[#DB9E30] hover:text-white"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="px-6 py-8 sm:px-8">
        <h2 className="mb-6 font-cinzel text-xl font-bold uppercase tracking-wider">Recent Posts</h2>
        <div className="space-y-6">
          {recentPosts.map((post) => (
            <Link key={post.href} href={post.href} className="group grid grid-cols-[70px_1fr] gap-3.5">
              <div className="relative aspect-square overflow-hidden bg-[#e8e2d9] rounded-sm">
                <Image src={post.image} alt={post.title} fill sizes="70px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-cinzel text-xs font-bold leading-snug text-[#35170f] transition-colors group-hover:text-[#DB9E30] line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-1 text-[11px] text-[#9a8d83]">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  )
}

