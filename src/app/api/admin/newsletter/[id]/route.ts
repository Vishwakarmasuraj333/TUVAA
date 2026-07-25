import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession, hasRole } from '@/lib/auth'

const prisma = new PrismaClient()

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { id } })
    if (!subscriber) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.newsletterSubscriber.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'DELETE',
        entity: 'NewsletterSubscriber',
        entityId: id,
        message: `Deleted newsletter subscriber: ${subscriber.email}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
