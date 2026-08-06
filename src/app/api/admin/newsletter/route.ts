import { NextResponse } from 'next/server'
import { getSession, hasRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(subscribers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 })
    }

    const subscriber = await prisma.newsletterSubscriber.delete({
      where: { id },
    })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'DELETE',
        entity: 'NewsletterSubscriber',
        entityId: subscriber.id,
        message: `Deleted newsletter subscriber: ${subscriber.email}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 })
  }
}
