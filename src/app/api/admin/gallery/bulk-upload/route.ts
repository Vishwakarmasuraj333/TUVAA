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
    const files = formData.getAll('files') as File[]
    const metadataStr = formData.get('metadata') as string
    
    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No files selected for upload.' }, { status: 400 })
    }

    let itemsData: Array<{
      title: string
      type: string
      category?: string
      altText?: string
      isPublished?: boolean
    }> = []

    if (metadataStr) {
      try {
        itemsData = JSON.parse(metadataStr)
      } catch (e) {
        console.warn('Failed to parse metadata string:', e)
      }
    }

    const uploadedItems = []
    const failedItems = []

    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const meta = itemsData[i] || {}

      // Auto-detect type if not provided
      const detectedType = meta.type || (file.type.startsWith('video/') ? 'video' : 'image')
      
      // Generate clean title from file name if missing
      const autoTitle = meta.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      const category = meta.category || 'General'
      const altText = meta.altText || ''
      const isPublished = meta.isPublished !== undefined ? meta.isPublished : true

      // File type check
      if (detectedType === 'image' && !validImageTypes.includes(file.type)) {
        failedItems.push({ file: file.name, reason: 'Invalid image format. Allowed: JPG, PNG, WEBP' })
        continue
      }
      if (detectedType === 'video' && !validVideoTypes.includes(file.type)) {
        failedItems.push({ file: file.name, reason: 'Invalid video format. Allowed: MP4, WEBM, MOV' })
        continue
      }

      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const resourceType = detectedType === 'video' ? 'video' : 'image'

        const uploadResult: any = await uploadToCloudinary(buffer, 'tuvaa/gallery', resourceType)

        try {
          const savedItem = await prisma.galleryItem.create({
            data: {
              title: autoTitle,
              type: detectedType,
              category,
              altText,
              isPublished,
              imageUrl: detectedType === 'image' ? uploadResult.secure_url : null,
              videoUrl: detectedType === 'video' ? uploadResult.secure_url : null,
              thumbnailUrl: detectedType === 'video' ? uploadResult.secure_url.replace(/\.[^/.]+$/, '.jpg') : uploadResult.secure_url,
              publicId: uploadResult.public_id,
              format: uploadResult.format,
              sizeBytes: uploadResult.bytes,
              width: uploadResult.width,
              height: uploadResult.height,
              duration: uploadResult.duration,
            },
          })

          uploadedItems.push(savedItem)
        } catch (dbErr: any) {
          console.error(`Database save error for ${file.name}, deleting Cloudinary asset:`, dbErr)
          await deleteFromCloudinary(uploadResult.public_id, resourceType).catch(() => {})
          failedItems.push({ file: file.name, reason: 'Database save failed.' })
        }
      } catch (uploadErr: any) {
        console.error(`Cloudinary upload error for ${file.name}:`, uploadErr)
        failedItems.push({ file: file.name, reason: uploadErr.message || 'Upload failed.' })
      }
    }

    if (uploadedItems.length > 0) {
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
      await logActivity({
        userId: session.id,
        action: 'BULK_UPLOAD_GALLERY',
        entity: 'GALLERY',
        entityId: uploadedItems[0].id,
        message: `Bulk uploaded ${uploadedItems.length} gallery items (${failedItems.length} failed)`,
        ipAddress,
      })
    }

    const total = files.length
    const successCount = uploadedItems.length
    const failedCount = failedItems.length

    let message = ''
    if (successCount === total) {
      message = 'Gallery items uploaded successfully.'
    } else if (successCount > 0) {
      message = `${successCount} uploaded, ${failedCount} failed. Please review failed items.`
    } else {
      message = 'Failed to upload gallery items. Please check file formats and server connectivity.'
    }

    return NextResponse.json({
      success: successCount > 0,
      uploadedCount: successCount,
      failedCount,
      uploadedItems,
      failedItems,
      message,
    })
  } catch (error: any) {
    console.error('Bulk upload route error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Bulk upload failed.' }, { status: 500 })
  }
}
