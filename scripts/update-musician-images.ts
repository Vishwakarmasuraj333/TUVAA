import { PrismaClient } from '@prisma/client'
import { getFallbackListings, directoryTypes } from '../src/data/directory'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating directory listings with fresh real images in database...')

  for (const dType of directoryTypes) {
    const fallbackListings = getFallbackListings(dType)
    for (const item of fallbackListings) {
      const existing = await prisma.directoryListing.findFirst({
        where: {
          OR: [
            { slug: item.slug },
            { title: item.title },
          ],
        },
      })

      if (existing) {
        console.log(`Updating "${existing.title}" (${existing.type}) -> image: ${item.image}`)
        await prisma.directoryListing.update({
          where: { id: existing.id },
          data: {
            image: item.image,
            category: item.category,
            description: item.description,
          },
        })
      } else {
        console.log(`Creating listing "${item.title}" (${item.type}) -> image: ${item.image}`)
        await prisma.directoryListing.create({
          data: {
            id: item.id,
            title: item.title,
            slug: item.slug,
            type: item.type,
            description: item.description,
            image: item.image,
            category: item.category,
            email: item.email || null,
            isPublished: true,
            order: item.order || 0,
          },
        })
      }
    }
  }

  console.log('Directory listings updated successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
