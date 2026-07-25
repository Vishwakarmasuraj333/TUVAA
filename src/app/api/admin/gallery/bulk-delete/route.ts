import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { deleteFromCloudinary } from '@/lib/cloudinary'
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
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No gallery item IDs provided.' }, { status: 400 })
    }

    const items = await prisma.galleryItem.findMany({
      where: { id: { in: ids } },
    })

    if (items.length === 0) {
      return NextResponse.json({ success: false, message: 'No matching gallery items found.' }, { status: 404 })
    }

    // Delete Cloudinary assets where publicId exists
    for (const item of items) {
      if (item.publicId) {
        const resourceType = item.type === 'video' ? 'video' : 'image'
        await deleteFromCloudinary(item.publicId, resourceType).catch((err) => {
          console.warn(`Failed to delete Cloudinary asset ${item.publicId}:`, err)
        })
      }
    }

    // Delete records from MySQL
    const deleteResult = await prisma.galleryItem.deleteMany({
      where: { id: { in: ids } },
    })

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'BULK_DELETE_GALLERY',
      entity: 'GALLERY',
      entityId: ids[0],
      message: `Deleted ${deleteResult.count} gallery items`,
      ipAddress,
    })

    return NextResponse.json({
      success: true,
      count: deleteResult.count,
      message: `${deleteResult.count} gallery items deleted successfully.`,
    })
  } catch (error: any) {
    console.error('Bulk delete gallery error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete gallery items.' }, { status: 500 })
  }
}
