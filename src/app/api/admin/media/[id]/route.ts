import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession, hasRole } from '@/lib/auth'

const prisma = new PrismaClient()

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    let mediaItem = await prisma.mediaItem.findUnique({ where: { id } })
    
    if (mediaItem) {
      await prisma.mediaItem.delete({ where: { id } })

      await prisma.activityLog.create({
        data: {
          userId: session!.id,
          action: 'DELETE',
          entity: 'MediaItem',
          entityId: id,
          message: `Deleted media: ${mediaItem.title}`,
          ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
        }
      })
      return NextResponse.json({ success: true })
    }

    // If not in MediaItem, check if it's a Cloudinary GalleryItem
    const galleryItem: any = await prisma.galleryItem.findUnique({ where: { id } })
    if (galleryItem) {
      if (galleryItem.publicId) {
        try {
          const { deleteFromCloudinary } = await import('@/lib/cloudinary')
          const resourceType = galleryItem.type === 'video' ? 'video' : 'image'
          await deleteFromCloudinary(galleryItem.publicId, resourceType)
        } catch (e) {
          console.error('Failed to delete from Cloudinary:', e)
        }
      }

      await prisma.galleryItem.delete({ where: { id } })
      
      await prisma.activityLog.create({
        data: {
          userId: session!.id,
          action: galleryItem.type === 'image' ? 'DELETE_GALLERY_IMAGE' : 'DELETE_GALLERY_VIDEO',
          entity: 'GalleryItem',
          entityId: id,
          message: `Deleted gallery ${galleryItem.type}: ${galleryItem.title}`,
          ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
        }
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
