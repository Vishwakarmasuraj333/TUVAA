import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession, hasRole } from '@/lib/auth'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const newsPost = await prisma.newsPost.findUnique({ where: { id } })
    if (!newsPost) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.newsPost.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'DELETE',
        entity: 'NewsPost',
        entityId: id,
        message: `Deleted news: ${newsPost.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    revalidatePath('/')
    revalidatePath('/news')
    if (newsPost.slug) revalidatePath(`/news/${newsPost.slug}`)

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

    const newsPost = await prisma.newsPost.update({
      where: { id },
      data,
    })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'UPDATE',
        entity: 'NewsPost',
        entityId: id,
        message: `Updated news: ${newsPost.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    revalidatePath('/')
    revalidatePath('/news')
    if (newsPost.slug) revalidatePath(`/news/${newsPost.slug}`)

    return NextResponse.json(newsPost)
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const newsPost = await prisma.newsPost.findUnique({ where: { id } })
    if (!newsPost) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(newsPost)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
