import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { logActivity } from '@/lib/activity-log'

export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role === 'tester') {
    return NextResponse.json({ success: false, message: 'Read-only users cannot perform this action.' }, { status: 403 })
  }

  try {
    const { ids, isPublished } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0 || typeof isPublished !== 'boolean') {
      return NextResponse.json({ success: false, message: 'Invalid payload. IDs and isPublished boolean required.' }, { status: 400 })
    }

    const updateResult = await prisma.galleryItem.updateMany({
      where: { id: { in: ids } },
      data: { isPublished },
    })

    const action = isPublished ? 'PUBLISH_GALLERY' : 'UNPUBLISH_GALLERY'
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action,
      entity: 'GALLERY',
      entityId: ids[0],
      message: `${isPublished ? 'Published' : 'Unpublished'} ${updateResult.count} gallery items`,
      ipAddress,
    })

    return NextResponse.json({
      success: true,
      count: updateResult.count,
      message: `${updateResult.count} gallery items ${isPublished ? 'published' : 'unpublished'} successfully.`,
    })
  } catch (error: any) {
    console.error('Bulk publish update error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update publish status for gallery items.' }, { status: 500 })
  }
}
