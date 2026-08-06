import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession, hasRole } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const listings = await prisma.directoryListing.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(listings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch directory listings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()
    const { type, title, slug, description, image, category, isPublished, order } = data

    if (!type || !title || !slug || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const listing = await prisma.directoryListing.create({
      data: {
        type,
        title,
        slug,
        description,
        image,
        category,
        isPublished: isPublished ?? true,
        order: order ? parseInt(order) : 0,
      }
    })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'CREATE',
        entity: 'DirectoryListing',
        entityId: listing.id,
        message: `Created BBAM directory listing: ${listing.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    revalidatePath('/')
    revalidatePath('/bbam-2')
    revalidatePath('/artist')
    revalidatePath('/musicians')
    revalidatePath('/businesses')
    revalidatePath('/skills-professionals')
    revalidatePath('/community-groups')

    return NextResponse.json(listing, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

