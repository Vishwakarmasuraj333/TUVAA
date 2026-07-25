import { NextResponse } from 'next/server'
import { prisma, isDbAvailable } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { serviceSchema } from '@/lib/validations/service'
import { getAllServices } from '@/lib/services'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? parseInt(limitParam, 10) : undefined

  if (await isDbAvailable()) {
    try {
      const services = await prisma.service.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        ...(limit && !isNaN(limit) ? { take: limit } : {}),
      })
      return NextResponse.json({ services }, { status: 200 })
    } catch (error) {
      // Fall through to fallback
    }
  }

  const allFallback = await getAllServices()
  const services = limit && !isNaN(limit) ? allFallback.slice(0, limit) : allFallback
  return NextResponse.json({ services }, { status: 200 })
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if (session.role === 'tester') {
      return NextResponse.json({ message: 'Forbidden: Tester has read-only access' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = serviceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid payload data', errors: parsed.error.format() },
        { status: 400 }
      )
    }

    const { title, slug, excerpt, content, image, publishedAt, comments, isPublished } = parsed.data

    const existing = await prisma.service.findUnique({
      where: { slug },
    })
    if (existing) {
      return NextResponse.json({ message: 'Service with this slug already exists' }, { status: 409 })
    }

    const created = await prisma.service.create({
      data: {
        title,
        slug,
        excerpt,
        content: content || '',
        image,
        publishedAt,
        comments,
        isPublished,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
