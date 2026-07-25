'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import GalleryEditForm from '@/components/admin/gallery/GalleryEditForm'

interface GalleryEditWrapperProps {
  item: {
    id: string
    title: string
    type: 'image' | 'video'
    imageUrl: string | null
    videoUrl: string | null
    thumbnailUrl: string | null
    publicId: string | null
    category: string | null
    altText: string | null
    isPublished: boolean
  }
}

export default function GalleryEditWrapper({ item }: GalleryEditWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData | any) => {
    setIsSubmitting(true)
    try {
      const isFormData = data instanceof FormData
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PATCH',
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? data : JSON.stringify(data),
      })

      const resData = await res.json()

      if (res.ok && resData.success !== false) {
        toast.success(resData.message || 'Gallery item updated successfully.')
        router.push('/admin/gallery')
        router.refresh()
      } else {
        toast.error(resData.message || 'Failed to update gallery item.')
      }
    } catch (error: any) {
      console.error(error)
      toast.error('Error updating gallery item.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <GalleryEditForm
      initialData={item}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
