'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Campaign } from '@/data/donationCampaigns'

interface DonationModalProps {
  campaign: Campaign
  onClose: () => void
}

const PRESET_AMOUNTS = [10, 20, 50, 100]

export default function DonationModal({ campaign, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<number>(10)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'Stripe Payment' | 'Offline Donation'>('Stripe Payment')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showOfflineInfo, setShowOfflineInfo] = useState(false)

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const finalAmount = isCustom ? parseFloat(customAmount) || 0 : amount

  const progressPct = Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100)

  const handlePreset = (val: number) => {
    setAmount(val)
    setIsCustom(false)
    setCustomAmount('')
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setIsCustom(true)
  }

  const validate = () => {
    if (!finalAmount || finalAmount <= 0) return 'Please enter a valid donation amount.'
    if (!fullName.trim() || fullName.trim().length < 2) return 'Full name is required.'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'A valid email address is required.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) { setErrorMsg(err); setStatus('error'); return }

    setLoading(true)
    setStatus('idle')
    setErrorMsg('')

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.slug,
          donorName: fullName,
          donorEmail: email,
          amount: finalAmount,
          paymentMethod: paymentMethod === 'Stripe Payment' ? 'STRIPE' : 'OFFLINE',
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Something went wrong')

      if (paymentMethod === 'Stripe Payment' && data.url) {
        window.location.href = data.url
        return
      }

      if (paymentMethod === 'Offline Donation') {
        setShowOfflineInfo(true)
        return
      }

      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white w-full max-w-[760px] max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-[#35170f] text-white rounded-full hover:bg-[#DB9E30] transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header: image + title + progress */}
          <div className="flex items-start gap-4 mb-5">
            <div className="flex-shrink-0 overflow-hidden rounded-sm" style={{ width: 100, height: 75 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campaign.image}
                alt={campaign.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-cinzel text-[16px] sm:text-[18px] font-bold uppercase text-[#35170f] leading-snug mb-1">
                {campaign.title}
              </h2>
              <p className="text-[13px] text-[#6b6560] mb-2">
                £{campaign.raisedAmount.toFixed(2)} of £{campaign.goalAmount.toLocaleString()} raised
              </p>
              {/* Progress */}
              <div className="w-full h-[7px] bg-[#e3e8e3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#68bd73] rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Full description */}
          <p className="text-[14px] text-[#6b6560] leading-[1.8] mb-6">
            {campaign.fullDescription}
          </p>

          {/* Success message */}
          {status === 'success' && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm font-semibold">
              ✅ Thank you for your donation! We truly appreciate your generosity.
            </div>
          )}

          {/* Offline info */}
          {showOfflineInfo && (
            <div className="mb-5 p-5 bg-[#f7f7f5] border border-[#e8e0d4] rounded space-y-3">
              <h4 className="font-cinzel text-[14px] font-bold text-[#35170f] uppercase">
                Bank Transfer Details
              </h4>
              <p className="text-[13px] text-[#6b6560]">
                Thank you, <strong>{fullName}</strong>! Please transfer <strong>£{finalAmount.toFixed(2)}</strong> to:
              </p>
              <div className="text-[13px] font-mono space-y-1 text-[#35170f]">
                <p><span className="font-bold">Bank:</span> Barclays Bank UK</p>
                <p><span className="font-bold">Account Name:</span> TUVAA</p>
                <p><span className="font-bold">Sort Code:</span> 20-33-40</p>
                <p><span className="font-bold">Account No:</span> 83829104</p>
                <p><span className="font-bold">Reference:</span> DONATE {campaign.title.slice(0, 10)}</p>
              </div>
              <button
                onClick={onClose}
                className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm cursor-pointer mt-2"
              >
                I Understand & Will Transfer
              </button>
            </div>
          )}

          {!showOfflineInfo && status !== 'success' && (
            <form onSubmit={handleSubmit} noValidate>
              {/* Amount */}
              <div className="mb-5">
                <div className="relative flex items-center border border-[#d9d0c7] rounded-sm overflow-hidden mb-4">
                  <span className="bg-[#DB9E30] text-white font-bold px-4 py-3 text-sm">£</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={isCustom ? customAmount : amount}
                    onChange={handleCustomChange}
                    onFocus={() => setIsCustom(true)}
                    className="flex-1 px-4 py-3 text-[15px] text-[#35170f] font-semibold focus:outline-none bg-white"
                    placeholder="10.00"
                  />
                </div>

                {/* Preset Buttons */}
                <div className="flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePreset(amt)}
                      className={`px-4 py-1.5 text-sm font-semibold rounded-sm border transition-all duration-200 ${
                        !isCustom && amount === amt
                          ? 'bg-[#DB9E30] text-white border-[#DB9E30]'
                          : 'bg-white text-[#35170f] border-[#d9d0c7] hover:border-[#DB9E30] hover:text-[#DB9E30]'
                      }`}
                    >
                      £{amt.toFixed(2)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setIsCustom(true); setCustomAmount('') }}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-sm border transition-all duration-200 ${
                      isCustom
                        ? 'bg-[#DB9E30] text-white border-[#DB9E30]'
                        : 'bg-white text-[#35170f] border-[#d9d0c7] hover:border-[#DB9E30]'
                    }`}
                  >
                    Other
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-5">
                <h3 className="font-cinzel text-[13px] font-bold uppercase tracking-wider text-[#35170f] mb-3">
                  Select Payment Method
                </h3>
                <div className="flex flex-wrap gap-4">
                  {(['Stripe Payment', 'Offline Donation'] as const).map((method) => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="accent-[#DB9E30] w-4 h-4"
                      />
                      <span className="text-[14px] text-[#35170f] font-medium">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
              <div className="mb-5">
                <h3 className="font-cinzel text-[13px] font-bold uppercase tracking-wider text-[#35170f] mb-3">
                  Personal Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#8b8178] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full border border-[#d9d0c7] rounded-sm px-3 py-2.5 text-[14px] text-[#35170f] focus:outline-none focus:border-[#DB9E30] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#8b8178] mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full border border-[#d9d0c7] rounded-sm px-3 py-2.5 text-[14px] text-[#35170f] focus:outline-none focus:border-[#DB9E30] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#8b8178] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full border border-[#d9d0c7] rounded-sm px-3 py-2.5 text-[14px] text-[#35170f] focus:outline-none focus:border-[#DB9E30] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#8b8178] mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                      className="w-full border border-[#d9d0c7] rounded-sm px-3 py-2.5 text-[14px] text-[#35170f] focus:outline-none focus:border-[#DB9E30] transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[12px] font-semibold text-[#8b8178] mb-1">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Leave a message (optional)"
                      rows={3}
                      className="w-full border border-[#d9d0c7] rounded-sm px-3 py-2.5 text-[14px] text-[#35170f] focus:outline-none focus:border-[#DB9E30] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {status === 'error' && (
                <p className="text-red-600 text-sm mb-4 font-medium">⚠ {errorMsg}</p>
              )}

              {/* Donation total + submit */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-[#f0ebe4]">
                <div className="flex items-center gap-3 bg-[#57a68f] text-white rounded-sm px-5 py-3 text-sm font-semibold">
                  <span className="font-cinzel text-xs uppercase tracking-wider">Donation Total:</span>
                  <span className="font-bold text-[16px]">£{finalAmount > 0 ? finalAmount.toFixed(2) : '0.00'}</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-hover flex-1 sm:flex-none flex items-center justify-center gap-2 font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm shadow cursor-pointer disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Processing...' : 'Donate Now'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
