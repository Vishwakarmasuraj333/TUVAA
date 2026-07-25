import { prisma } from '@/lib/prisma'
import { DirectoryListingView, DirectoryType, getFallbackListings } from '@/data/directory'

export async function getDirectoryListings(type: DirectoryType): Promise<DirectoryListingView[]> {
  try {
    const listings = await prisma.directoryListing.findMany({
      where: { type, isPublished: true },
      orderBy: [{ order: 'asc' }, { title: 'asc' }],
    })
    if (listings.length) {
      return listings.map((listing) => ({
        ...listing,
        type: listing.type as DirectoryType,
        gallery: Array.isArray(listing.gallery) ? listing.gallery.filter((item): item is string => typeof item === 'string') : undefined,
      }))
    }
  } catch (error) {
    console.warn(`Directory database unavailable for ${type}; using fallback content.`)
  }
  return getFallbackListings(type)
}
