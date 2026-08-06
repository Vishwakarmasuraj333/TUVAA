import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession, hasRole } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        date: true,
        status: true,
        isPublished: true,
        createdAt: true,
      }
    })
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()
    const { id, title, slug, excerpt, content, description, image, date, location, venue, status, isPublished, ...rest } = data

    if (!title || !date) {
      return NextResponse.json({ error: 'Missing required title or date' }, { status: 400 })
    }

    const generatedSlug = slug || title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
    const finalExcerpt = excerpt || description || title
    const finalContent = content || description || title
    const finalLocation = location || venue || 'Southampton'

    let event: any

    if (id) {
      // Update existing event
      event = await prisma.event.update({
        where: { id },
        data: {
          title,
          slug: generatedSlug,
          excerpt: finalExcerpt,
          content: finalContent,
          image: image || null,
          date: new Date(date),
          location: finalLocation,
          venue: venue || finalLocation,
          status: status || 'upcoming',
          isPublished: isPublished ?? true,
          ...rest,
        }
      })
    } else {
      // Create new event
      event = await prisma.event.create({
        data: {
          title,
          slug: generatedSlug,
          excerpt: finalExcerpt,
          content: finalContent,
          image: image || null,
          date: new Date(date),
          location: finalLocation,
          venue: venue || finalLocation,
          status: status || 'upcoming',
          isPublished: isPublished ?? true,
          ...rest,
        }
      })
    }

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: id ? 'UPDATE' : 'CREATE',
        entity: 'Event',
        entityId: event.id,
        message: `${id ? 'Updated' : 'Created'} event: ${event.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    revalidatePath('/')
    revalidatePath('/our-events')
    if (event.slug) revalidatePath(`/our-events/${event.slug}`)

    return NextResponse.json(event, { status: id ? 200 : 201 })
  } catch (error: any) {
    console.error('Save Event Error:', error)
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing event ID' }, { status: 400 })
    }

    await prisma.event.delete({ where: { id } })

    revalidatePath('/')
    revalidatePath('/our-events')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Event Error:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}

