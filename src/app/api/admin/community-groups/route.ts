import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const apps = await prisma.africanGroupApplication.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(apps)
  } catch (error) {
    console.error('API community groups GET error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (session.role === 'tester') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  try {
    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })

    const updated = await prisma.africanGroupApplication.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('API community groups PATCH error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (session.role === 'tester') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 })

    await prisma.africanGroupApplication.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API community groups DELETE error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}
