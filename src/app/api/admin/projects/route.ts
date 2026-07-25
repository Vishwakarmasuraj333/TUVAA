import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession, hasRole } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        order: true,
        createdAt: true,
      }
    })
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()
    const { title, slug, excerpt, content, image, isPublished, order } = data

    if (!title || !slug || !excerpt || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        isPublished: isPublished ?? true,
        order: order ? parseInt(order) : 0,
      }
    })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'CREATE',
        entity: 'Project',
        entityId: project.id,
        message: `Created project: ${project.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
