import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { humanNameSchema } from '@/lib/validations/rules'

const commentSchema = z.object({
  serviceSlug: z.string().trim().min(1, 'Service identifier is required'),
  name: humanNameSchema,
  email: z.string().trim().email('Valid email is required'),
  comment: z.string().trim().min(3, 'Comment is required'),
  mathAnswer: z.string().optional(),
  acceptedPrivacy: z.boolean().optional(),
  saveInfo: z.boolean().optional(),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().optional(),
})

async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey || secretKey.includes('placeholder')) return true

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    })
    const data = await res.json()
    return data.success && (data.score === undefined || data.score >= 0.5)
  } catch (err) {
    console.error('reCAPTCHA verification error:', err)
    return true
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1. Honeypot check (Spam protection)
    if (body.honeypot && body.honeypot.trim() !== '') {
      console.log('Spam comment detected via honeypot field')
      return NextResponse.json({ success: true, message: 'Comment submitted successfully and is awaiting approval.' })
    }

    // 2. Validate payload with Zod
    const parsed = commentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Please fill all required fields correctly.' },
        { status: 400 }
      )
    }

    const { serviceSlug, name, email, comment, recaptchaToken } = parsed.data

    // 3. reCAPTCHA check if provided
    if (recaptchaToken) {
      const isValidCaptcha = await verifyRecaptcha(recaptchaToken)
      if (!isValidCaptcha) {
        return NextResponse.json(
          { success: false, message: 'Captcha verification failed. Please try again.' },
          { status: 400 }
        )
      }
    }

    const normalizedEmail = email.toLowerCase().trim()

    // 4. Check for duplicate comment for this serviceSlug + email
    const existingComment = await prisma.serviceComment.findFirst({
      where: {
        serviceSlug,
        email: normalizedEmail,
      },
    })

    if (existingComment) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already submitted a comment for this service.',
        },
        { status: 409 }
      )
    }

    // 5. Save the comment
    const savedComment = await prisma.serviceComment.create({
      data: {
        serviceSlug,
        name: name.trim(),
        email: normalizedEmail,
        comment: comment.trim(),
        status: 'pending',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Comment submitted successfully and is awaiting approval.',
        comment: savedComment,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          {
            success: false,
            message: 'You have already submitted a comment for this service.',
          },
          { status: 409 }
        )
      }
    }

    console.error('Error in service comments API:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
