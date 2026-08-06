import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
