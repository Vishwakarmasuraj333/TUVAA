'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { humanNameSchema } from '@/lib/validations'
import { isPhoneNumber } from '@/lib/validations/rules'

const registerSchema = z.object({
  fullName: humanNameSchema,
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || isPhoneNumber(val), {
      message: 'Please enter a valid phone number.',
    }),
  message: z.string().optional(),
  acceptedTerms: z.literal(true, {
    message: 'You must accept the terms and conditions.',
  }),
  honeypot: z.string().optional(),
})

type RegisterInput = z.infer<typeof registerSchema>

interface EventRegisterFormProps {
  eventSlug: string
  eventName: string
}

export default function EventRegisterForm({ eventSlug, eventName }: EventRegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: '',
      acceptedTerms: undefined,
      honeypot: '',
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    // Spam protection
    if (data.honeypot) {
      toast.error('Spam submission detected.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || null,
          message: data.message || null,
          eventSlug,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Registration successful!')
        reset()
      } else if (response.status === 409) {
        toast.error('You are already registered for this event.')
      } else {
        toast.error(result.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Registration submission error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="register-section" className="w-full max-w-xl mx-auto bg-zinc-50 border border-zinc-200 rounded-sm p-6 sm:p-10 text-left shadow-sm">
      <h3 className="font-cinzel text-xl sm:text-2xl text-[#2b1a12] font-bold uppercase tracking-wider mb-6 text-center">
        Register For Event
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Honeypot field (hidden for spam prevention) */}
        <input
          type="text"
          {...register('honeypot')}
          className="hidden"
          autoComplete="off"
        />

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
            Full Name *
          </label>
          <input
            type="text"
            {...register('fullName')}
            className={`w-full bg-white border ${
              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-[#DB9E30]'
            } rounded-sm px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:border-[#DB9E30] transition-shadow`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email')}
            className={`w-full bg-white border ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-[#DB9E30]'
            } rounded-sm px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:border-[#DB9E30] transition-shadow`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            inputMode="tel"
            maxLength={20}
            {...register('phone')}
            className={`w-full bg-white border ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-[#DB9E30]'
            } rounded-sm px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:border-[#DB9E30] transition-shadow`}
            placeholder="+44 7843 106868"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
            Message / Roles Preferred (Optional)
          </label>
          <textarea
            {...register('message')}
            rows={4}
            className="w-full bg-white border border-zinc-300 focus:ring-[#DB9E30] rounded-sm px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:border-[#DB9E30] transition-shadow resize-none"
            placeholder="Tell us any details..."
          />
        </div>

        {/* Accepted Terms */}
        <div className="space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('acceptedTerms')}
              className="mt-1 h-4 w-4 border-zinc-300 text-[#DB9E30] focus:ring-[#DB9E30] rounded"
            />
            <span className="text-xs sm:text-sm text-[#555] leading-snug select-none">
              I agree to register for {eventName} and accept TUVAA policies.
            </span>
          </label>
          {errors.acceptedTerms && (
            <p className="text-xs text-red-500 font-medium">{errors.acceptedTerms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn-primary-hover w-full disabled:bg-zinc-400 font-cinzel font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm shadow-md hover:shadow-lg cursor-pointer"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  )
}

