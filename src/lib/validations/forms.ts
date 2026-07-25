import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  status: z.string().default('new'),
})

export const newsletterSubscriberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const eventRegistrationSchema = z.object({
  eventSlug: z.string().min(1, 'Event slug is required'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
})

export const africanGroupApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  emailAddress: z.string().email('Please enter a valid email address'),
  contactNumber: z.string().min(6, 'Contact number is required'),
  communityGroupName: z.string().min(2, 'Community group/Association name is required'),
  communityGroupAddress: z.string().min(5, 'Address is required'),
  message: z.string().optional().nullable(),
  status: z.string().default('pending'),
})

export const serviceCommentSchema = z.object({
  serviceSlug: z.string().min(1, 'Service slug is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  comment: z.string().min(3, 'Comment is required'),
  status: z.string().default('pending'),
})
