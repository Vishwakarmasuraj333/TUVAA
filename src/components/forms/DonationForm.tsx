'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DonationSchema, type DonationInput } from '@/lib/validations'
import { toast } from 'sonner'
import { Loader2, Heart, Award } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Campaign {
  id: string
  title: string
  description: string
  image: string | null
  goalAmount: number
  raisedAmount: number
}

interface DonationFormProps {
  campaigns: Campaign[]
}

const suggestedAmounts = [10, 20, 50, 100]

export default function DonationForm({ campaigns }: DonationFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '')
  const [showOfflineModal, setShowOfflineModal] = useState(false)
  const [customAmountActive, setCustomAmountActive] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DonationInput>({
    resolver: zodResolver(DonationSchema),
    defaultValues: {
      campaignId: campaigns[0]?.id || '',
      donorName: '',
      donorEmail: '',
      amount: 20,
      paymentMethod: 'STRIPE',
    },
  })

  const currentAmount = watch('amount')
  const currentPaymentMethod = watch('paymentMethod')

  const handleAmountClick = (val: number) => {
    setCustomAmountActive(false)
    setValue('amount', val, { shouldValidate: true })
  }

  const onSubmit = async (data: DonationInput) => {
    setLoading(true)
    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || 'Something went wrong')
      }

      if (data.paymentMethod === 'STRIPE') {
        // Redirect to mock Stripe Checkout session
        toast.info('Redirecting to secure card payment checkout...')
        if (resData.url) {
          window.location.href = resData.url
        } else {
          toast.success('Donation processed successfully (Stripe Integration Mock Mode)')
          reset()
        }
      } else {
        // Offline payment chosen
        setShowOfflineModal(true)
        reset()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit donation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Campaign Details Display (Left Side) */}
      <div className="lg:col-span-5 space-y-6 text-left">
        <label className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-2">
          Select Campaign
        </label>
        <div className="space-y-3">
          {campaigns.map((camp) => (
            <button
              key={camp.id}
              type="button"
              onClick={() => {
                setSelectedCampaignId(camp.id)
                setValue('campaignId', camp.id)
              }}
              className={`w-full p-4 rounded text-left transition-all border ${
                selectedCampaignId === camp.id
                  ? 'bg-gold-500/10 border-gold-500 shadow-md shadow-gold-500/10'
                  : 'bg-black/20 border-gold-500/15 hover:border-gold-500/30'
              }`}
            >
              <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
                {camp.title}
              </h4>
              <p className="text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed">
                {camp.description}
              </p>
              
              {/* Progress Bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[10px] text-white/50 font-medium">
                  <span>Raised: {formatCurrency(camp.raisedAmount)}</span>
                  <span>Goal: {formatCurrency(camp.goalAmount)}</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                    style={{ width: `${Math.min(100, (camp.raisedAmount / camp.goalAmount) * 100)}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Donation Input Fields (Right Side) */}
      <div className="lg:col-span-7 glass-panel rounded-lg p-6 sm:p-8 border border-gold-500/10 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <input type="hidden" {...register('campaignId')} />

          {/* Amount Selector */}
          <div>
            <label className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-3">
              Donation Amount <span className="text-red-400 font-bold ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {suggestedAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountClick(amt)}
                  className={`py-3 rounded font-cinzel font-bold text-sm transition-all border ${
                    currentAmount === amt && !customAmountActive
                      ? 'bg-gold-500 border-gold-500 text-[#0d0905]'
                      : 'bg-black/40 border-gold-500/20 text-white hover:border-gold-500/40'
                  }`}
                >
                  £{amt}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <span className="absolute left-4 top-3 text-white/50 text-sm font-semibold">£</span>
              <input
                type="number"
                placeholder="Enter Custom Amount"
                value={customAmountActive ? currentAmount : ''}
                onChange={(e) => {
                  setCustomAmountActive(true)
                  const val = parseFloat(e.target.value) || 0
                  setValue('amount', val, { shouldValidate: true })
                }}
                className="w-full pl-8 pr-4 py-3 bg-black/40 border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-white"
              />
            </div>
            {errors.amount && <p className="text-xs text-sunset-500 mt-1">{errors.amount.message}</p>}
          </div>

          {/* Donor Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="donorName" className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-2">
                Your Name <span className="text-red-400 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                id="donorName"
                placeholder="Jane Doe"
                {...register('donorName')}
                aria-invalid={!!errors.donorName}
                aria-describedby={errors.donorName ? 'donation-name-error' : undefined}
                className="w-full px-4 py-3 bg-black/40 border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-white"
              />
              {errors.donorName && <p id="donation-name-error" className="text-xs text-sunset-500 mt-1">{errors.donorName.message}</p>}
            </div>

            <div>
              <label htmlFor="donorEmail" className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-2">
                Email Address <span className="text-red-400 font-bold ml-0.5">*</span>
              </label>
              <input
                type="email"
                id="donorEmail"
                placeholder="jane@example.com"
                {...register('donorEmail')}
                aria-invalid={!!errors.donorEmail}
                aria-describedby={errors.donorEmail ? 'donation-email-error' : undefined}
                className="w-full px-4 py-3 bg-black/40 border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-white"
              />
              {errors.donorEmail && <p id="donation-email-error" className="text-xs text-sunset-500 mt-1">{errors.donorEmail.message}</p>}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-cinzel text-gold-400 uppercase tracking-widest mb-3">
              Payment Method *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-between p-4 rounded border cursor-pointer select-none transition-all ${
                  currentPaymentMethod === 'STRIPE'
                    ? 'bg-gold-500/10 border-gold-500'
                    : 'bg-black/40 border-gold-500/20 hover:border-gold-500/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="STRIPE"
                    {...register('paymentMethod')}
                    className="accent-gold-500"
                  />
                  <span className="text-xs font-bold font-cinzel uppercase tracking-wider text-white">Card Payment</span>
                </div>
                <span className="text-[10px] text-white/50">Stripe Secure</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded border cursor-pointer select-none transition-all ${
                  currentPaymentMethod === 'OFFLINE'
                    ? 'bg-gold-500/10 border-gold-500'
                    : 'bg-black/40 border-gold-500/20 hover:border-gold-500/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="OFFLINE"
                    {...register('paymentMethod')}
                    className="accent-gold-500"
                  />
                  <span className="text-xs font-bold font-cinzel uppercase tracking-wider text-white">Offline Bank</span>
                </div>
                <span className="text-[10px] text-white/50">Direct Deposit</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-hover w-full disabled:opacity-50 font-cinzel font-bold text-xs uppercase tracking-widest py-4 rounded shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {currentPaymentMethod === 'STRIPE' ? 'Proceed with Card Payment' : 'Submit Offline Pledge'}
            </button>
          </div>
        </form>
      </div>

      {/* Offline Payment Information Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowOfflineModal(false)} />
          <div className="glass-panel w-full max-w-lg rounded-lg border-2 border-gold-500 bg-[#0d0905] p-6 relative z-10 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gold-500/20 pb-3">
              <h3 className="font-cinzel text-lg font-bold text-gold-500 uppercase tracking-wider flex items-center gap-2">
                <Award className="h-5 w-5" />
                Offline Payment Details
              </h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Thank you for your generous pledge of **{formatCurrency(currentAmount)}** to our **{selectedCampaign?.title}** campaign!
            </p>
            <p className="text-xs text-white/70 leading-relaxed">
              To complete your offline donation, please execute a direct bank transfer (BACS) using the following banking credentials:
            </p>
            <div className="bg-black/60 border border-gold-500/20 p-4 rounded text-xs space-y-2 font-mono text-white/80">
              <p><strong className="text-gold-400">Bank Name:</strong> Barclays Bank UK</p>
              <p><strong className="text-gold-400">Account Name:</strong> TUVAA (The United Voice of African Associations)</p>
              <p><strong className="text-gold-400">Sort Code:</strong> 20-33-40</p>
              <p><strong className="text-gold-400">Account Number:</strong> 83829104</p>
              <p><strong className="text-gold-400">Reference:</strong> DONATE {selectedCampaign?.title.slice(0, 10).toUpperCase()}</p>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              * Note: Please make sure to input your reference so that our administrative team can reconcile the bank statement with your pledge and credit the campaign progress.
            </p>
            <button
              onClick={() => setShowOfflineModal(false)}
              className="btn-primary-hover w-full font-cinzel font-bold text-xs uppercase tracking-widest py-3 rounded cursor-pointer"
            >
              I Understand & Will Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
