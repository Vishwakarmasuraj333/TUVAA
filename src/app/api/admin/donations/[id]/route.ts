import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession, hasRole } from '@/lib/auth'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const donation = await prisma.donation.findUnique({ where: { id } })
    if (!donation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.donation.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'DELETE',
        entity: 'Donation',
        entityId: id,
        message: `Deleted donation from: ${donation.fullName}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const data = await request.json()

    // If status changes to confirmed, update campaign
    if (data.status === 'confirmed') {
      const oldDonation = await prisma.donation.findUnique({ where: { id } })
      if (oldDonation && oldDonation.status !== 'confirmed') {
        await prisma.donationCampaign.update({
          where: { slug: oldDonation.campaignSlug },
          data: {
            raisedAmount: { increment: oldDonation.amount },
            donationCount: { increment: 1 }
          }
        })
      }
    }

    const donation = await prisma.donation.update({
      where: { id },
      data,
    })

    revalidatePath('/')
    revalidatePath('/donate')

    return NextResponse.json(donation)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
