import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MembershipSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = MembershipSchema.parse(body)

    // Save to database
    await prisma.membershipApplication.create({
      data: {
        name: data.name,
        email: data.email,
        contactNumber: data.contactNumber,
        addressLine1: data.addressLine1,
        city: data.city,
        country: data.country,
        message: data.message || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json(
      { message: 'Membership application submitted successfully!' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Membership application error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
