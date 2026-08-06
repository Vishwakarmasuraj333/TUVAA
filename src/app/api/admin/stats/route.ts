import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      services,
      projects,
      events,
      gallery,
      campaigns,
      messages,
      subscribers,
      groupApps,
      registrations,
      pendingComments,
      totalDonationsAgg,
      totalMonthlyDonationsAgg,
      recentDonations,
      recentSubscribers,
      recentMessages,
      recentGroupApps,
      recentRegistrations
    ] = await Promise.all([
      prisma.service.count(),
      prisma.project.count(),
      prisma.event.count(),
      prisma.galleryItem.count(),
      prisma.donationCampaign.count(),
      prisma.contactMessage.count(),
      prisma.newsletterSubscriber.count(),
      prisma.africanGroupApplication.count(),
      prisma.eventRegistration.count(),
      prisma.serviceComment.count({ where: { status: 'pending' } }),
      
      // Total Donations (completed/pending)
      prisma.donation.aggregate({
        _sum: { amount: true },
        _count: { id: true }
      }),

      // Total Monthly Donations
      prisma.monthlyDonation.aggregate({
        _sum: { amount: true }
      }),

      // Recent Activity Queries
      prisma.donation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, fullName: true, amount: true, campaignTitle: true, createdAt: true }
      }),
      prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, email: true, createdAt: true }
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, subject: true, createdAt: true }
      }),
      prisma.africanGroupApplication.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, fullName: true, communityGroupName: true, status: true, createdAt: true }
      }),
      prisma.eventRegistration.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { 
          id: true, 
          fullName: true, 
          eventSlug: true, 
          createdAt: true,
          event: { select: { title: true } }
        }
      })
    ])

    return NextResponse.json({
      services,
      projects,
      events,
      gallery,
      campaigns,
      messages,
      subscribers,
      groupApps,
      registrations,
      pendingComments,
      totalDonations: totalDonationsAgg._sum.amount || 0,
      donationCount: totalDonationsAgg._count.id || 0,
      totalMonthlyDonations: totalMonthlyDonationsAgg._sum.amount || 0,
      recentDonations,
      recentSubscribers,
      recentMessages,
      recentGroupApps,
      recentRegistrations
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
