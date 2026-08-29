import PageBanner from '@/components/common/PageBanner'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'

export const metadata = {
  title: 'BBAM - TUVAA',
  description: 'BBAM was created by TUVAA and it showcases and makes visible black businesses, art, music and other professionals.',
}

const recentPosts = [
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
]

export default function BbamPage() {
  return (
    <div className="w-full bg-white min-h-screen pb-20">
      <PageBanner
        title="BBAM"
        breadcrumb="BBAM"
      />

      <div className="container mx-auto px-6 py-16 md:py-24 max-w-[1100px] text-left">
        {/* Intro Text */}
        <p className="text-sm md:text-base leading-relaxed text-[#8b8178] mb-16 max-w-4xl">
          BBAM was created by TUVAA and it showcases and makes visible black businesses, art, music and other professionals. This section is divided into 4 subsections.
        </p>

        {/* Directory Links */}
        <div className="space-y-16 mb-24">
          <Link href="/artist" className="block">
            <h2 className="font-cinzel text-3xl md:text-4.5xl text-[#35170f] font-bold uppercase tracking-wider hover:text-[#DB9E30] transition-colors">
              ARTIST
            </h2>
          </Link>
          <Link href="/musicians" className="block">
            <h2 className="font-cinzel text-3xl md:text-4.5xl text-[#35170f] font-bold uppercase tracking-wider hover:text-[#DB9E30] transition-colors">
              MUSICIANS
            </h2>
          </Link>
          <Link href="/businesses" className="block">
            <h2 className="font-cinzel text-3xl md:text-4.5xl text-[#35170f] font-bold uppercase tracking-wider hover:text-[#DB9E30] transition-colors">
              BUSINESSES
            </h2>
          </Link>
          <Link href="/skills-professionals" className="block">
            <h2 className="font-cinzel text-3xl md:text-4.5xl text-[#35170f] font-bold uppercase tracking-wider hover:text-[#DB9E30] transition-colors">
              SKILLS/PROFESSIONALS
            </h2>
          </Link>
        </div>

        {/* Search and Recent Posts Block */}
        <div className="bg-[#faf8ef] text-[#35170f] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Search Section */}
            <div className="border-b lg:border-b-0 lg:border-r border-[#e7e0d5] px-6 py-10 sm:px-10 sm:py-12 flex flex-col items-start justify-start">
              <h2 className="mb-7 font-cinzel text-2xl font-semibold uppercase">Search</h2>
              <form action="/news" method="get" role="search" className="relative w-full">
                <label htmlFor="news-search" className="sr-only">Search</label>
                <input 
                  id="news-search" 
                  name="search" 
                  type="search" 
                  placeholder="Search …" 
                  className="w-full rounded-sm bg-[#efeee7] py-4 pl-4 pr-12 text-sm text-[#5b4b43] outline-none transition-shadow placeholder:text-[#9a8d83] focus:ring-2 focus:ring-[#DB9E30]" 
                />
                <button type="submit" aria-label="Submit search" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#35170f] hover:text-[#DB9E30]">
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>
            
            {/* Recent Posts Section */}
            <div className="px-6 py-10 sm:px-10 sm:py-12">
              <h2 className="mb-8 font-cinzel text-2xl font-semibold uppercase">Recent Posts</h2>
              <div className="space-y-7">
                {recentPosts.map((post) => (
                  <Link key={post.href} href={post.href} className="group grid grid-cols-[80px_1fr] gap-4">
                    <div className="relative aspect-square overflow-hidden bg-[#e8e2d9] rounded-sm">
                      <Image 
                        src={post.image} 
                        alt={post.title} 
                        fill 
                        sizes="80px" 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-cinzel text-sm font-bold leading-snug transition-colors group-hover:text-[#DB9E30]">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-xs text-[#9a8d83]">{post.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
