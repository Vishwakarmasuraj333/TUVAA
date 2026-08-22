import { z } from 'zod'
import {
  humanNameSchema,
  optionalPhoneNumberSchema,
  requiredPhoneNumberSchema,
  organizationNameSchema,
} from './rules'

export const contactFormSchema = z.object({
  name: humanNameSchema,
  email: z.string().trim().email('Please enter a valid email address'),
  phone: optionalPhoneNumberSchema,
  subject: z.string().optional().nullable(),
  message: z.string().trim().min(5, 'Message must be at least 5 characters'),
  status: z.string().default('new'),
})

export const newsletterSubscriberSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
})

export const eventRegistrationSchema = z.object({
  eventSlug: z.string().min(1, 'Event slug is required'),
  fullName: humanNameSchema,
  email: z.string().trim().email('Please enter a valid email address'),
  phone: optionalPhoneNumberSchema,
  message: z.string().optional().nullable(),
})

export const africanGroupApplicationSchema = z.object({
  fullName: humanNameSchema,
  emailAddress: z.string().trim().email('Please enter a valid email address'),
  contactNumber: requiredPhoneNumberSchema,
  communityGroupName: organizationNameSchema,
  communityGroupAddress: z.string().trim().min(5, 'Address is required'),
  message: z.string().optional().nullable(),
  status: z.string().default('pending'),
})

export const serviceCommentSchema = z.object({
  serviceSlug: z.string().min(1, 'Service slug is required'),
  name: humanNameSchema,
  email: z.string().trim().email('Please enter a valid email address'),
  comment: z.string().trim().min(3, 'Comment is required'),
  status: z.string().default('pending'),
})

