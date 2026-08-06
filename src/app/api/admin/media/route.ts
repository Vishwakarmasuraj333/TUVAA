import { NextResponse } from 'next/server'
import { getSession, hasRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const media = await prisma.mediaItem.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Fetch Cloudinary gallery items
    const galleryItems = await prisma.galleryItem.findMany({
      where: { publicId: { not: null } },
      orderBy: { createdAt: 'desc' },
    })

    const merged = [
      ...media.map(m => ({ ...m, source: 'media' })),
      ...galleryItems.map((g: any) => ({
        id: g.id,
        title: g.title + ' (Gallery)',
        url: g.imageUrl || g.videoUrl || '',
        type: g.type,
        createdAt: g.createdAt,
        publicId: g.publicId,
        sizeBytes: g.sizeBytes,
        format: g.format,
        source: 'gallery'
      }))
    ]

    // Sort combined array by createdAt desc
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(merged)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const file = formData.get('file') as File | null

    if (!title || !type) {
      return NextResponse.json({ error: 'Missing title or type' }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ error: 'Missing file for upload' }, { status: 400 })
    }

    // Convert file to buffer for Cloudinary stream
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary
    const { uploadToCloudinary } = await import('@/lib/cloudinary')
    const resourceType = type === 'video' ? 'video' : 'image'
    
    let uploadResult: any;
    try {
      uploadResult = await uploadToCloudinary(buffer, 'tuvaa/media', resourceType)
    } catch (uploadErr: any) {
      console.error('Cloudinary Upload Error:', uploadErr)
      return NextResponse.json({ error: 'Upload failed', details: uploadErr.message }, { status: 500 })
    }

    const mediaItem = await prisma.mediaItem.create({
      data: {
        title,
        url: uploadResult.secure_url,
        type,
      }
    })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'CREATE',
        entity: 'MediaItem',
        entityId: mediaItem.id,
        message: `Uploaded media: ${mediaItem.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json(mediaItem, { status: 201 })
  } catch (error: any) {
    console.error('Media Upload Error:', error)
    if (error.code === 'P2002') return NextResponse.json({ error: 'URL already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

