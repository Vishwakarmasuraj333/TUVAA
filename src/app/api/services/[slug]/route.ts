import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { serviceSchema } from '@/lib/validations/service'

interface RouteContext {
  params: Promise<{
    slug: string
  }>
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { slug } = await params
    const service = await prisma.service.findUnique({
      where: { slug },
    })

    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json(service, { status: 200 })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if (session.role === 'tester') {
      return NextResponse.json({ message: 'Forbidden: Tester has read-only access' }, { status: 403 })
    }

    const { slug: currentSlug } = await params
    const body = await req.json()
    const parsed = serviceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload data', errors: parsed.error.format() },
        { status: 400 }
      )
    }

    const { title, slug: newSlug, excerpt, content, image, publishedAt, comments, isPublished } = parsed.data

    const currentService = await prisma.service.findUnique({
      where: { slug: currentSlug },
    })
    if (!currentService) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 })
    }

    if (newSlug !== currentSlug) {
      const collision = await prisma.service.findUnique({
        where: { slug: newSlug },
      })
      if (collision) {
        return NextResponse.json({ message: 'Slug already taken by another service' }, { status: 409 })
      }
    }

    const updated = await prisma.service.update({
      where: { slug: currentSlug },
      data: {
        title,
        slug: newSlug,
        excerpt,
        content: content || '',
        image,
        publishedAt,
        comments,
        isPublished,
      },
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if (session.role === 'tester') {
      return NextResponse.json({ message: 'Forbidden: Tester has read-only access' }, { status: 403 })
    }

    const { slug } = await params

    const currentService = await prisma.service.findUnique({
      where: { slug },
    })
    if (!currentService) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 })
    }

    await prisma.service.delete({
      where: { slug },
    })

    return NextResponse.json({ message: 'Service deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
