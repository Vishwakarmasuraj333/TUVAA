import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { logActivity } from '@/lib/activity-log'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role === 'tester') {
    return NextResponse.json({ message: 'Forbidden: Tester has read-only access' }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const { status } = body

    const app = await prisma.africanGroupApplication.update({
      where: { id },
      data: { status },
    })

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'UPDATE',
      entity: 'COMMUNITY_GROUP_APPLICATION',
      entityId: app.id,
      message: `Updated community group application status for "${app.fullName}" to "${app.status}"`,
      ipAddress,
    })

    return NextResponse.json(app)
  } catch (error) {
    console.error('API community group application patch error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role === 'tester') {
    return NextResponse.json({ message: 'Forbidden: Tester has read-only access' }, { status: 403 })
  }

  const { id } = await params

  try {
    const app = await prisma.africanGroupApplication.findUnique({ where: { id } })
    if (!app) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 })
    }

    await prisma.africanGroupApplication.delete({
      where: { id },
    })

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'DELETE',
      entity: 'COMMUNITY_GROUP_APPLICATION',
      entityId: id,
      message: `Deleted community group application of: "${app.fullName}" (group: "${app.communityGroupName}")`,
      ipAddress,
    })

    return NextResponse.json({ message: 'Application deleted successfully' })
  } catch (error) {
    console.error('API community group application delete error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

