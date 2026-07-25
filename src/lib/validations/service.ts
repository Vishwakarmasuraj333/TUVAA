import { z } from 'zod'

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().min(1, 'Image path is required'),
  publishedAt: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
    return arg
  }, z.date({ message: 'Published date is required' })),
  comments: z.number().int().default(0),
  isPublished: z.boolean().default(true),
})
