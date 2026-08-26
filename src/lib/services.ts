import { prisma, isDbAvailable } from "@/lib/prisma"
import { services as fallbackServices } from "@/data/services"
import { ServiceViewModel } from "@/types/service"

const DEDICATED_SERVICE_IMAGES: Record<string, string> = {
  'community-street-cleaning': '/images/community-street-cleaning.jpg',
  'tuvaa-music': '/images/tuvaa-music.jpg',
  'tuvaa-enjoy': '/images/tuvaa-enjoy.jpg',
  'bame-mental-health-and-wellbeing': '/images/bame-mental-health.jpg',
  'poverty-and-hunger': '/images/poverty-hunger-relief.jpg',
  'health-and-wellbeing-information': '/images/health-wellbeing-info.jpg',
  'youth-empowerment': '/images/youth-empowerment.jpg',
  'newtown-community-support-centre': '/images/newtown-community-centre.jpg',
  'education-and-empowerment': '/images/education-empowerment.jpg',
  'bame-physical-health-and-wellbeing': '/images/football-park.jpg',
  'promoting-african-cultures-and-traditions': '/images/african-dance.jpg',
  'hidden-histories': '/images/hidden-histories.png',
}

export function resolveServiceImage(slug?: string, existingImage?: string | null): string {
  if (slug && DEDICATED_SERVICE_IMAGES[slug]) {
    return DEDICATED_SERVICE_IMAGES[slug]
  }
  if (existingImage && existingImage.trim() !== '' && !existingImage.includes('placeholder')) {
    return existingImage
  }
  return '/images/health-wellbeing-info.jpg'
}

function mapDbService(service: any): ServiceViewModel {
  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    excerpt: service.excerpt,
    content: service.content,
    image: resolveServiceImage(service.slug, service.image),
    date: new Date(service.publishedAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    comments: service.comments,
  }
}

function mapStaticService(service: any): ServiceViewModel {
  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    excerpt: service.excerpt,
    content: service.content,
    image: resolveServiceImage(service.slug, service.image),
    date: service.date,
    comments: service.comments,
  }
}

export async function getAllServices(): Promise<ServiceViewModel[]> {
  if (await isDbAvailable()) {
    try {
      const dbServices = await prisma.service.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
      })

      if (dbServices && dbServices.length > 0) {
        return dbServices.map(mapDbService)
      }
    } catch (error) {
      // Fallback
    }
  }
  return fallbackServices.map(mapStaticService)
}

export async function getServiceBySlug(slug: string): Promise<ServiceViewModel | null> {
  if (await isDbAvailable()) {
    try {
      const service = await prisma.service.findUnique({
        where: { slug },
      })
      if (service) {
        return mapDbService(service)
      }
    } catch (error) {
      // Fallback
    }
  }
  const fallback = fallbackServices.find((s) => s.slug === slug)
  return fallback ? mapStaticService(fallback) : null
}

export async function getAdjacentServices(slug: string): Promise<{
  previous: ServiceViewModel | null
  next: ServiceViewModel | null
}> {
  if (await isDbAvailable()) {
    try {
      const current = await prisma.service.findUnique({
        where: { slug },
      })

      if (current) {
        const prev = await prisma.service.findFirst({
          where: {
            isPublished: true,
            publishedAt: { lt: current.publishedAt },
          },
          orderBy: { publishedAt: "desc" },
        })

        const next = await prisma.service.findFirst({
          where: {
            isPublished: true,
            publishedAt: { gt: current.publishedAt },
          },
          orderBy: { publishedAt: "asc" },
        })

        return {
          previous: prev ? mapDbService(prev) : null,
          next: next ? mapDbService(next) : null,
        }
      }
    } catch (error) {
      // Fallback
    }
  }

  // Fallback adjacent logic (fallbackServices is descending, so index + 1 is chronologically earlier)
  const index = fallbackServices.findIndex((s) => s.slug === slug)
  if (index !== -1) {
    const prevFallback = index < fallbackServices.length - 1 ? fallbackServices[index + 1] : null
    const nextFallback = index > 0 ? fallbackServices[index - 1] : null
    return {
      previous: prevFallback ? mapStaticService(prevFallback) : null,
      next: nextFallback ? mapStaticService(nextFallback) : null,
    }
  }

  return { previous: null, next: null }
}

export async function getRelatedServices(slug: string): Promise<ServiceViewModel[]> {
  if (await isDbAvailable()) {
    try {
      const dbServices = await prisma.service.findMany({
        where: {
          isPublished: true,
          slug: { not: slug },
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
      })
      if (dbServices && dbServices.length > 0) {
        return dbServices.map(mapDbService)
      }
    } catch (error) {
      // Fallback
    }
  }
  return fallbackServices
    .filter((s) => s.slug !== slug)
    .slice(0, 3)
    .map(mapStaticService)
}
