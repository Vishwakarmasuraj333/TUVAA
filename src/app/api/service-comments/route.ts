import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const commentSchema = z.object({
  serviceSlug: z.string().min(1, 'Service identifier is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  comment: z.string().min(1, 'Comment is required'),
  mathAnswer: z.string().refine((val) => val.trim() === '4', {
    message: 'Math answer must be 4',
  }),
  acceptedPrivacy: z.boolean().refine((val) => val === true, {
    message: 'Privacy policy must be accepted',
  }),
  saveInfo: z.boolean().optional(),
  honeypot: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1. Honeypot check (Spam protection)
    if (body.honeypot && body.honeypot.trim() !== '') {
      console.log('Spam comment detected via honeypot field')
      return NextResponse.json({ success: true, message: 'Comment submitted successfully' })
    }

    // 2. Validate payload with Zod
    const parsed = commentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'validation_error', message: 'Please fill all required fields correctly.' },
        { status: 400 }
      )
    }

    const { serviceSlug, name, email, comment } = parsed.data

    // 3. Save the comment to the database using Prisma Client
    const savedComment = await prisma.serviceComment.create({
      data: {
        serviceSlug,
        name,
        email,
        comment,
        status: 'pending', // Default status
      },
    })

    return NextResponse.json(
      { success: true, message: 'Comment submitted successfully', comment: savedComment },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in service comments API:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
