'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { isHumanName, isPhoneNumber } from '@/lib/validations/rules'

const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full Name is required.')
    .min(2, 'Full Name must be at least 2 characters.')
    .max(100, 'Full Name cannot exceed 100 characters.')
    .refine(isHumanName, {
      message: 'Please enter a valid Full Name (letters only).',
    }),
  email: z
    .string()
    .trim()
    .min(1, 'Email Address is required.')
    .email('Please enter a valid Email Address.'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || isPhoneNumber(val), {
      message: 'Please enter a valid Phone Number.',
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
          <label htmlFor="event-fullName" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block font-cinzel">
            Full Name <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <input
            id="event-fullName"
            type="text"
            {...register('fullName')}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'event-fullName-error' : undefined}
            className={`w-full bg-white border ${
              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-[#DB9E30]'
            } rounded-sm px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:border-[#DB9E30] transition-shadow`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p id="event-fullName-error" className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="event-email" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block font-cinzel">
            Email Address <span className="text-red-500 font-bold ml-0.5">*</span>
          </label>
          <input
            id="event-email"
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'event-email-error' : undefined}
            className={`w-full bg-white border ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-[#DB9E30]'
            } rounded-sm px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:border-[#DB9E30] transition-shadow`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p id="event-email-error" className="text-xs text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="event-phone" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block font-cinzel">
            Phone Number (Optional)
          </label>
          <input
            id="event-phone"
            type="tel"
            inputMode="tel"
            maxLength={20}
            {...register('phone')}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'event-phone-error' : undefined}
            className={`w-full bg-white border ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-[#DB9E30]'
            } rounded-sm px-4 py-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:border-[#DB9E30] transition-shadow`}
            placeholder="+44 7843 106868"
          />
          {errors.phone && (
            <p id="event-phone-error" className="text-xs text-red-500 font-medium">{errors.phone.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="event-message" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block font-cinzel">
            Message / Roles Preferred (Optional)
          </label>
          <textarea
            id="event-message"
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
              aria-invalid={!!errors.acceptedTerms}
              aria-describedby={errors.acceptedTerms ? 'event-terms-error' : undefined}
              className="mt-1 h-4 w-4 border-zinc-300 text-[#DB9E30] focus:ring-[#DB9E30] rounded"
            />
            <span className="text-xs sm:text-sm text-[#555] leading-snug select-none">
              I agree to register for {eventName} and accept TUVAA policies. <span className="text-red-500 font-bold ml-0.5">*</span>
            </span>
          </label>
          {errors.acceptedTerms && (
            <p id="event-terms-error" className="text-xs text-red-500 font-medium">{errors.acceptedTerms.message}</p>
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

