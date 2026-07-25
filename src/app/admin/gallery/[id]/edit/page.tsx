import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import GalleryEditWrapper from './GalleryEditWrapper'

interface EditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AdminEditGalleryPage({ params }: EditPageProps) {
  const { id } = await params
  let item = null

  try {
    item = await prisma.galleryItem.findUnique({
      where: { id },
    })
  } catch (e) {
    // DB unreachable
  }

  if (!item) {
    notFound()
  }

  const mappedItem = {
    ...item,
    type: item.type as 'image' | 'video',
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
            Edit Gallery Item
          </h1>
        </div>

        {/* Form Wrapper */}
        <GalleryEditWrapper item={mappedItem} />

      </div>
    </div>
  )
}
