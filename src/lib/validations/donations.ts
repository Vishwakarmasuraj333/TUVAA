import { z } from 'zod'

export const donationCampaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image path is required'),
  goalAmount: z.number().min(1, 'Goal amount must be at least £1'),
  raisedAmount: z.number().default(0),
  donationCount: z.number().int().default(0),
  isPublished: z.boolean().default(true),
})

export const donationSchema = z.object({
  campaignSlug: z.string().min(1, 'Campaign is required'),
  campaignTitle: z.string().min(1, 'Campaign Title is required'),
  amount: z.number().min(1, 'Donation amount must be at least £1'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  paymentMethod: z.string().default('offline'),
  status: z.string().default('pending'),
})

export const monthlyDonationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  amount: z.number().min(1, 'Monthly donation amount must be at least £1'),
  paymentMethod: z.string().default('stripe'),
  message: z.string().optional().nullable(),
  status: z.string().default('active'),
})
