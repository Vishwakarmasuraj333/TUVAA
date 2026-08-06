import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.newsPost.findMany({
      where: { isPublished: true },
      select: { category: true }
    })

    const counts: Record<string, number> = {}
    posts.forEach(p => {
      const cat = p.category || 'General'
      counts[cat] = (counts[cat] || 0) + 1
    })

    const categories = Object.entries(counts).map(([name, count]) => ({
      name,
      slug: name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      count
    }))

    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
