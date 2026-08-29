'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MembershipSchema, type MembershipInput } from '@/lib/validations'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function MembershipForm() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MembershipInput>({
    resolver: zodResolver(MembershipSchema),
    defaultValues: {
      name: '',
      email: '',
      contactNumber: '',
      addressLine1: '',
      city: '',
      country: '',
      message: '',
    },
  })

  const onSubmit = async (data: MembershipInput) => {
    setLoading(true)
    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || 'Something went wrong')
      }

      toast.success('Your membership application has been submitted successfully!')
      reset()
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-xs font-cinzel font-semibold text-[#35170f] uppercase tracking-wider mb-2">
            Association / Group Name <span className="text-red-500 font-bold ml-1 text-sm">*</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder="e.g. Nigerian Association Southampton"
            {...register('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'membership-name-error' : undefined}
            className={`w-full px-4 py-3 bg-[#fcfbfa] border rounded focus:outline-none text-sm transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-[#d8cfc4] focus:border-[#DB9E30]'}`}
          />
          {errors.name && <p id="membership-name-error" className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-cinzel font-semibold text-[#35170f] uppercase tracking-wider mb-2">
            Official Email Address <span className="text-red-500 font-bold ml-1 text-sm">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="group@example.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'membership-email-error' : undefined}
            className={`w-full px-4 py-3 bg-[#fcfbfa] border rounded focus:outline-none text-sm transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-[#d8cfc4] focus:border-[#DB9E30]'}`}
          />
          {errors.email && <p id="membership-email-error" className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contactNumber" className="block text-xs font-cinzel font-semibold text-[#35170f] uppercase tracking-wider mb-2">
            Contact Number <span className="text-red-500 font-bold ml-1 text-sm">*</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            maxLength={20}
            id="contactNumber"
            placeholder="07123456789"
            {...register('contactNumber')}
            aria-invalid={!!errors.contactNumber}
            aria-describedby={errors.contactNumber ? 'membership-phone-error' : undefined}
            className={`w-full px-4 py-3 bg-[#fcfbfa] border rounded focus:outline-none text-sm transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white ${errors.contactNumber ? 'border-red-400 focus:border-red-500' : 'border-[#d8cfc4] focus:border-[#DB9E30]'}`}
          />
          {errors.contactNumber && (
            <p id="membership-phone-error" className="text-xs text-red-500 mt-1">{errors.contactNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="addressLine1" className="block text-xs font-cinzel font-semibold text-[#35170f] uppercase tracking-wider mb-2">
            Address Line 1 <span className="text-red-500 font-bold ml-1 text-sm">*</span>
          </label>
          <input
            type="text"
            id="addressLine1"
            placeholder="123 Graham Rd"
            {...register('addressLine1')}
            aria-invalid={!!errors.addressLine1}
            aria-describedby={errors.addressLine1 ? 'membership-address-error' : undefined}
            className={`w-full px-4 py-3 bg-[#fcfbfa] border rounded focus:outline-none text-sm transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white ${errors.addressLine1 ? 'border-red-400 focus:border-red-500' : 'border-[#d8cfc4] focus:border-[#DB9E30]'}`}
          />
          {errors.addressLine1 && (
            <p id="membership-address-error" className="text-xs text-red-500 mt-1">{errors.addressLine1.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="city" className="block text-xs font-cinzel font-semibold text-[#35170f] uppercase tracking-wider mb-2">
            City <span className="text-red-500 font-bold ml-1 text-sm">*</span>
          </label>
          <input
            type="text"
            id="city"
            placeholder="Southampton"
            {...register('city')}
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'membership-city-error' : undefined}
            className={`w-full px-4 py-3 bg-[#fcfbfa] border rounded focus:outline-none text-sm transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white ${errors.city ? 'border-red-400 focus:border-red-500' : 'border-[#d8cfc4] focus:border-[#DB9E30]'}`}
          />
          {errors.city && <p id="membership-city-error" className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor="country" className="block text-xs font-cinzel font-semibold text-[#35170f] uppercase tracking-wider mb-2">
            Country of Origin <span className="text-red-500 font-bold ml-1 text-sm">*</span>
          </label>
          <input
            type="text"
            id="country"
            placeholder="e.g. Nigeria / Zimbabwe"
            {...register('country')}
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? 'membership-country-error' : undefined}
            className={`w-full px-4 py-3 bg-[#fcfbfa] border rounded focus:outline-none text-sm transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white ${errors.country ? 'border-red-400 focus:border-red-500' : 'border-[#d8cfc4] focus:border-[#DB9E30]'}`}
          />
          {errors.country && <p id="membership-country-error" className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-cinzel font-semibold text-[#35170f] uppercase tracking-wider mb-2">
          Brief description of group activities
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Please describe your organization's goals and communities..."
          {...register('message')}
          className="w-full px-4 py-3 bg-[#fcfbfa] border border-[#d8cfc4] rounded focus:outline-none focus:border-[#DB9E30] text-sm transition-colors text-[#35170f] placeholder-[#8b8178] focus:bg-white resize-none"
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary-hover w-full disabled:opacity-50 font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Submit Application
        </button>
      </div>
    </form>
  )
}
