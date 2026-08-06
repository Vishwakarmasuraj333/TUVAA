import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const registrations = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: { title: true }
        }
      }
    })
    return NextResponse.json(registrations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event registrations' }, { status: 500 })
  }
}
