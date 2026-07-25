'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewsletterSchema, type NewsletterInput } from '@/lib/validations'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type FormInput = NewsletterInput & {
  honeypot?: string
}

export default function NewsletterForm() {
  const [loading, setLoading] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: {
      email: '',
      acceptedTerms: false,
      honeypot: '',
    },
  })

  const onSubmit = async (data: FormInput) => {
    if (!executeRecaptcha) {
      toast.error('reCAPTCHA is not loaded yet. Please try again.')
      return
    }

    setLoading(true)
    try {
      // Execute reCAPTCHA verification
      const token = await executeRecaptcha('newsletter_submit')

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          acceptedTerms: data.acceptedTerms,
          recaptchaToken: token,
          honeypot: data.honeypot,
        }),
      })

      const resData = await response.json()

      if (!response.ok) {
        toast.error(resData.message || 'This email is already subscribed.')
        return
      }

      toast.success(resData.message || 'Thank you for subscribing!')
      reset()
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[700px] mx-auto space-y-0">
      {/* Honeypot Spam Protection Field (Hidden) */}
      <input
        type="text"
        {...register('honeypot')}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="flex flex-col sm:flex-row gap-[10px] w-full">
        <div className="flex-grow">
          <input
            type="email"
            placeholder="Your Email"
            {...register('email')}
            className="w-full px-6 h-[54px] sm:h-[58px] bg-white/10 border border-white/8 text-white rounded-md focus:outline-none focus:border-[#DB9E30] focus:ring-2 focus:ring-[#DB9E30]/30 text-sm transition-all placeholder-[#9a948e]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest w-full sm:w-[170px] h-[54px] sm:h-[58px] rounded-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {loading ? 'SIGNING UP...' : 'SIGN UP'}
        </button>
      </div>
      
      {errors.email && (
        <p className="text-xs text-red-400 text-left mt-2 pl-1">{errors.email.message}</p>
      )}

      <div className="flex items-center gap-2 mt-[14px]">
        <input
          type="checkbox"
          id="acceptedTerms"
          {...register('acceptedTerms')}
          className="h-3.5 w-3.5 accent-[#DB9E30] cursor-pointer rounded border-white/10 text-[#DB9E30] focus:ring-[#DB9E30]/30 bg-black/40"
        />
        <label htmlFor="acceptedTerms" className="text-[11px] sm:text-xs text-zinc-400 hover:text-white cursor-pointer text-left select-none leading-none">
          I have read and agree to the <span className="text-zinc-300 underline hover:text-[#DB9E30] transition-colors">terms & conditions</span>
        </label>
      </div>
      
      {errors.acceptedTerms && (
        <p className="text-xs text-red-400 text-left block mt-2 pl-1">{errors.acceptedTerms.message}</p>
      )}

      <div className="text-[11px] text-[#7f7a75] text-left leading-normal mt-[24px]">
        This site is protected by reCAPTCHA and the Google{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#DB9E30] underline transition-colors">Privacy Policy</a>{' '}
        and{' '}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#DB9E30] underline transition-colors">Terms of Service</a>{' '}
        apply.
      </div>
    </form>
  )
}
