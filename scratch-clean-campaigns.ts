import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanExtraCampaigns() {
  console.log('Cleaning up extra/test campaigns from Aiven MySQL...')

  const allowedSlugs = ['young-people', 'women', 'bbam-festival']

  // Delete donations attached to test campaigns
  const extraCampaigns = await prisma.donationCampaign.findMany({
    where: {
      slug: { notIn: allowedSlugs },
    },
  })

  for (const campaign of extraCampaigns) {
    console.log(`Removing extra campaign: "${campaign.title}" (${campaign.slug})`)
    await prisma.donation.deleteMany({
      where: { campaignSlug: campaign.slug },
    })
    await prisma.donationCampaign.delete({
      where: { id: campaign.id },
    })
  }

  console.log('Cleanup completed. Remaining campaigns:')
  const remaining = await prisma.donationCampaign.findMany()
  console.log(remaining.map((c) => ({ slug: c.slug, title: c.title })))
}

cleanExtraCampaigns()
  .catch((err) => {
    console.error('Error cleaning campaigns:', err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
