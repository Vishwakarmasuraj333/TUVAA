import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const applications = await prisma.africanGroupApplication.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}
