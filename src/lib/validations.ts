import { z } from 'zod'

export const MembershipSchema = z.object({
  name: z.string().min(2, 'Community group/Association name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  contactNumber: z.string().min(6, 'Contact number is too short'),
  addressLine1: z.string().min(3, 'Address line 1 must be at least 3 characters'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  message: z.string().optional(),
})

export type MembershipInput = z.infer<typeof MembershipSchema>

export const AfricanGroupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  emailAddress: z.string().email('Please enter a valid email address'),
  contactNumber: z.string().min(6, 'Contact number is too short'),
  communityGroupName: z.string().min(2, 'Community group name must be at least 2 characters'),
  communityGroupAddress: z.string().min(5, 'Community group address must be at least 5 characters'),
  message: z.string().optional(),
})

export type AfricanGroupInput = z.infer<typeof AfricanGroupSchema>

export const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  honeypot: z.string().optional(), // Spam honeypot
})

export type ContactInput = z.infer<typeof ContactSchema>

export const NewsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export type NewsletterInput = z.infer<typeof NewsletterSchema>

export const DonationSchema = z.object({
  campaignId: z.string().min(1, 'Please select a campaign'),
  donorName: z.string().min(2, 'Name must be at least 2 characters'),
  donorEmail: z.string().email('Please enter a valid email address'),
  amount: z.number().min(1, 'Donation amount must be at least £1'),
  paymentMethod: z.enum(['STRIPE', 'OFFLINE']),
})

export type DonationInput = z.infer<typeof DonationSchema>

export const NewsPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  image: z.string().optional(),
  published: z.boolean().default(true),
})

export type NewsPostInput = z.infer<typeof NewsPostSchema>

export const EventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(3, 'Location is required'),
  image: z.string().optional(),
})

export type EventInput = z.infer<typeof EventSchema>

export const CommunityGroupSchema = z.object({
  name: z.string().min(2, 'Country/Group name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().optional(),
  contact: z.string().min(3, 'Contact info/Read more details are required'),
})

export type CommunityGroupInput = z.infer<typeof CommunityGroupSchema>

export const CampaignSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  image: z.string().optional(),
  goalAmount: z.number().min(10, 'Goal amount must be at least £10'),
})

export type CampaignInput = z.infer<typeof CampaignSchema>
