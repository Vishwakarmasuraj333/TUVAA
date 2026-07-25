'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import CampaignForm from '@/components/admin/donation-campaigns/CampaignForm'

interface EditCampaignProps {
  params: Promise<{ id: string }>
}

export default function AdminEditDonationCampaignPage({ params }: EditCampaignProps) {
  const { id } = use(params)
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadCampaign() {
      try {
        const res = await fetch(`/api/admin/donation-campaigns/${id}`)
        if (res.ok) {
          const data = await res.json()
          setCampaign(data)
        } else {
          toast.error('Failed to load campaign details')
          router.push('/admin/donation-campaigns')
        }
      } catch (e) {
        console.error('Error fetching campaign:', e)
        toast.error('Error loading campaign')
        router.push('/admin/donation-campaigns')
      } finally {
        setLoading(false)
      }
    }
    loadCampaign()
  }, [id, router])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/donation-campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Campaign updated successfully!')
        router.push('/admin/donation-campaigns')
        router.refresh()
      } else {
        const errData = await res.json()
        toast.error(errData.message || 'Failed to update campaign.')
      }
    } catch (error) {
      console.error('Error saving campaign:', error)
      toast.error('Error saving campaign.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
      </div>
    )
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
          Edit Campaign
        </h1>
      </div>

      {/* Form */}
      {campaign && (
        <CampaignForm
          initialData={campaign}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
