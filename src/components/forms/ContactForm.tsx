'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, type ContactInput } from '@/lib/validations'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: 'TUVAA Website Contact Inquiry',
      message: '',
      honeypot: '',
    },
  })

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
        {/* Name Input */}
        <div>
          <input
            type="text"
            placeholder="Your name*"
            {...register('name')}
            className="w-full px-5 py-4 bg-[#fcfbfa] border border-[#e8dfc8] rounded-sm focus:outline-none focus:border-[#DB9E30] text-base transition-colors text-[#35170f] placeholder-[#a0988e]"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div>
          <input
            type="email"
            placeholder="Your e-mail*"
            {...register('email')}
            className="w-full px-5 py-4 bg-[#fcfbfa] border border-[#e8dfc8] rounded-sm focus:outline-none focus:border-[#DB9E30] text-base transition-colors text-[#35170f] placeholder-[#a0988e]"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Message Input */}
        <div>
          <textarea
            rows={6}
            placeholder="Your message*"
            {...register('message')}
            className="w-full px-5 py-4 bg-[#fcfbfa] border border-[#e8dfc8] rounded-sm focus:outline-none focus:border-[#DB9E30] text-base transition-colors text-[#35170f] placeholder-[#a0988e] resize-none"
          />
          {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
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
