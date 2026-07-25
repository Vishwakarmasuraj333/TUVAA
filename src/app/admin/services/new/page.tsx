'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import ServiceForm from '@/components/admin/services/ServiceForm'

export default function AdminNewServicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Service created successfully!')
        router.push('/admin/services')
        router.refresh()
      } else {
        const errData = await res.json()
        toast.error(errData.message || 'Failed to create service.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error creating service.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0905] text-white p-6 sm:p-12">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Back Link & Header */}
        <div className="space-y-2 text-left">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-gold-500 hover:text-gold-400 uppercase tracking-widest"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Services
          </Link>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wider text-gold-400">
            Create Service
          </h1>
        </div>

        {/* Reusable Form */}
        <ServiceForm onSubmit={onSubmit} isSubmitting={isSubmitting} />

      </div>
    </div>
  )
}
