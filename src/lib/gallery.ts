import { prisma, isDbAvailable } from './prisma'
import { fallbackGalleryItems, GalleryItem } from '@/data/gallery'

export interface DBGalleryItem {
  id: string
  title: string
  type: string
  imageUrl: string
  videoUrl: string | null
  thumbnailUrl: string | null
  category: string | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

function mapFallbackToDB(item: GalleryItem): DBGalleryItem {
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl || null,
    thumbnailUrl: item.thumbnailUrl || null,
    category: item.category || null,
    isPublished: true,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.createdAt),
  }
}

export async function getGalleryItems(): Promise<DBGalleryItem[]> {
  if (await isDbAvailable()) {
    try {
      const items = await prisma.galleryItem.findMany({
        orderBy: { createdAt: 'desc' },
      })
      if (items && items.length > 0) return items as DBGalleryItem[]
    } catch (error) {
      // Fallback
    }
  }
  return fallbackGalleryItems.map(mapFallbackToDB)
}

export async function getGalleryImages(): Promise<DBGalleryItem[]> {
  if (await isDbAvailable()) {
    try {
      const items = await prisma.galleryItem.findMany({
        where: { type: 'image', isPublished: true },
        orderBy: { createdAt: 'desc' },
      })
      if (items && items.length > 0) return items as DBGalleryItem[]
    } catch (error) {
      // Fallback
    }
  }
  return fallbackGalleryItems.filter((i) => i.type === 'image').map(mapFallbackToDB)
}

export async function getGalleryVideos(): Promise<DBGalleryItem[]> {
  if (await isDbAvailable()) {
    try {
      const items = await prisma.galleryItem.findMany({
        where: { type: 'video', isPublished: true },
        orderBy: { createdAt: 'desc' },
      })
      if (items && items.length > 0) return items as DBGalleryItem[]
    } catch (error) {
      // Fallback
    }
  }
  return fallbackGalleryItems.filter((i) => i.type === 'video').map(mapFallbackToDB)
}

export async function getGalleryItemById(id: string): Promise<DBGalleryItem | null> {
  if (await isDbAvailable()) {
    try {
      const item = await prisma.galleryItem.findUnique({
        where: { id },
      })
      if (item) return item as DBGalleryItem
    } catch (error) {
      // Fallback
    }
  }
  const fallback = fallbackGalleryItems.find((i) => i.id === id)
  return fallback ? mapFallbackToDB(fallback) : null
}
