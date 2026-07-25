import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession, hasRole } from '@/lib/auth'

const prisma = new PrismaClient()

import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const item: any = await prisma.galleryItem.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Delete from Cloudinary if publicId exists
    if (item.publicId) {
      try {
        const resourceType = item.type === 'video' ? 'video' : 'image'
        await deleteFromCloudinary(item.publicId, resourceType)
      } catch (cloudError) {
        console.error('Failed to delete asset from Cloudinary:', cloudError)
        // Proceed with DB deletion even if Cloudinary fails
      }
    }

    await prisma.galleryItem.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: item.type === 'image' ? 'DELETE_GALLERY_IMAGE' : 'DELETE_GALLERY_VIDEO',
        entity: 'GalleryItem',
        entityId: id,
        message: `Deleted gallery ${item.type}: ${item.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const data = await request.json()

    const item = await prisma.galleryItem.update({
      where: { id },
      data,
    })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'UPDATE',
        entity: 'GalleryItem',
        entityId: id,
        message: `Updated gallery item: ${item.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const item = await prisma.galleryItem.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
