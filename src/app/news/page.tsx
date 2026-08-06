import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import PageBanner from '@/components/common/PageBanner'
import BlogSidebar from '@/components/common/BlogSidebar'
import { prisma, isDbAvailable } from '@/lib/prisma'

export const metadata: Metadata = { title: 'All Posts', description: 'News and updates from TUVAA.' }
export const dynamic = 'force-dynamic'

interface NewsView {
  id: string
  title: string
  slug: string
  excerpt: string
  image: string
  date: string
  comments: number
}

const fallbackNews: NewsView[] = [
  { id: 'news-1', title: 'BBAM fundraiser, gala and awards night', slug: 'bbam-fundraiser-gala-and-awards-night', excerpt: 'The United Voice of African Associations celebrated achievement, creativity and community at the BBAM fundraiser and awards evening.', image: '/images/bbam-gala.jpg', date: 'February 7, 2024', comments: 0 },
  { id: 'news-2', title: 'Black History Month – Story Telling', slug: 'black-history-month-story-telling', excerpt: 'A memorable evening of history, lived experience and stories shared by members of our community.', image: '/images/hidden-histories.png', date: 'November 17, 2023', comments: 0 },
  { id: 'news-3', title: 'Grant to the United Voice of Africa Association Southampton', slug: 'grant-to-the-united-voice-of-africa-association-southampton', excerpt: 'Support for TUVAA will help strengthen local programmes, community outreach and opportunities.', image: '/images/tuva1-400x450.jpg', date: 'November 1, 2023', comments: 0 },
  { id: 'news-4', title: 'Yacht Club Human Race Shutdown of Children Sustainability Summer BBAM Festival', slug: 'yacht-club-children-sustainability-bbam-festival', excerpt: 'Young people joined an inspiring programme focused on sustainability, confidence and community connection.', image: '/images/bbam-video-thumb.jpg', date: 'October 14, 2023', comments: 0 },
  { id: 'news-5', title: 'Men Swimming', slug: 'men-swimming', excerpt: 'TUVAA is working in partnership with Active Nation to provide supportive swimming sessions for men.', image: '/images/men-swimming.jpg', date: 'May 31, 2023', comments: 0 },
  { id: 'news-6', title: 'Women’s Swimming', slug: 'womens-swimming', excerpt: 'Accessible swimming lessons support health, confidence and wellbeing for women in our community.', image: '/images/women-swimming.jpg', date: 'May 31, 2023', comments: 0 },
  { id: 'news-7', title: 'Kayak & Sailing', slug: 'kayak-and-sailing', excerpt: 'TUVAA and local partners created safe, active water-sports opportunities for young people.', image: '/images/kayak-sailing.jpg', date: 'May 31, 2023', comments: 0 },
]

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string | string[]; s?: string | string[]; category?: string | string[]; cat?: string | string[] }>
}) {
  const resolvedParams = await searchParams
  const rawSearch = resolvedParams.search || resolvedParams.s
  const search = (Array.isArray(rawSearch) ? rawSearch[0] : rawSearch || '').trim()

  const rawCategory = resolvedParams.category || resolvedParams.cat
  const category = (Array.isArray(rawCategory) ? rawCategory[0] : rawCategory || '').trim()

  let news: NewsView[] = []
  let directoryMatches: { id: string; title: string; type: string }[] = []

  if (await isDbAvailable()) {
    try {
      const [posts, listings] = await Promise.all([
        prisma.newsPost.findMany({
          where: {
            isPublished: true,
            ...(category && category !== 'All' ? { category: { contains: category } } : {}),
            ...(search
              ? {
                  OR: [
                    { title: { contains: search } },
                    { excerpt: { contains: search } },
                    { content: { contains: search } },
                    { category: { contains: search } },
                  ],
                }
              : {}),
          },
          orderBy: { publishedAt: 'desc' },
        }),
        search
          ? prisma.directoryListing.findMany({
              where: {
                isPublished: true,
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } },
                  { category: { contains: search } },
                ],
              },
              select: { id: true, title: true, type: true },
              take: 10,
            })
          : Promise.resolve([]),
      ])
      news = posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || post.content || '',
        image: post.image || '/images/event-placeholder.jpg',
        date: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(post.publishedAt),
        comments: 0,
      }))
      directoryMatches = listings
    } catch (error) {
      // Fallback
    }
  }

  if (!news.length) {
    news = fallbackNews.filter((post) => {
      const matchesSearch = !search || `${post.title} ${post.excerpt}`.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }

  const typeRoutes: Record<string, string> = { artist: '/artist', musician: '/musicians', business: '/businesses', professional: '/skills-professionals', community_group: '/community-groups' }

  return (
    <div className="w-full bg-white text-[#35170f]">
      <PageBanner title={category && category !== 'All' ? `News: ${category}` : "All Posts"} breadcrumb="All Posts" />
      <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start lg:px-10 lg:py-24">
        <main>
          {category && category !== 'All' && <p className="mb-4 text-xs uppercase tracking-wider font-bold text-[#DB9E30]">Category: <strong>{category}</strong></p>}
          {search && <p className="mb-9 text-sm text-[#8b8178]">Search results for <strong className="text-[#35170f]">“{search}”</strong></p>}

          {directoryMatches.length > 0 && (
            <section className="mb-12 rounded-sm border border-[#eee7dc] bg-[#faf8ef] p-6">
              <h2 className="mb-4 font-cinzel text-lg font-bold">Directory matches</h2>
              <div className="flex flex-wrap gap-3">{directoryMatches.map((item) => <Link key={item.id} href={typeRoutes[item.type] || '/bbam-2'} className="rounded-full border border-[#DB9E30]/40 bg-white px-4 py-2 text-xs hover:border-[#57a68f] hover:text-[#57a68f]">{item.title}</Link>)}</div>
            </section>
          )}
          <div className="space-y-14">
            {news.map((post) => (
              <article key={post.id} className="grid gap-7 border-b border-[#eee7dc] pb-14 sm:grid-cols-[220px_minmax(0,1fr)]">
                <Link href={`/news/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#f2eee8] sm:aspect-square">
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 640px) 100vw, 220px" className="object-cover transition-transform duration-500 hover:scale-105" />
                </Link>
                <div>
                  <h2 className="font-cinzel text-xl font-bold uppercase leading-tight sm:text-2xl"><Link href={`/news/${post.slug}`} className="transition-colors hover:text-[#DB9E30]">{post.title}</Link></h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#9a8d83]"><span>TUVAA</span><span>•</span><time>{post.date}</time><span>•</span><span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.comments} Comments</span></div>
                  <p className="mt-5 line-clamp-4 text-sm leading-7 text-[#8b8178]">{post.excerpt}</p>
                  <Link href={`/news/${post.slug}`} className="btn-primary-hover mt-6 inline-block rounded-sm px-5 py-2.5 font-cinzel text-[10px] font-bold uppercase tracking-widest">Read more</Link>
                </div>
              </article>
            ))}
          </div>
          {news.length === 0 && <div className="border border-[#eee7dc] py-20 text-center text-[#8b8178]">No matching posts were found.</div>}
        </main>
        <BlogSidebar />
      </div>
    </div>
  )
}
