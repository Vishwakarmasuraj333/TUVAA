import { z } from 'zod'
import { directoryTypes } from '@/data/directory'

const optionalContact = z.string().trim().max(500).optional().nullable().transform((value) => value || null)

export const directoryListingSchema = z.object({
  type: z.enum(directoryTypes),
  title: z.string().trim().min(2, 'Title is required').max(160),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers and single dashes only'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(10000),
  image: optionalContact,
  gallery: z.array(z.string().trim().min(1).max(500)).max(30).default([]),
  category: z.string().trim().max(120).optional().nullable().transform((value) => value || null),
  email: z.union([z.email(), z.literal('')]).optional().nullable().transform((value) => value || null),
  phone: optionalContact,
  website: optionalContact,
  socialUrl: optionalContact,
  isPublished: z.boolean().default(true),
  order: z.number().int().min(0).max(100000).default(0),
})
