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
    const { ids, category } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !category) {
      return NextResponse.json({ success: false, message: 'Invalid payload. IDs and Category are required.' }, { status: 400 })
    }

    const updateResult = await prisma.galleryItem.updateMany({
      where: { id: { in: ids } },
      data: { category },
    })

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'CHANGE_GALLERY_CATEGORY',
      entity: 'GALLERY',
      entityId: ids[0],
      message: `Changed category for ${updateResult.count} gallery items to "${category}"`,
      ipAddress,
    })

    return NextResponse.json({
      success: true,
      count: updateResult.count,
      message: `Category updated for ${updateResult.count} gallery items.`,
    })
  } catch (error: any) {
    console.error('Bulk category update error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update category for gallery items.' }, { status: 500 })
  }
}
