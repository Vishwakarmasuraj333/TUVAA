import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { humanNameSchema, optionalPhoneNumberSchema } from '@/lib/validations/rules'

const registrationSchema = z.object({
  fullName: humanNameSchema,
  email: z.string().trim().email('Valid email is required'),
  phone: optionalPhoneNumberSchema,
  message: z.string().optional().nullable(),
  eventSlug: z.string().trim().min(1, 'Event slug is required'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Zod validation
    const parsed = registrationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid registration details.', message: parsed.error.issues[0]?.message || 'Invalid registration details.', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { fullName, email, phone, message, eventSlug } = parsed.data

    // Check if event exists
    const eventExists = await prisma.event.findUnique({
      where: { slug: eventSlug },
    })

    if (!eventExists) {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 }
      )
    }

    // Check for duplicate registration
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventSlug_email: {
          eventSlug,
          email,
        },
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'duplicate', message: 'You are already registered for this event.' },
        { status: 409 }
      )
    }

    // Save registration
    const registration = await prisma.eventRegistration.create({
      data: {
        fullName,
        email,
        phone,
        message,
        eventSlug,
      },
    })

    return NextResponse.json({ success: true, registration }, { status: 201 })
  } catch (error) {
    console.error('Error in event registration API:', error)
    return NextResponse.json(
      { error: 'error', message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
