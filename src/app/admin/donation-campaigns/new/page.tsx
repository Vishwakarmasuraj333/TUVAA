'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import CampaignForm from '@/components/admin/donation-campaigns/CampaignForm'

export default function AdminNewDonationCampaignPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/donation-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Campaign created successfully!')
        router.push('/admin/donation-campaigns')
        router.refresh()
      } else {
        const errData = await res.json()
        toast.error(errData.message || 'Failed to create campaign.')
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast.error('Error creating campaign.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left pb-10">
      {/* Back Link & Header */}
      <div className="space-y-2">
        <Link
          href="/admin/donation-campaigns"
          className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Campaigns
        </Link>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] uppercase tracking-wider">
          Create Campaign
        </h1>
      </div>

      {/* Form */}
      <CampaignForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
