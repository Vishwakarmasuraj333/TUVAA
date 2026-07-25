import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const md = await prisma.monthlyDonation.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(md)
  } catch (error) {
    console.error('API monthly donations error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}
