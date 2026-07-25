import { NextResponse } from 'next/server'
import { prisma, isDbAvailable } from '@/lib/prisma'
import { ContactSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = ContactSchema.parse(body)

    const subjectText = data.subject || 'TUVAA Website Contact Inquiry'

    if (await isDbAvailable()) {
      try {
        await prisma.contactMessage.create({
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            subject: subjectText,
            message: data.message,
          },
        })
      } catch (dbError) {
        console.warn('Database save failed for contact message, logging fallback:', dbError)
      }
    } else {
      console.log('Database offline. Received contact message:', {
        name: data.name,
        email: data.email,
        message: data.message,
      })
    }

    return NextResponse.json(
      { message: 'Your message has been sent successfully! We will get in touch soon.' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Contact message error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
