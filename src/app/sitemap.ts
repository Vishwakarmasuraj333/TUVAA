import { MetadataRoute } from 'next'
import { prisma, isDbAvailable } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tuvaa.org.uk'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/our-services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/our-events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/our-projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/bbam-2`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/community-groups`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/donate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  let dynamicRoutes: MetadataRoute.Sitemap = []

  if (await isDbAvailable()) {
    try {
      const [posts, services, events] = await Promise.all([
        prisma.newsPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
        prisma.service.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
        prisma.event.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      ])

      const newsUrls = posts.map(p => ({
        url: `${baseUrl}/news/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

      const serviceUrls = services.map(s => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.updatedAt || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

      const eventUrls = events.map(e => ({
        url: `${baseUrl}/events/${e.slug}`,
        lastModified: e.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

      dynamicRoutes = [...newsUrls, ...serviceUrls, ...eventUrls]
    } catch (e) {
      console.error('Sitemap dynamic generation error:', e)
    }
  }

  return [...staticRoutes, ...dynamicRoutes]
}
