import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession, hasRole } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const campaigns = await prisma.donationCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        goalAmount: true,
        raisedAmount: true,
        donationCount: true,
        isPublished: true,
        createdAt: true,
      }
    })
    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()
    const { title, slug, description, image, goalAmount, isPublished } = data

    if (!title || !slug || !description || !image || !goalAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const campaign = await prisma.donationCampaign.create({
      data: {
        title,
        slug,
        description,
        image,
        goalAmount: parseFloat(goalAmount),
        isPublished: isPublished ?? true,
      }
    })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'CREATE',
        entity: 'DonationCampaign',
        entityId: campaign.id,
        message: `Created donation campaign: ${campaign.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
