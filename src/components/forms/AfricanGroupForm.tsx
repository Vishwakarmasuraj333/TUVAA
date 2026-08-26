'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AfricanGroupSchema, type AfricanGroupInput } from '@/lib/validations'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function AfricanGroupForm() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AfricanGroupInput>({
    resolver: zodResolver(AfricanGroupSchema),
    defaultValues: {
      fullName: '',
      emailAddress: '',
      contactNumber: '',
      communityGroupName: '',
      communityGroupAddress: '',
      message: '',
    },
  })

  const onSubmit = async (data: AfricanGroupInput) => {
    setLoading(true)
    try {
      const response = await fetch('/api/african-community-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || 'Something went wrong')
      }

      toast.success('Your African Community Group application has been submitted successfully!')
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
          <label htmlFor="fullName" className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-2">
            Contact Full Name <span className="text-red-400 font-bold ml-0.5">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="John Doe"
            {...register('fullName')}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'african-name-error' : undefined}
            className="w-full px-4 py-3 bg-white border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-charcoal"
          />
          {errors.fullName && <p id="african-name-error" className="text-xs text-sunset-500 mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="emailAddress" className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-2">
            Email Address <span className="text-red-400 font-bold ml-0.5">*</span>
          </label>
          <input
            type="email"
            id="emailAddress"
            placeholder="john@example.com"
            {...register('emailAddress')}
            aria-invalid={!!errors.emailAddress}
            aria-describedby={errors.emailAddress ? 'african-email-error' : undefined}
            className="w-full px-4 py-3 bg-white border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-charcoal"
          />
          {errors.emailAddress && (
            <p id="african-email-error" className="text-xs text-sunset-500 mt-1">{errors.emailAddress.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contactNumber" className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-2">
            Contact Phone Number <span className="text-red-400 font-bold ml-0.5">*</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            maxLength={20}
            id="contactNumber"
            placeholder="07123456789"
            {...register('contactNumber')}
            aria-invalid={!!errors.contactNumber}
            aria-describedby={errors.contactNumber ? 'african-phone-error' : undefined}
            className="w-full px-4 py-3 bg-white border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-charcoal"
          />
          {errors.contactNumber && (
            <p id="african-phone-error" className="text-xs text-sunset-500 mt-1">{errors.contactNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="communityGroupName" className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-2">
            African Community Group Name <span className="text-red-400 font-bold ml-0.5">*</span>
          </label>
          <input
            type="text"
            id="communityGroupName"
            placeholder="e.g. Southampton Gambian Community"
            {...register('communityGroupName')}
            aria-invalid={!!errors.communityGroupName}
            aria-describedby={errors.communityGroupName ? 'african-group-error' : undefined}
            className="w-full px-4 py-3 bg-white border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-charcoal"
          />
          {errors.communityGroupName && (
            <p id="african-group-error" className="text-xs text-sunset-500 mt-1">{errors.communityGroupName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="communityGroupAddress" className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-2">
          Community Group Address <span className="text-red-400 font-bold ml-0.5">*</span>
        </label>
        <input
          type="text"
          id="communityGroupAddress"
          placeholder="Newtown Youth Centre, Graham Rd, Southampton, SO14 0AW"
          {...register('communityGroupAddress')}
          aria-invalid={!!errors.communityGroupAddress}
          aria-describedby={errors.communityGroupAddress ? 'african-address-error' : undefined}
          className="w-full px-4 py-3 bg-white border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-charcoal"
        />
        {errors.communityGroupAddress && (
          <p id="african-address-error" className="text-xs text-sunset-500 mt-1">{errors.communityGroupAddress.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-2">
          Additional Message (Optional)
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="How can TUVAA support your group..."
          {...register('message')}
          className="w-full px-4 py-3 bg-white border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-charcoal resize-none"
        />
        {errors.message && <p className="text-xs text-sunset-500 mt-1">{errors.message.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary-hover w-full font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-md shadow-lg hover:shadow-xl disabled:opacity-65 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Register Group (£20)
        </button>
      </div>
    </form>
  )
}
