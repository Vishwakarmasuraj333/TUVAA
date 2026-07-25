import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'
import { logActivity } from '@/lib/activity-log'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role === 'tester') {
    return NextResponse.json({ success: false, message: 'Read-only users cannot perform this action.' }, { status: 403 })
  }

  try {
    const formData = await request.formData()

    const title = (formData.get('title') as string) || ''
    const type = (formData.get('type') as string) || 'image'
    const category = (formData.get('category') as string) || 'General'
    const altText = (formData.get('altText') as string) || ''
    const isPublished = formData.get('isPublished') === 'true'
    const file = formData.get('file') as File | null

    if (!title) {
      return NextResponse.json({ success: false, message: 'Item title is required.' }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ success: false, message: 'File is required for upload.' }, { status: 400 })
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']

    if (type === 'image' && !validImageTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Invalid image format. Allowed: JPG, PNG, WEBP' }, { status: 400 })
    }
    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Invalid video format. Allowed: MP4, WEBM, MOV' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const resourceType = type === 'video' ? 'video' : 'image'

    let uploadResult: any
    try {
      uploadResult = await uploadToCloudinary(buffer, 'tuvaa/gallery', resourceType)
    } catch (uploadErr: any) {
      console.error('Cloudinary Upload Error:', uploadErr)
      return NextResponse.json(
        {
          success: false,
          message: uploadErr.message || 'Cloudinary upload failed. Check environment variables.',
        },
        { status: 500 }
      )
    }

    try {
      const savedItem = await prisma.galleryItem.create({
        data: {
          title: title.trim(),
          type,
          category: category || 'General',
          altText: altText.trim() || null,
          isPublished,
          imageUrl: type === 'image' ? uploadResult.secure_url : null,
          videoUrl: type === 'video' ? uploadResult.secure_url : null,
          thumbnailUrl: type === 'video' ? uploadResult.secure_url.replace(/\.[^/.]+$/, '.jpg') : uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
          sizeBytes: uploadResult.bytes,
          width: uploadResult.width,
          height: uploadResult.height,
          duration: uploadResult.duration,
        },
      })

      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
      await logActivity({
        userId: session.id,
        action: type === 'video' ? 'UPLOAD_GALLERY_VIDEO' : 'UPLOAD_GALLERY_IMAGE',
        entity: 'GALLERY',
        entityId: savedItem.id,
        message: `Uploaded gallery ${type}: ${title}`,
        ipAddress,
      })

      return NextResponse.json({ success: true, item: savedItem, message: 'Gallery item uploaded successfully.' }, { status: 201 })
    } catch (dbErr: any) {
      console.error('Database Save Error, rolling back Cloudinary asset:', dbErr)
      await deleteFromCloudinary(uploadResult.public_id, resourceType).catch(() => {})
      return NextResponse.json(
        { success: false, message: 'Upload succeeded but database save failed. Please try again.' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Gallery Upload Route Error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Upload failed.' }, { status: 500 })
  }
}
