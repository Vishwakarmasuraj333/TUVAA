import PageBanner from '@/components/common/PageBanner'
import DonatePageClient from '@/components/donate/DonatePageClient'
import { prisma, isDbAvailable } from '@/lib/prisma'
import { Campaign, campaigns as fallbackCampaigns } from '@/data/donationCampaigns'

export const metadata = {
  title: 'Donate - TUVAA',
  description:
    'Support the work of TUVAA. Donate towards our campaigns.',
}

export const revalidate = 0 // Ensure this page is not statically cached since it relies on live DB data

export default async function DonatePage() {
  let mappedCampaigns: Campaign[] = fallbackCampaigns

  if (await isDbAvailable()) {
    try {
      const dbCampaigns = await prisma.donationCampaign.findMany({
        where: {
          isPublished: true,
          slug: { in: ['young-people', 'women', 'bbam-festival'] },
        },
      })

      if (dbCampaigns && dbCampaigns.length > 0) {
        mappedCampaigns = dbCampaigns.map((camp) => {
          // Truncate the description for the short text
          const shortText =
            camp.description.length > 150
              ? camp.description.slice(0, 150) + '...'
              : camp.description

          return {
            slug: camp.slug,
            title: camp.title,
            shortText: shortText,
            fullDescription: camp.description,
            image: camp.image,
            goalAmount: camp.goalAmount,
            raisedAmount: camp.raisedAmount,
            donationCount: camp.donationCount,
          }
        })
      }
    } catch (error) {
      console.warn('Database error on /donate page; using fallback campaigns.', error)
    }
  }

  return (
    <div className="w-full bg-white">
      <PageBanner title="Donate" breadcrumb="Donate" />
      <DonatePageClient campaigns={mappedCampaigns} />
    </div>
  )
}
