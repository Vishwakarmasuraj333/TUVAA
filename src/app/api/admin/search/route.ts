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

    // Query in parallel
    const [
      services,
      projects,
      events,
      gallery,
      donations,
      subscribers,
      messages,
      groups,
      users,
    ] = await Promise.all([
      // 1. Services
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
      // 2. Projects
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
      // 3. Events
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
      // 4. Gallery Items
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
      // 5. Donations
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
      // 6. Newsletter Subscribers
      prisma.newsletterSubscriber.findMany({
        where: {
          email: { contains: q },
        },
        take: 3,
        select: { id: true, email: true },
      }),
      // 7. Contact Messages
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
      // 8. Community Group Applications
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
      // 9. Users
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

    services.forEach((s) => {
      results.push({
        id: s.id,
        type: 'Service',
        title: s.title,
        link: `/admin/services/${s.id}/edit`,
      })
    })

    projects.forEach((p) => {
      results.push({
        id: p.id,
        type: 'Project',
        title: p.title,
        link: `/admin/projects/${p.id}/edit`,
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
        title: `${m.name}: ${m.subject}`,
        link: `/admin/contact-messages`,
      })
    })

    groups.forEach((g) => {
      results.push({
        id: g.id,
        type: 'Community Group',
        title: `${g.fullName} (${g.communityGroupName})`,
        link: `/admin/community-groups`,
      })
    })

    // Super Admin only can see user search results
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

