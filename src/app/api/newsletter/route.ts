import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  recaptchaToken: z.string().min(1, 'reCAPTCHA token is required'),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  honeypot: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Honeypot spam protection: return silent success for bots
    if (body.honeypot && body.honeypot.trim() !== '') {
      return NextResponse.json(
        { success: true, message: 'Thank you for subscribing!' },
        { status: 200 }
      )
    }

    const { email, recaptchaToken } = schema.parse(body)

    // Verify Google reCAPTCHA v3
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.warn('RECAPTCHA_SECRET_KEY is missing from environment variables')
    } else {
      const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${recaptchaToken}`,
      })

      const verification = await response.json()
      if (!verification.success || verification.score < 0.5) {
        return NextResponse.json(
          { success: false, message: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        )
      }
    }

    // Check if subscriber exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, duplicate: true, message: 'You are already subscribed.' },
        { status: 409 }
      )
    }

    // Save to database
    await prisma.newsletterSubscriber.create({
      data: { email },
    })

    return NextResponse.json(
      { success: true, message: 'Thank you for subscribing!' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0].message },
        { status: 400 }
      )
    }
    
    // If the database is not running
    if (error.name === 'PrismaClientInitializationError' || error.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { success: false, message: 'MySQL Database is offline. Please start it.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
