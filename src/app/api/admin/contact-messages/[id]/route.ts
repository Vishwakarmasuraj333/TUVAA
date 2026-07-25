import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

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

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('API contact message patch error:', error)
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
    await prisma.contactMessage.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('API contact message delete error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}
