import { z } from 'zod'
import { humanNameSchema, optionalPhoneNumberSchema } from './rules'

export const donationCampaignSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  slug: z.string().trim().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  description: z.string().trim().min(1, 'Description is required'),
  image: z.string().trim().min(1, 'Image path is required'),
  goalAmount: z.number().min(1, 'Goal amount must be at least £1'),
  raisedAmount: z.number().default(0),
  donationCount: z.number().int().default(0),
  isPublished: z.boolean().default(true),
})

export const donationSchema = z.object({
  campaignSlug: z.string().trim().min(1, 'Campaign is required'),
  campaignTitle: z.string().trim().min(1, 'Campaign Title is required'),
  amount: z.number().min(1, 'Donation amount must be at least £1'),
  fullName: humanNameSchema,
  email: z.string().trim().email('Please enter a valid email address'),
  phone: optionalPhoneNumberSchema,
  address: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  paymentMethod: z.string().default('offline'),
  status: z.string().default('pending'),
})

export const monthlyDonationSchema = z.object({
  fullName: humanNameSchema,
  email: z.string().trim().email('Please enter a valid email address'),
  amount: z.number().min(1, 'Monthly donation amount must be at least £1'),
  paymentMethod: z.string().default('stripe'),
  message: z.string().optional().nullable(),
  status: z.string().default('active'),
})

