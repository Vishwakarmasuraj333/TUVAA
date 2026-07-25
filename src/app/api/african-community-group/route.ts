import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AfricanGroupSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = AfricanGroupSchema.parse(body)

    // Save to database
    await prisma.africanGroupApplication.create({
      data: {
        fullName: data.fullName,
        emailAddress: data.emailAddress,
        contactNumber: data.contactNumber,
        communityGroupName: data.communityGroupName,
        communityGroupAddress: data.communityGroupAddress,
        message: data.message || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json(
      { message: 'African Community Group application submitted successfully!' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('African group application error:', error)
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
