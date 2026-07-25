import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { logActivity } from '@/lib/activity-log'
import { Prisma } from '@prisma/client'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role === 'tester') {
    return NextResponse.json({ success: false, message: 'Read-only users cannot perform this action.' }, { status: 403 })
  }

  const { id } = await params

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id },
    })

    if (!subscriber) {
      return NextResponse.json({ success: false, message: 'Subscriber not found.' }, { status: 404 })
    }

    await prisma.newsletterSubscriber.delete({
      where: { id },
    })

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'DELETE_NEWSLETTER_SUBSCRIBER',
      entity: 'NEWSLETTER',
      entityId: id,
      message: `Deleted newsletter subscriber: ${subscriber.email}`,
      ipAddress,
    })

    return NextResponse.json({ success: true, message: 'Subscriber deleted successfully.' })
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Subscriber not found.' }, { status: 404 })
    }
    console.error('API newsletter delete error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete subscriber.' }, { status: 500 })
  }
}
