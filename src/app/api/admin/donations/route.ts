import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        campaign: {
          select: { title: true }
        }
      }
    })

    const campaigns = await prisma.donationCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ campaigns, donations })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }
}
