import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { humanNameSchema } from '@/lib/validations/rules'

const commentSchema = z.object({
  postId: z.string().trim().min(1, 'Post ID is required'),
  name: humanNameSchema,
  email: z.string().trim().email('Valid email is required'),
  message: z.string().trim().min(2, 'Comment message is required'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = commentSchema.parse(body)

    const post = await prisma.newsPost.findUnique({
      where: { id: data.postId }
    })

    if (!post) {
      return NextResponse.json({ error: 'News post not found' }, { status: 404 })
    }

    const newComment = await (prisma as any).newsComment.create({
      data: {
        postId: data.postId,
        name: data.name,
        email: data.email,
        message: data.message,
        status: 'pending',
        approved: false,
      }
    })

    return NextResponse.json(
      { message: 'Comment submitted successfully and pending approval.', comment: newComment },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Comment submission error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
