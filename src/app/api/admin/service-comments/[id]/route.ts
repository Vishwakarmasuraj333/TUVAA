import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { logActivity } from '@/lib/activity-log'
import { Prisma } from '@prisma/client'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role === 'tester') {
    return NextResponse.json({ success: false, message: 'Read-only users cannot perform this action.' }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const { status } = body

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 })
    }

    const comment = await prisma.serviceComment.update({
      where: { id },
      data: { status },
    })

    // Safely update Service comments count if service exists in DB
    try {
      const existingService = await prisma.service.findUnique({
        where: { slug: comment.serviceSlug },
      })
      if (existingService) {
        const totalApproved = await prisma.serviceComment.count({
          where: { serviceSlug: comment.serviceSlug, status: 'approved' },
        })
        await prisma.service.update({
          where: { slug: comment.serviceSlug },
          data: { comments: totalApproved },
        })
      }
    } catch (serviceErr) {
      console.warn('Service record update skipped:', serviceErr)
    }

    const action = status === 'approved' ? 'APPROVE_COMMENT' : status === 'rejected' ? 'REJECT_COMMENT' : 'UPDATE_COMMENT'
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action,
      entity: 'COMMENT',
      entityId: comment.id,
      message: `${status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Updated'} service comment by "${comment.name}" for service: "${comment.serviceSlug}"`,
      ipAddress,
    })

    return NextResponse.json({ success: true, message: `Comment ${status} successfully.`, comment })
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Comment not found.' }, { status: 404 })
    }
    console.error('API service comment patch error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update comment status.' }, { status: 500 })
  }
}

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
    const comment = await prisma.serviceComment.delete({
      where: { id },
    })

    // Safely update Service comments count if service exists in DB
    try {
      const existingService = await prisma.service.findUnique({
        where: { slug: comment.serviceSlug },
      })
      if (existingService) {
        const totalApproved = await prisma.serviceComment.count({
          where: { serviceSlug: comment.serviceSlug, status: 'approved' },
        })
        await prisma.service.update({
          where: { slug: comment.serviceSlug },
          data: { comments: totalApproved },
        })
      }
    } catch (serviceErr) {
      console.warn('Service record update skipped on delete:', serviceErr)
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'DELETE_COMMENT',
      entity: 'COMMENT',
      entityId: id,
      message: `Deleted service comment from "${comment.name}" (service: ${comment.serviceSlug})`,
      ipAddress,
    })

    return NextResponse.json({ success: true, message: 'Comment deleted successfully.' })
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Comment not found.' }, { status: 404 })
    }
    console.error('API service comment delete error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete comment.' }, { status: 500 })
  }
}
