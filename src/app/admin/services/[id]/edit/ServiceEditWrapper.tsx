'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ServiceForm from '@/components/admin/services/ServiceForm'

interface ServiceEditWrapperProps {
  service: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string | null
    image: string
    publishedAt: Date
    isPublished: boolean
  }
}

export default function ServiceEditWrapper({ service }: ServiceEditWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/services/${service.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Service updated successfully!')
        router.push('/admin/services')
        router.refresh()
      } else {
        const errData = await res.json()
        toast.error(errData.message || 'Failed to update service.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error updating service.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ServiceForm
      initialData={service}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
