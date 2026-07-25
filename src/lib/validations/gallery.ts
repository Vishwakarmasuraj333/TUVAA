import { z } from 'zod'

export const galleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['image', 'video']),
  imageUrl: z.string().min(1, 'Image path is required'),
  videoUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
})
