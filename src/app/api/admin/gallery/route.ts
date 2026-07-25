import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { logActivity } from '@/lib/activity-log'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const gallery = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(gallery)
  } catch (error: any) {
    console.error('API GET /api/admin/gallery error:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch gallery items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role === 'tester') {
    return NextResponse.json({ success: false, message: 'Read-only users cannot perform this action.' }, { status: 403 })
  }

  try {
    const data = await request.json()
    const {
      title,
      type,
      imageUrl,
      videoUrl,
      thumbnailUrl,
      publicId,
      category,
      altText,
      isPublished,
    } = data

    if (!title || !type) {
      return NextResponse.json({ success: false, message: 'Title and Type are required.' }, { status: 400 })
    }

    if (type === 'image' && !imageUrl) {
      return NextResponse.json({ success: false, message: 'Image URL is required for image type.' }, { status: 400 })
    }

    if (type === 'video' && !videoUrl && !imageUrl) {
      return NextResponse.json({ success: false, message: 'Video URL or Image URL is required.' }, { status: 400 })
    }

    const finalVideoUrl = type === 'video' ? videoUrl || imageUrl : null
    const finalImageUrl = type === 'image' ? imageUrl : null
    const finalThumbnailUrl = thumbnailUrl || (type === 'video' ? finalVideoUrl : finalImageUrl)

    const galleryItem = await prisma.galleryItem.create({
      data: {
        title: title.trim(),
        type,
        category: category || 'General',
        altText: altText || null,
        isPublished: isPublished !== undefined ? isPublished : true,
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbnailUrl,
        publicId: publicId ? publicId.trim() : null,
      },
    })

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'CREATE_GALLERY_EXTERNAL',
      entity: 'GALLERY',
      entityId: galleryItem.id,
      message: `Created gallery item from external URL: ${galleryItem.title}`,
      ipAddress,
    })

    return NextResponse.json({ success: true, item: galleryItem, message: 'Gallery item created successfully.' }, { status: 201 })
  } catch (error: any) {
    console.error('API POST /api/admin/gallery error:', error)
    return NextResponse.json({ success: false, message: 'Failed to create gallery item.' }, { status: 500 })
  }
}
