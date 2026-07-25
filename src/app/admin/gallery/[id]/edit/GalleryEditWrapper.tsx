'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import GalleryForm from '@/components/admin/gallery/GalleryForm'

interface GalleryEditWrapperProps {
  item: {
    id: string
    title: string
    type: 'image' | 'video'
    imageUrl: string | null
    videoUrl: string | null
    thumbnailUrl: string | null
    category: string | null
    isPublished: boolean
  }
}

export default function GalleryEditWrapper({ item }: GalleryEditWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Gallery item updated successfully!')
        router.push('/admin/gallery')
        router.refresh()
      } else {
        const errData = await res.json()
        toast.error(errData.message || 'Failed to update gallery item.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error updating gallery item.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GalleryForm
      initialData={item}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
