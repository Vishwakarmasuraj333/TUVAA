import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession, hasRole } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
      }
    })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()
    const { title, slug, excerpt, content, image, isPublished } = data

    if (!title || !slug || !excerpt || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        isPublished: isPublished ?? true,
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'CREATE',
        entity: 'Service',
        entityId: service.id,
        message: `Created service: ${service.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    revalidatePath('/')
    revalidatePath('/our-services')
    if (service.slug) revalidatePath(`/services/${service.slug}`)

    return NextResponse.json(service, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 })
    }

    const service = await prisma.service.findUnique({ where: { id } })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    await prisma.serviceComment.deleteMany({ where: { serviceSlug: service.slug } })
    await prisma.service.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'DELETE',
        entity: 'Service',
        entityId: id,
        message: `Deleted service: ${service.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    revalidatePath('/')
    revalidatePath('/our-services')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete service error:', error)
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 })
  }
}

