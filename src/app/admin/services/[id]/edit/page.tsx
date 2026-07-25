import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ServiceEditWrapper from './ServiceEditWrapper'

interface EditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AdminEditServicePage({ params }: EditPageProps) {
  const { id } = await params
  let service = null

  try {
    service = await prisma.service.findUnique({
      where: { id },
    })
  } catch (e) {
    // DB unreachable
  }

  if (!service) {
    notFound()
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
            Edit Service
          </h1>
        </div>

        {/* Client Wrapper to Handle Submission */}
        <ServiceEditWrapper service={service} />

      </div>
    </div>
  )
}
