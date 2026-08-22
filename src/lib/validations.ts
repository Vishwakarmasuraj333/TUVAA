import { z } from 'zod'
import {
  humanNameSchema,
  organizationNameSchema,
  membershipContactNumberSchema,
  requiredPhoneNumberSchema,
  optionalPhoneNumberSchema,
  cityNameSchema,
  countryNameSchema,
} from './validations/rules'

export * from './validations/rules'

export const MembershipSchema = z.object({
  name: organizationNameSchema,
  email: z.string().trim().email('Please enter a valid email address'),
  contactNumber: membershipContactNumberSchema,
  addressLine1: z.string().trim().min(3, 'Address line 1 must be at least 3 characters'),
  city: cityNameSchema,
  country: countryNameSchema,
  message: z.string().optional().nullable(),
})

export type MembershipInput = z.infer<typeof MembershipSchema>

export const AfricanGroupSchema = z.object({
  fullName: humanNameSchema,
  emailAddress: z.string().trim().email('Please enter a valid email address'),
  contactNumber: requiredPhoneNumberSchema,
  communityGroupName: organizationNameSchema,
  communityGroupAddress: z.string().trim().min(5, 'Community group address must be at least 5 characters'),
  message: z.string().optional().nullable(),
})

export type AfricanGroupInput = z.infer<typeof AfricanGroupSchema>

export const ContactSchema = z.object({
  name: humanNameSchema,
  email: z.string().trim().email('Please enter a valid email address'),
  phone: optionalPhoneNumberSchema,
  subject: z.string().optional().nullable(),
  message: z.string().trim().min(5, 'Message must be at least 5 characters'),
  honeypot: z.string().optional(), // Spam honeypot
})

export type ContactInput = z.infer<typeof ContactSchema>

export const NewsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export type NewsletterInput = z.infer<typeof NewsletterSchema>

export const DonationSchema = z.object({
  campaignId: z.string().min(1, 'Please select a campaign'),
  donorName: humanNameSchema,
  donorEmail: z.string().trim().email('Please enter a valid email address'),
  amount: z.number().min(1, 'Donation amount must be at least £1'),
  paymentMethod: z.enum(['STRIPE', 'OFFLINE']),
})

export type DonationInput = z.infer<typeof DonationSchema>

export const NewsPostSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  content: z.string().trim().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().optional().nullable(),
  category: z.string().trim().min(1, 'Category is required'),
  image: z.string().optional().nullable(),
  published: z.boolean().default(true),
})

export type NewsPostInput = z.infer<typeof NewsPostSchema>

export const EventSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().trim().min(3, 'Location is required'),
  image: z.string().optional().nullable(),
})

export type EventInput = z.infer<typeof EventSchema>

export const CommunityGroupSchema = z.object({
  name: organizationNameSchema,
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  image: z.string().optional().nullable(),
  contact: z.string().trim().min(3, 'Contact info/Read more details are required'),
})

export type CommunityGroupInput = z.infer<typeof CommunityGroupSchema>

export const CampaignSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  description: z.string().trim().min(10, 'Description is required'),
  image: z.string().optional().nullable(),
  goalAmount: z.number().min(10, 'Goal amount must be at least £10'),
})

export type CampaignInput = z.infer<typeof CampaignSchema>

