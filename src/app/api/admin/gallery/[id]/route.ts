import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/cloudinary'
import { logActivity } from '@/lib/activity-log'
import { Prisma } from '@prisma/client'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const item = await prisma.galleryItem.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ success: false, message: 'Gallery item not found.' }, { status: 404 })

    return NextResponse.json(item)
  } catch (error: any) {
    console.error('API GET /api/admin/gallery/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch gallery item.' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role === 'tester') {
    return NextResponse.json({ success: false, message: 'Read-only users cannot perform this action.' }, { status: 403 })
  }

  const { id } = await params

  try {
    const existingItem = await prisma.galleryItem.findUnique({ where: { id } })
    if (!existingItem) {
      return NextResponse.json({ success: false, message: 'Gallery item not found.' }, { status: 404 })
    }

    const contentType = request.headers.get('content-type') || ''
    let updateData: any = {}

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const title = formData.get('title') as string
      const type = formData.get('type') as string
      const category = formData.get('category') as string
      const altText = formData.get('altText') as string
      const isPublished = formData.get('isPublished') === 'true'
      const file = formData.get('file') as File | null

      updateData = {
        title: title || existingItem.title,
        type: type || existingItem.type,
        category: category || existingItem.category,
        altText: altText !== null ? altText : existingItem.altText,
        isPublished,
      }

      if (file && file.size > 0) {
        const targetType = updateData.type || existingItem.type
        const resourceType = targetType === 'video' ? 'video' : 'image'

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload new file to Cloudinary
        const uploadResult: any = await uploadToCloudinary(buffer, 'tuvaa/gallery', resourceType)

        // Delete old asset if publicId existed
        if (existingItem.publicId) {
          const oldResourceType = existingItem.type === 'video' ? 'video' : 'image'
          await deleteFromCloudinary(existingItem.publicId, oldResourceType).catch(() => {})
        }

        updateData.imageUrl = targetType === 'image' ? uploadResult.secure_url : null
        updateData.videoUrl = targetType === 'video' ? uploadResult.secure_url : null
        updateData.thumbnailUrl = targetType === 'video' ? uploadResult.secure_url.replace(/\.[^/.]+$/, '.jpg') : uploadResult.secure_url
        updateData.publicId = uploadResult.public_id
        updateData.format = uploadResult.format
        updateData.sizeBytes = uploadResult.bytes
        updateData.width = uploadResult.width
        updateData.height = uploadResult.height
        updateData.duration = uploadResult.duration
      }
    } else {
      updateData = await request.json()
    }

    const updatedItem = await prisma.galleryItem.update({
      where: { id },
      data: updateData,
    })

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'UPDATE_GALLERY',
      entity: 'GALLERY',
      entityId: id,
      message: `Updated gallery item: ${updatedItem.title}`,
      ipAddress,
    })

    return NextResponse.json({ success: true, item: updatedItem, message: 'Gallery item updated successfully.' })
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Gallery item not found.' }, { status: 404 })
    }
    console.error('API PATCH /api/admin/gallery/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update gallery item.' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role === 'tester') {
    return NextResponse.json({ success: false, message: 'Read-only users cannot perform this action.' }, { status: 403 })
  }

  const { id } = await params

  try {
    const item = await prisma.galleryItem.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ success: false, message: 'Gallery item not found.' }, { status: 404 })
    }

    // Delete from Cloudinary if publicId exists
    if (item.publicId) {
      const resourceType = item.type === 'video' ? 'video' : 'image'
      await deleteFromCloudinary(item.publicId, resourceType).catch((err) => {
        console.warn('Failed to delete asset from Cloudinary:', err)
      })
    }

    await prisma.galleryItem.delete({ where: { id } })

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: item.type === 'video' ? 'DELETE_GALLERY_VIDEO' : 'DELETE_GALLERY_IMAGE',
      entity: 'GALLERY',
      entityId: id,
      message: `Deleted gallery ${item.type}: ${item.title}`,
      ipAddress,
    })

    return NextResponse.json({ success: true, message: 'Gallery item deleted successfully.' })
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Gallery item not found.' }, { status: 404 })
    }
    console.error('API DELETE /api/admin/gallery/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete gallery item.' }, { status: 500 })
  }
}
