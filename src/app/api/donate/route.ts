import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import Stripe from 'stripe'

const DonationSchema = z.object({
  campaignId: z.string().min(1, 'Please select a campaign'),
  donorName: z.string().min(2, 'Name must be at least 2 characters'),
  donorEmail: z.string().email('Please enter a valid email address'),
  amount: z.number().min(1, 'Donation amount must be at least £1'),
  paymentMethod: z.enum(['STRIPE', 'OFFLINE']),
})

// Campaign title map for static slugs
const SLUG_TITLES: Record<string, string> = {
  'young-people': 'Young People',
  'women': 'Women',
  'bbam-festival': 'BBAM Festival',
}

// Initialize Stripe if key is available
let stripe: Stripe | null = null
if (
  process.env.STRIPE_SECRET_KEY &&
  !process.env.STRIPE_SECRET_KEY.includes('placeholder') &&
  process.env.STRIPE_SECRET_KEY !== ''
) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.accommodating' as any,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = DonationSchema.parse(body)
    const campaignTitle = SLUG_TITLES[data.campaignId] || 'TUVAA Community Campaign'

    // Find or upsert DB campaign
    let dbCampaign = await prisma.donationCampaign.findUnique({
      where: { slug: data.campaignId },
    })

    if (!dbCampaign) {
      // Upsert default campaign metadata if not found
      const defaultCampaigns: Record<string, { title: string; desc: string; goal: number; img: string }> = {
        'young-people': {
          title: 'YOUNG PEOPLE',
          desc: 'TUVAA is creating a range of opportunities for young people...',
          goal: 6032,
          img: '/images/donate-young-people.jpg',
        },
        'women': {
          title: 'WOMEN',
          desc: 'Supporting black women with swimming classes, support groups...',
          goal: 11263,
          img: '/images/donate-women.jpg',
        },
        'bbam-festival': {
          title: 'BBAM FESTIVAL',
          desc: 'Setting up black business network to empower start ups...',
          goal: 4596,
          img: '/images/donate-bbam-festival.jpg',
        },
      }

      const meta = defaultCampaigns[data.campaignId] || {
        title: campaignTitle,
        desc: 'TUVAA Community Support Campaign',
        goal: 5000,
        img: '/images/donate-young-people.jpg',
      }

      dbCampaign = await prisma.donationCampaign.create({
        data: {
          slug: data.campaignId,
          title: meta.title,
          description: meta.desc,
          image: meta.img,
          goalAmount: meta.goal,
          raisedAmount: 0,
          donationCount: 0,
          isPublished: true,
        },
      })
    }

    if (data.paymentMethod === 'OFFLINE') {
      await prisma.donation.create({
        data: {
          campaignSlug: dbCampaign.slug,
          campaignTitle: dbCampaign.title,
          fullName: data.donorName,
          email: data.donorEmail,
          amount: data.amount,
          paymentMethod: 'OFFLINE',
          status: 'pending',
        },
      })

      await prisma.donationCampaign.update({
        where: { slug: dbCampaign.slug },
        data: { 
          raisedAmount: { increment: data.amount },
          donationCount: { increment: 1 }
        },
      })

      return NextResponse.json({ message: 'Offline donation pledge recorded successfully.' }, { status: 201 })
    }

    // Stripe Payment
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `Donation: ${campaignTitle}`,
                description: 'Thank you for supporting TUVAA programs.',
              },
              unit_amount: Math.round(data.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/donate/success?session_id={CHECKOUT_SESSION_ID}&amount=${data.amount}&campaignId=${data.campaignId}&donorName=${encodeURIComponent(data.donorName)}&donorEmail=${data.donorEmail}`,
        cancel_url: `${req.headers.get('origin')}/donate`,
      })

      return NextResponse.json({ url: session.url }, { status: 200 })
    } else {
      // Mock mode — redirect to success page
      const mockUrl = `/donate/success?mock=true&amount=${data.amount}&campaignId=${data.campaignId}&donorName=${encodeURIComponent(data.donorName)}&donorEmail=${data.donorEmail}`
      return NextResponse.json({ url: mockUrl }, { status: 200 })
    }
  } catch (error: any) {
    console.error('Donation processing error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json(
      { message: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
