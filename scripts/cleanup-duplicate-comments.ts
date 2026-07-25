import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDuplicateComments() {
  console.log('Starting duplicate service comments cleanup...')

  // Fetch all comments ordered by createdAt desc
  const allComments = await prisma.serviceComment.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const seenKeys = new Set<string>()
  const duplicatesToDelete: string[] = []

  for (const comment of allComments) {
    const key = `${comment.serviceSlug}___${comment.email.toLowerCase().trim()}`
    if (seenKeys.has(key)) {
      duplicatesToDelete.push(comment.id)
    } else {
      seenKeys.add(key)
    }
  }

  if (duplicatesToDelete.length > 0) {
    console.log(`Found ${duplicatesToDelete.length} duplicate comments to delete:`, duplicatesToDelete)
    const deleteResult = await prisma.serviceComment.deleteMany({
      where: {
        id: { in: duplicatesToDelete },
      },
    })
    console.log('Successfully deleted duplicate comments:', deleteResult)
  } else {
    console.log('No duplicate comments found.')
  }
}

cleanupDuplicateComments()
  .catch((err) => {
    console.error('Error during comment cleanup:', err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
