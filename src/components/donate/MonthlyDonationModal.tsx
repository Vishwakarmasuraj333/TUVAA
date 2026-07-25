'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

interface MonthlyDonationModalProps {
  onClose: () => void
}

export default function MonthlyDonationModal({ onClose }: MonthlyDonationModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [monthlyAmount, setMonthlyAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'Stripe Payment' | 'Offline Donation'>('Stripe Payment')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const validate = () => {
    if (!fullName.trim() || fullName.trim().length < 2) return 'Full name is required.'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'A valid email address is required.'
    if (!monthlyAmount || parseFloat(monthlyAmount) <= 0) return 'Please enter a valid monthly amount.'
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
      const res = await fetch('/api/donate/monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          amount: parseFloat(monthlyAmount),
          startDate: startDate || undefined,
          paymentMethod: paymentMethod === 'Stripe Payment' ? 'STRIPE' : 'OFFLINE',
          message,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Something went wrong')

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
      <div className="absolute inset-0 bg-black/55" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-[#35170f] text-white rounded-full hover:bg-[#DB9E30] transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-[#f0ebe4]">
            <div className="w-10 h-[3px] bg-[#DB9E30] mb-3" />
            <h2 className="font-cinzel text-[20px] sm:text-[22px] font-bold uppercase text-[#35170f] tracking-wide">
              Monthly Donation Form
            </h2>
            <p className="text-[13px] text-[#8b8178] mt-1 leading-relaxed">
              Set up a regular monthly donation to support TUVAA's ongoing programmes and community work.
            </p>
          </div>

          {/* Success */}
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#57a68f] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="font-cinzel text-[18px] font-bold text-[#35170f] uppercase mb-2">
                Thank You!
              </h3>
              <p className="text-[14px] text-[#6b6560] leading-relaxed">
                Your monthly donation request has been received. We will be in touch shortly to confirm the arrangement.
              </p>
              <button
                onClick={onClose}
                className="btn-primary-hover mt-6 font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
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

              {/* Email */}
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

              {/* Monthly Amount */}
              <div>
                <label className="block text-[12px] font-semibold text-[#8b8178] mb-1">
                  Monthly Amount (£) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center border border-[#d9d0c7] rounded-sm overflow-hidden">
                  <span className="bg-[#DB9E30] text-white font-bold px-4 py-2.5 text-sm">£</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    placeholder="10.00"
                    className="flex-1 px-4 py-2.5 text-[14px] text-[#35170f] font-semibold focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-[12px] font-semibold text-[#8b8178] mb-1">
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-[#d9d0c7] rounded-sm px-3 py-2.5 text-[14px] text-[#35170f] focus:outline-none focus:border-[#DB9E30] transition-colors"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[12px] font-semibold text-[#8b8178] mb-2">
                  Payment Method
                </label>
                <div className="flex gap-6">
                  {(['Stripe Payment', 'Offline Donation'] as const).map((method) => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="monthlyPayment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="accent-[#DB9E30] w-4 h-4"
                      />
                      <span className="text-[13px] text-[#35170f]">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[12px] font-semibold text-[#8b8178] mb-1">
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full border border-[#d9d0c7] rounded-sm px-3 py-2.5 text-[14px] text-[#35170f] focus:outline-none focus:border-[#DB9E30] transition-colors resize-none"
                />
              </div>

              {/* Error */}
              {status === 'error' && (
                <p className="text-red-600 text-sm font-medium">⚠ {errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-hover w-full flex items-center justify-center gap-2 font-cinzel font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm cursor-pointer disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Submitting...' : 'Submit Monthly Donation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
