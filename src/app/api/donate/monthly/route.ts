import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { humanNameSchema } from '@/lib/validations/rules'

const MonthlyDonationSchema = z.object({
  fullName: humanNameSchema,
  email: z.string().trim().email('Valid email required'),
  amount: z.number().min(1, 'Amount must be at least £1'),
  startDate: z.string().optional(),
  paymentMethod: z.enum(['STRIPE', 'OFFLINE']),
  message: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = MonthlyDonationSchema.parse(body)

    // Save to the MonthlyDonation table
    await prisma.monthlyDonation.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        amount: data.amount,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        paymentMethod: data.paymentMethod,
        message: data.message || '',
        status: 'pending',
      },
    })

    return NextResponse.json(
      { message: 'Monthly donation request received successfully.' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Monthly donation error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ message: 'Internal server error. Please try again.' }, { status: 500 })
  }
}
