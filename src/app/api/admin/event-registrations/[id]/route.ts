import { NextResponse } from 'next/server'
import { getSession, hasRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const registration = await prisma.eventRegistration.findUnique({ where: { id } })
    if (!registration) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.eventRegistration.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'DELETE',
        entity: 'EventRegistration',
        entityId: id,
        message: `Deleted event registration from: ${registration.fullName}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
