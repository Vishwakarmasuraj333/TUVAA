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

    const application = await prisma.africanGroupApplication.findUnique({ where: { id } })
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.africanGroupApplication.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'DELETE',
        entity: 'AfricanGroupApplication',
        entityId: id,
        message: `Deleted group application from: ${application.fullName}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const data = await request.json()

    const application = await prisma.africanGroupApplication.update({
      where: { id },
      data,
    })

    return NextResponse.json(application)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
