import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { galleryItemSchema } from '@/lib/validations/gallery'

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items, { status: 200 })
  } catch (error) {
    console.error('Error fetching gallery items API:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if (session.role === 'tester') {
      return NextResponse.json({ message: 'Forbidden: Tester has read-only access' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = galleryItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload data', errors: parsed.error.format() },
        { status: 400 }
      )
    }

    const { title, type, imageUrl, videoUrl, thumbnailUrl, category, isPublished } = parsed.data

    const created = await prisma.galleryItem.create({
      data: {
        title,
        type,
        imageUrl,
        videoUrl: videoUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        category: category || null,
        isPublished,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery item:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
