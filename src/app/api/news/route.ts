import { NextResponse } from 'next/server'
import { prisma, isDbAvailable } from '@/lib/prisma'
import { FALLBACK_NEWS_POSTS } from '@/lib/news'

export async function GET() {
  if (await isDbAvailable()) {
    try {
      const posts = await prisma.newsPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      })
      
      if (posts && posts.length > 0) {
        return NextResponse.json(posts, { status: 200 })
      }
    } catch (error) {
      // Fall through to fallback
    }
  }

  return NextResponse.json(FALLBACK_NEWS_POSTS, { status: 200 })
}
