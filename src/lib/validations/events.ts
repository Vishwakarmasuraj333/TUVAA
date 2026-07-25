import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  posterImage: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  date: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
    return arg
  }, z.date({ message: 'Event date is required' })),
  endDate: z.preprocess((arg) => {
    if (!arg) return null
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
    return arg
  }, z.date().optional().nullable()),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  organizer: z.string().optional().nullable(),
  venue: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  status: z.enum(['upcoming', 'past']).default('upcoming'),
  isPublished: z.boolean().default(true),
})
