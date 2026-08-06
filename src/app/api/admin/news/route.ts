import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession, hasRole } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const news = await prisma.newsPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        image: true,
        category: true,
        published: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
      }
    })
    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!hasRole(session, ['super_admin', 'admin', 'sub_admin'])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json()
    const { id, title, slug, excerpt, content, image, videoUrl, category, published, isPublished } = data

    if (!title || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pubStatus = published ?? isPublished ?? true

    let newsPost
    if (id) {
      // Update existing
      newsPost = await prisma.newsPost.update({
        where: { id },
        data: {
          title,
          slug,
          excerpt: excerpt || null,
          content: content || null,
          image: image || null,
          videoUrl: videoUrl || null,
          category: category || 'General',
          published: pubStatus,
          isPublished: pubStatus,
        }
      })

      await prisma.activityLog.create({
        data: {
          userId: session!.id,
          action: 'UPDATE',
          entity: 'NewsPost',
          entityId: newsPost.id,
          message: `Updated news: ${newsPost.title}`,
          ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
        }
      })
    } else {
      // Create new
      newsPost = await prisma.newsPost.create({
        data: {
          title,
          slug,
          excerpt: excerpt || null,
          content: content || null,
          image: image || null,
          videoUrl: videoUrl || null,
          category: category || 'General',
          published: pubStatus,
          isPublished: pubStatus,
        }
      })

      await prisma.activityLog.create({
        data: {
          userId: session!.id,
          action: 'CREATE',
          entity: 'NewsPost',
          entityId: newsPost.id,
          message: `Created news: ${newsPost.title}`,
          ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
        }
      })
    }

    revalidatePath('/')
    revalidatePath('/news')
    if (newsPost.slug) revalidatePath(`/news/${newsPost.slug}`)

    return NextResponse.json(newsPost, { status: id ? 200 : 201 })
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    console.error('Save news post error:', error)
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
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const post = await prisma.newsPost.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await prisma.newsPost.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        userId: session!.id,
        action: 'DELETE',
        entity: 'NewsPost',
        entityId: id,
        message: `Deleted news: ${post.title}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    revalidatePath('/')
    revalidatePath('/news')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete news error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

