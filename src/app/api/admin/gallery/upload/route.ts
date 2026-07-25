import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, hasRole } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    
    // Parse fields
    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const category = formData.get('category') as string
    const altText = formData.get('altText') as string
    const isPublished = formData.get('isPublished') === 'true'
    const file = formData.get('file') as File | null

    if (!title || !type) {
      return NextResponse.json({ error: 'Title and Type are required' }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    
    if (type === 'image' && !validImageTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid image format. Allowed: JPG, PNG, WEBP' }, { status: 400 })
    }
    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid video format. Allowed: MP4, WEBM, MOV' }, { status: 400 })
    }

    // Convert file to buffer for Cloudinary stream
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary
    const resourceType = type === 'video' ? 'video' : 'image'
    let uploadResult: any;
    try {
      uploadResult = await uploadToCloudinary(buffer, 'tuvaa/gallery', resourceType)
    } catch (uploadErr: any) {
      console.error('Cloudinary Upload Error:', uploadErr)
      return NextResponse.json({ error: 'Upload failed', details: uploadErr.message }, { status: 500 })
    }

    try {
      // Save metadata in MySQL
      // @ts-ignore - Prisma types are stale until dev server is restarted and generated
      const savedItem = await prisma.galleryItem.create({
        data: {
          title,
          type,
          category,
          altText,
          isPublished,
          imageUrl: type === 'image' ? uploadResult.secure_url : null,
          videoUrl: type === 'video' ? uploadResult.secure_url : null,
          thumbnailUrl: type === 'video' ? uploadResult.secure_url.replace(/\.[^/.]+$/, ".jpg") : null,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
          sizeBytes: uploadResult.bytes,
          width: uploadResult.width,
          height: uploadResult.height,
          duration: uploadResult.duration,
        } as any
      })

      // Log Activity
      await prisma.activityLog.create({
        data: {
          userId: session!.id,
          action: type === 'image' ? 'UPLOAD_GALLERY_IMAGE' : 'UPLOAD_GALLERY_VIDEO',
          entity: 'GalleryItem',
          entityId: savedItem.id,
          message: `Uploaded gallery ${type}: ${title}`,
        }
      })

      return NextResponse.json({ success: true, item: savedItem }, { status: 201 })
    } catch (dbErr: any) {
      console.error('Database Save Error, rolling back Cloudinary:', dbErr)
      // Delete orphaned file
      try {
        const { deleteFromCloudinary } = await import('@/lib/cloudinary')
        await deleteFromCloudinary(uploadResult.public_id, resourceType)
      } catch (cleanupErr) {
        console.error('Failed to cleanup Cloudinary file:', cleanupErr)
      }
      return NextResponse.json({ error: 'Upload succeeded but database save failed. Please try again.', details: dbErr.message }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Gallery Upload Error:', error)
    return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 })
  }
}
