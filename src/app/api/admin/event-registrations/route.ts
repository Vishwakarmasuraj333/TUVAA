import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

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
