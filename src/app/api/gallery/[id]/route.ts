import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { galleryItemSchema } from '@/lib/validations/gallery'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params
    const item = await prisma.galleryItem.findUnique({
      where: { id },
    })

    if (!item) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 })
    }

    return NextResponse.json(item, { status: 200 })
  } catch (error) {
    console.error('Error fetching gallery item:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if (session.role === 'tester') {
      return NextResponse.json({ message: 'Forbidden: Tester has read-only access' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = galleryItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload data', errors: parsed.error.format() },
        { status: 400 }
      )
    }

    const { title, type, imageUrl, videoUrl, thumbnailUrl, category, isPublished } = parsed.data

    const existing = await prisma.galleryItem.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 })
    }

    const updated = await prisma.galleryItem.update({
      where: { id },
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

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Error updating gallery item:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if (session.role === 'tester') {
      return NextResponse.json({ message: 'Forbidden: Tester has read-only access' }, { status: 403 })
    }

    const { id } = await params

    const existing = await prisma.galleryItem.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 })
    }

    await prisma.galleryItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Gallery item deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
