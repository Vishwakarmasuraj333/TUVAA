import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MessageSquare, Calendar, User } from 'lucide-react'
import PageBanner from '@/components/common/PageBanner'
import BlogSidebar from '@/components/common/BlogSidebar'
import { prisma, isDbAvailable } from '@/lib/prisma'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const categoryName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return {
    title: `${categoryName} News & Updates | TUVAA`,
    description: `Explore all news articles, stories and announcements under ${categoryName} category from TUVAA.`,
    openGraph: {
      title: `${categoryName} News | TUVAA`,
      description: `Explore all news articles and updates under ${categoryName} category.`,
    }
  }
}

export const dynamic = 'force-dynamic'

export default async function CategoryNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ search?: string }>
}) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const search = (resolvedSearchParams.search || '').trim()

  const formattedCategory = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  let posts: any[] = []

  if (await isDbAvailable()) {
    try {
      posts = await (prisma.newsPost as any).findMany({
        where: {
          isPublished: true,
          category: { contains: formattedCategory },
          ...(search
            ? {
                OR: [
                  { title: { contains: search } },
                  { excerpt: { contains: search } },
                  { content: { contains: search } },
                ],
              }
            : {}),
        },
        orderBy: { publishedAt: 'desc' },
        include: {
          comments: {
            where: { approved: true }
          }
        }
      })
    } catch (e) {
      console.error('Failed to fetch category posts:', e)
    }
  }

  return (
    <div className="w-full bg-white text-[#35170f]">
      <PageBanner
        title={`Category: ${formattedCategory}`}
        breadcrumb={`Category / ${formattedCategory}`}
      />

      <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start lg:px-10 lg:py-24">
        <main>
          <div className="mb-8 border-b border-[#eee7dc] pb-4">
            <h1 className="font-cinzel text-2xl font-bold uppercase tracking-wider text-[#35170f]">
              {formattedCategory} Articles
            </h1>
            <p className="text-xs text-[#8b8178] mt-1">
              Showing {posts.length} published post{posts.length === 1 ? '' : 's'} in this category.
            </p>
          </div>

          <div className="space-y-14">
            {posts.map((post) => (
              <article key={post.id} className="grid gap-7 border-b border-[#eee7dc] pb-14 sm:grid-cols-[240px_minmax(0,1fr)]">
                <Link href={`/news/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#f2eee8] sm:aspect-square rounded-sm shadow-sm">
                  <Image
                    src={post.image || '/images/event-placeholder.jpg'}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-[#DB9E30]/10 text-[#DB9E30] text-[10px] font-bold font-cinzel uppercase px-2.5 py-1 rounded mb-3">
                      {post.category || 'General'}
                    </span>
                    <h2 className="font-cinzel text-xl font-bold uppercase leading-tight sm:text-2xl">
                      <Link href={`/news/${post.slug}`} className="transition-colors hover:text-[#DB9E30]">
                        {post.title}
                      </Link>
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[#9a8d83]">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author || 'TUVAA'}</span>
                      <span>•</span>
                      <time className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(post.publishedAt)}
                      </time>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {post.comments?.length || 0} Comments
                      </span>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#8b8178]">
                      {post.excerpt || post.content}
                    </p>
                  </div>
                  <div className="mt-6">
                    <Link href={`/news/${post.slug}`} className="btn-primary-hover inline-block rounded-sm px-6 py-2.5 font-cinzel text-[10px] font-bold uppercase tracking-widest">
                      Read more
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="border border-[#eee7dc] py-20 text-center text-[#8b8178] rounded-sm">
              No published articles found in category "{formattedCategory}".
            </div>
          )}
        </main>

        <BlogSidebar />
      </div>
    </div>
  )
}
