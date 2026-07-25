import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'

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

export default function BlogSidebar() {
  return (
    <aside aria-label="News search and recent posts" className="h-fit bg-[#faf8ef] text-[#35170f] lg:sticky lg:top-[120px]">
      <section className="border-b border-[#e7e0d5] px-6 py-10 sm:px-10 sm:py-12">
        <h2 className="mb-7 font-cinzel text-2xl font-semibold uppercase">Search</h2>
        <form action="/news" method="get" role="search" className="relative">
          <label htmlFor="news-search" className="sr-only">Search news and directories</label>
          <input id="news-search" name="search" type="search" placeholder="Search …" className="w-full rounded-md bg-[#efeee7] py-4 pl-4 pr-12 text-sm text-[#5b4b43] outline-none transition-shadow placeholder:text-[#9a8d83] focus:ring-2 focus:ring-[#DB9E30]" />
          <button type="submit" aria-label="Submit search" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#35170f] hover:text-[#DB9E30]"><Search className="h-5 w-5" /></button>
        </form>
      </section>
      <section className="px-6 py-10 sm:px-10 sm:py-12">
        <h2 className="mb-8 font-cinzel text-2xl font-semibold uppercase">Recent Posts</h2>
        <div className="space-y-7">
          {recentPosts.map((post) => (
            <Link key={post.href} href={post.href} className="group grid grid-cols-[80px_1fr] gap-4">
              <div className="relative aspect-square overflow-hidden bg-[#e8e2d9]">
                <Image src={post.image} alt="" fill sizes="80px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div>
                <h3 className="font-cinzel text-sm font-bold leading-snug transition-colors group-hover:text-[#DB9E30]">{post.title}</h3>
                <p className="mt-2 text-xs text-[#9a8d83]">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  )
}
