import PageBanner from '@/components/common/PageBanner'
import { prisma } from '@/lib/prisma'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface SuccessPageProps {
  searchParams: Promise<{
    amount?: string
    campaignId?: string
    donorName?: string
    donorEmail?: string
    mock?: string
  }>
}

export const metadata = {
  title: 'Thank You for Your Donation - TUVAA',
  description: 'Your contribution helps us build a stronger community in Hampshire.',
}

export default async function DonationSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const amountVal = parseFloat(params.amount || '0')
  const campaignIdVal = params.campaignId || 'general'
  const donorNameVal = params.donorName
    ? decodeURIComponent(params.donorName)
    : 'Anonymous Donor'
  const donorEmailVal = params.donorEmail || 'anonymous@example.com'

  let dbCampaign = null

  if (amountVal > 0) {
    try {
      // Try to find a real DB campaign by slug
      dbCampaign = await prisma.donationCampaign.findFirst({
        where: { slug: campaignIdVal },
      })

      // Only write to DB if we have a real FK-valid campaign
      if (dbCampaign) {
        await prisma.donation.create({
          data: {
            campaignSlug: dbCampaign.slug,
            campaignTitle: dbCampaign.title,
            fullName: donorNameVal,
            email: donorEmailVal,
            amount: amountVal,
            paymentMethod: 'STRIPE',
            status: 'completed',
          },
        })

        await prisma.donationCampaign.update({
          where: { slug: dbCampaign.slug },
          data: { 
            raisedAmount: { increment: amountVal },
            donationCount: { increment: 1 }
          },
        })
      }
      // Static slug campaigns (young-people, women, bbam-festival) have no
      // DB row — we skip the write; the thank-you page still renders fine.
    } catch (e) {
      console.error('Error recording success donation:', e)
    }
  }

  // Friendly campaign name from slug
  const slugTitles: Record<string, string> = {
    'young-people': 'Young People',
    'women': 'Women',
    'bbam-festival': 'BBAM Festival',
  }
  const campaignTitle =
    dbCampaign?.title ||
    slugTitles[campaignIdVal] ||
    'TUVAA Community'

  return (
    <div className="w-full bg-white">
      <PageBanner title="Thank You" breadcrumb="Donate" />

      {/* ── Success Content ── */}
      <section className="w-full bg-[#faf9f7] py-[80px] px-4">
        <div className="mx-auto max-w-[620px]">

          {/* Card */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e8e0d4',
              borderRadius: 4,
              boxShadow: '0 8px 40px rgba(53,23,15,0.08)',
              padding: '52px 48px',
              textAlign: 'center',
            }}
          >

            {/* Check icon */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                border: '2px solid #68bd73',
                background: 'rgba(104,189,115,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 28px',
              }}
            >
              <CheckCircle2
                style={{ width: 38, height: 38, color: '#68bd73', strokeWidth: 1.8 }}
              />
            </div>

            {/* Gold accent line */}
            <div
              style={{
                width: 48,
                height: 3,
                background: '#DB9E30',
                borderRadius: 99,
                margin: '0 auto 24px',
              }}
            />

            {/* Heading */}
            <h1
              className="font-cinzel font-bold uppercase text-[#35170f]"
              style={{ fontSize: 'clamp(22px, 4vw, 30px)', lineHeight: 1.2, marginBottom: 20 }}
            >
              Thank You,<br />{donorNameVal}!
            </h1>

            {/* Main message */}
            <p
              style={{
                fontSize: 15,
                color: '#5a5048',
                lineHeight: 1.8,
                marginBottom: 14,
                maxWidth: 440,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Your generous gift of{' '}
              <strong style={{ color: '#35170f' }}>{formatCurrency(amountVal)}</strong>{' '}
              towards the{' '}
              <strong style={{ color: '#35170f' }}>{campaignTitle}</strong>{' '}
              campaign has been received successfully.
            </p>

            {/* Confirmation sub-text */}
            <p
              style={{
                fontSize: 13,
                color: '#9a9088',
                lineHeight: 1.75,
                marginBottom: 36,
              }}
            >
              A confirmation receipt will be sent to{' '}
              <span style={{ color: '#DB9E30', fontWeight: 600 }}>{donorEmailVal}</span>.
              <br />
              Your support is instrumental in sustaining our youth programmes,
              community assemblies, and mental wellness circles.
            </p>

            {/* Divider */}
            <div
              style={{
                borderTop: '1px solid #ede6dd',
                marginBottom: 32,
              }}
            />

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/"
                className="btn-primary-hover font-cinzel font-bold uppercase rounded-sm"
                style={{ fontSize: 11.5, padding: '13px 28px', letterSpacing: '0.1em' }}
              >
                Return Home
              </Link>
              <Link
                href="/news"
                className="font-cinzel font-bold uppercase rounded-sm"
                style={{
                  fontSize: 11.5,
                  padding: '13px 28px',
                  letterSpacing: '0.1em',
                  border: '1.5px solid #d9d0c7',
                  color: '#35170f',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'border-color 0.2s, color 0.2s',
                  background: 'transparent',
                }}
              >
                Read Latest News
              </Link>
            </div>

          </div>

          {/* Warm tagline below card */}
          <p
            className="font-cinzel uppercase text-center"
            style={{
              fontSize: 11,
              color: '#b0a89e',
              letterSpacing: '0.12em',
              marginTop: 28,
            }}
          >
            The United Voice of African Associations — Together We Thrive
          </p>

        </div>
      </section>
    </div>
  )
}
