import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().optional().nullable(),
  image: z.string().min(1, 'Image path is required'),
  isPublished: z.boolean().default(true),
  order: z.number().int().default(0),
})
