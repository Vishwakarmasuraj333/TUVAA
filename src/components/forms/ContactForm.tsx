'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, type ContactInput } from '@/lib/validations'
import { toast } from 'sonner'
import { Loader2, Users } from 'lucide-react'

export default function ContactForm() {
  const searchParams = useSearchParams()
  const groupParam = searchParams.get('group')

  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: groupParam ? `Inquiry regarding Community Group: ${groupParam}` : 'TUVAA Website Contact Inquiry',
      message: '',
      honeypot: '',
    },
  })

  useEffect(() => {
    if (groupParam) {
      setValue('subject', `Inquiry regarding Community Group: ${groupParam}`)
    }
  }, [groupParam, setValue])

  const onSubmit = async (data: ContactInput) => {
    if (!consent) {
      toast.error('You must agree to the data collection consent.')
      return
    }

    if (data.honeypot) {
      toast.success('Your message has been sent successfully!')
      reset()
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: '',
          subject: data.subject || 'TUVAA Website Contact Inquiry',
          message: data.message,
        }),
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || 'Something went wrong')
      }

      toast.success('Your message has been sent successfully! We will get in touch soon.')
      reset()
      setConsent(true)
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left w-full">
      {/* Spam Honeypot Field */}
      <input
        type="text"
        {...register('honeypot')}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-5">
        {/* Selected Community Group Callout */}
        {groupParam && (
          <div className="p-4 bg-[#fdf8ee] border border-[#e8dfc8] rounded-sm text-sm text-[#35170f] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#DB9E30]/15 flex items-center justify-center text-[#DB9E30] shrink-0">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-[#DB9E30] font-cinzel">
                  Community Group
                </p>
                <p className="font-bold text-sm text-[#35170f] font-cinzel">{groupParam}</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="text-xs text-[#8b8178] hover:text-[#35170f] underline ml-2 shrink-0 font-medium transition-colors"
            >
              Clear
            </Link>
          </div>
        )}

        {/* Name Input */}
        <div>
          <label htmlFor="contact-name" className="block text-xs font-cinzel font-semibold uppercase tracking-wider text-[#35170f] mb-1.5">
            Your Name <span className="text-red-500 font-bold ml-1 text-sm">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="e.g. John Doe"
            {...register('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={`w-full px-5 py-3.5 bg-[#fcfbfa] border rounded-sm focus:outline-none text-base transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-[#d8cfc4] focus:border-[#DB9E30]'}`}
          />
          {errors.name && <p id="contact-name-error" className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="contact-email" className="block text-xs font-cinzel font-semibold uppercase tracking-wider text-[#35170f] mb-1.5">
            Your E-mail <span className="text-red-500 font-bold ml-1 text-sm">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="e.g. john@example.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={`w-full px-5 py-3.5 bg-[#fcfbfa] border rounded-sm focus:outline-none text-base transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-[#d8cfc4] focus:border-[#DB9E30]'}`}
          />
          {errors.email && <p id="contact-email-error" className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Message Input */}
        <div>
          <label htmlFor="contact-message" className="block text-xs font-cinzel font-semibold uppercase tracking-wider text-[#35170f] mb-1.5">
            Your Message <span className="text-red-500 font-bold ml-1 text-sm">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="How can we help you?"
            {...register('message')}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={`w-full px-5 py-3.5 bg-[#fcfbfa] border rounded-sm focus:outline-none text-base transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white resize-none ${errors.message ? 'border-red-400 focus:border-red-500' : 'border-[#d8cfc4] focus:border-[#DB9E30]'}`}
          />
          {errors.message && <p id="contact-message-error" className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4.5 w-4.5 rounded border-[#e8dfc8] text-[#DB9E30] focus:ring-[#DB9E30] cursor-pointer"
          />
          <label htmlFor="consent" className="text-sm text-[#8b8178] select-none cursor-pointer">
            I agree that my submitted data is being collected and stored.
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed font-cinzel font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-sm shadow-md flex items-center justify-center gap-2 cursor-pointer text-white"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin text-white" />}
          Submit
        </button>
      </div>
    </form>
  )
}
