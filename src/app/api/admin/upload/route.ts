import { NextResponse } from 'next/server'
import { getSession, hasRole } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to upload images' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = (formData.get('file') || formData.get('image')) as File | null

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    // Convert file to buffer for Cloudinary stream
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary under tuvaa/uploads folder
    const uploadResult: any = await uploadToCloudinary(buffer, 'tuvaa/uploads', 'image')

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    })
  } catch (error: any) {
    console.error('Cloudinary direct upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload to Cloudinary', details: error.message },
      { status: 500 }
    )
  }
}
