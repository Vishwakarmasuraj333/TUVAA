'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import GalleryForm from '@/components/admin/gallery/GalleryForm'

export default function AdminNewGalleryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData | any) => {
    setIsSubmitting(true)
    try {
      // If it's a FormData (has file), use upload API. Otherwise (external URL), use standard API.
      const isExternal = !(data instanceof FormData)
      
      const endpoint = isExternal ? '/api/admin/gallery' : '/api/admin/gallery/upload'
      const headers = isExternal ? { 'Content-Type': 'application/json' } : undefined
      const body = isExternal ? JSON.stringify(data) : data

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body,
      })

      if (res.ok) {
        toast.success('Gallery item added successfully!')
        router.push('/admin/gallery')
        router.refresh()
      } else {
        const errData = await res.json()
        toast.error(errData.error || 'Failed to add gallery item.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error saving gallery item.')
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
            href="/admin/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-gold-500 hover:text-gold-400 uppercase tracking-widest"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Gallery
          </Link>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wider text-gold-400">
            Add Gallery Item
          </h1>
        </div>

        {/* Form */}
        <GalleryForm onSubmit={onSubmit} isSubmitting={isSubmitting} />

      </div>
    </div>
  )
}
