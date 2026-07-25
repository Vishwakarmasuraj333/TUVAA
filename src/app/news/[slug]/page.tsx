import PageBanner from '@/components/common/PageBanner'
import { getNewsPostBySlug } from '@/lib/news'
import { notFound } from 'next/navigation'
import NewsDetailClient from '@/components/news/NewsDetailClient'

interface NewsDetailProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NewsDetailProps) {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found - TUVAA',
    }
  }

  return {
    title: `${post.title} - TUVAA`,
    description: post.excerpt || post.content?.slice(0, 150) || '',
  }
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="w-full bg-[#faf8ef] min-h-screen pb-20">
      <PageBanner
        title={post.title}
        breadcrumb={`All Posts » ${post.title}`}
      />

      <NewsDetailClient post={post} />
    </div>
  )
}
