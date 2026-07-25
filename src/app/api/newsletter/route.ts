import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  recaptchaToken: z.string().optional(),
  acceptedTerms: z.boolean().optional(),
  honeypot: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Honeypot spam protection: return silent success for bots
    if (body.honeypot && body.honeypot.trim() !== '') {
      return NextResponse.json(
        { success: true, message: 'Subscribed successfully.' },
        { status: 200 }
      )
    }

    const { email, recaptchaToken } = schema.parse(body)
    const normalizedEmail = email.toLowerCase().trim()

    // Verify Google reCAPTCHA v3 if secret key exists
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (secretKey && !secretKey.includes('placeholder') && recaptchaToken) {
      const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${recaptchaToken}`,
      })

      const verification = await response.json()
      if (!verification.success || (verification.score !== undefined && verification.score < 0.5)) {
        return NextResponse.json(
          { success: false, message: 'Captcha verification failed. Please try again.' },
          { status: 400 }
        )
      }
    }

    // Check if subscriber exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed.' },
        { status: 409 }
      )
    }

    // Save to database
    await prisma.newsletterSubscriber.create({
      data: { email: normalizedEmail },
    })

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully.' },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0]?.message || 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed.' },
        { status: 409 }
      )
    }
    
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { success: false, message: 'Database connection failed. Please try again later.' },
      { status: 500 }
    )
  }
}
