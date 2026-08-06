import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''

    if (query.trim().length < 2) {
      return NextResponse.json([])
    }

    const q = query.trim()

    // Query across all entity models in parallel
    const [
      newsPosts,
      directoryListings,
      services,
      projects,
      events,
      gallery,
      donations,
      subscribers,
      messages,
      groups,
      registrations,
      serviceComments,
      monthlyDonations,
      users,
    ] = await Promise.all([
      // 1. News Posts
      prisma.newsPost.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
            { content: { contains: q } },
            { category: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, title: true, category: true },
      }),
      // 2. Directory Listings (Artists, Musicians, Businesses, Professionals, Community Groups)
      prisma.directoryListing.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
            { type: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, title: true, type: true, category: true },
      }),
      // 3. Services
      prisma.service.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, title: true, slug: true },
      }),
      // 4. Projects
      prisma.project.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, title: true },
      }),
      // 5. Events
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
            { location: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, title: true },
      }),
      // 6. Gallery Items
      prisma.galleryItem.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { category: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, title: true, category: true },
      }),
      // 7. Donations
      prisma.donation.findMany({
        where: {
          OR: [
            { fullName: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, fullName: true, amount: true },
      }),
      // 8. Newsletter Subscribers
      prisma.newsletterSubscriber.findMany({
        where: {
          email: { contains: q },
        },
        take: 3,
        select: { id: true, email: true },
      }),
      // 9. Contact Messages
      prisma.contactMessage.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { subject: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, name: true, subject: true },
      }),
      // 10. Community Group Applications
      prisma.africanGroupApplication.findMany({
        where: {
          OR: [
            { fullName: { contains: q } },
            { communityGroupName: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, fullName: true, communityGroupName: true },
      }),
      // 11. Event Registrations
      prisma.eventRegistration.findMany({
        where: {
          OR: [
            { fullName: { contains: q } },
            { email: { contains: q } },
            { eventSlug: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, fullName: true, eventSlug: true },
      }),
      // 12. Service Comments
      prisma.serviceComment.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { comment: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, name: true, serviceSlug: true },
      }),
      // 13. Monthly Donations
      prisma.monthlyDonation.findMany({
        where: {
          OR: [
            { fullName: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, fullName: true, amount: true },
      }),
      // 14. Users
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: 3,
        select: { id: true, name: true, email: true },
      }),
    ])

    const results: any[] = []

    newsPosts.forEach((n) => {
      results.push({
        id: n.id,
        type: `News (${n.category || 'General'})`,
        title: n.title,
        link: `/admin/news`,
      })
    })

    directoryListings.forEach((d) => {
      results.push({
        id: d.id,
        type: `Directory (${d.type})`,
        title: d.title,
        link: `/admin/bbam-directory`,
      })
    })

    services.forEach((s) => {
      results.push({
        id: s.id,
        type: 'Service',
        title: s.title,
        link: `/admin/services`,
      })
    })

    projects.forEach((p) => {
      results.push({
        id: p.id,
        type: 'Project',
        title: p.title,
        link: `/admin/projects`,
      })
    })

    events.forEach((e) => {
      results.push({
        id: e.id,
        type: 'Event',
        title: e.title,
        link: `/admin/events`,
      })
    })

    gallery.forEach((g) => {
      results.push({
        id: g.id,
        type: `Gallery (${g.category || 'General'})`,
        title: g.title,
        link: `/admin/gallery`,
      })
    })

    donations.forEach((d) => {
      results.push({
        id: d.id,
        type: 'Donation',
        title: `${d.fullName} (£${d.amount})`,
        link: `/admin/donations`,
      })
    })

    subscribers.forEach((ns) => {
      results.push({
        id: ns.id,
        type: 'Newsletter',
        title: ns.email,
        link: `/admin/newsletter`,
      })
    })

    messages.forEach((m) => {
      results.push({
        id: m.id,
        type: 'Contact Message',
        title: `${m.name}: ${m.subject || 'Inquiry'}`,
        link: `/admin/contact-messages`,
      })
    })

    groups.forEach((g) => {
      results.push({
        id: g.id,
        type: 'Community Group App',
        title: `${g.fullName} (${g.communityGroupName})`,
        link: `/admin/community-groups`,
      })
    })

    registrations.forEach((r) => {
      results.push({
        id: r.id,
        type: 'Event Registration',
        title: `${r.fullName} (${r.eventSlug})`,
        link: `/admin/event-registrations`,
      })
    })

    serviceComments.forEach((c) => {
      results.push({
        id: c.id,
        type: 'Comment',
        title: `${c.name} on ${c.serviceSlug}`,
        link: `/admin/service-comments`,
      })
    })

    monthlyDonations.forEach((md) => {
      results.push({
        id: md.id,
        type: 'Monthly Donation',
        title: `${md.fullName} (£${md.amount}/mo)`,
        link: `/admin/monthly-donations`,
      })
    })

    if (session.role === 'super_admin') {
      users.forEach((u) => {
        results.push({
          id: u.id,
          type: 'Admin User',
          title: `${u.name} (${u.email})`,
          link: `/admin/users`,
        })
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('API search error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}


