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

    const comment = await prisma.serviceComment.update({
      where: { id },
      data: { status },
    })

    // Update comments count on corresponding Service model
    const totalApproved = await prisma.serviceComment.count({
      where: { serviceSlug: comment.serviceSlug, status: 'approved' },
    })
    await prisma.service.update({
      where: { slug: comment.serviceSlug },
      data: { comments: totalApproved },
    })

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'UPDATE',
      entity: 'COMMENT',
      entityId: comment.id,
      message: `Updated service comment status for "${comment.name}" (service: ${comment.serviceSlug}) to "${comment.status}"`,
      ipAddress,
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('API service comment patch error:', error)
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
    const comment = await prisma.serviceComment.delete({
      where: { id },
    })

    // Update comments count on corresponding Service model
    const totalApproved = await prisma.serviceComment.count({
      where: { serviceSlug: comment.serviceSlug, status: 'approved' },
    })
    await prisma.service.update({
      where: { slug: comment.serviceSlug },
      data: { comments: totalApproved },
    })

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'DELETE',
      entity: 'COMMENT',
      entityId: id,
      message: `Deleted service comment from "${comment.name}" (service: ${comment.serviceSlug})`,
      ipAddress,
    })

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('API service comment delete error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

