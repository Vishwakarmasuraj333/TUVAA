import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession, hasRole } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const gallery = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(gallery)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()
    const { title, type, imageUrl, videoUrl, category, isPublished } = data

    if (!title || !type || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const galleryItem = await prisma.galleryItem.create({
      data: {
        title,
        type,
        imageUrl,
        videoUrl,
        category,
        isPublished: isPublished ?? true,
      }
    })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'CREATE',
        entity: 'GalleryItem',
        entityId: galleryItem.id,
        message: `Added gallery item: ${galleryItem.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json(galleryItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
