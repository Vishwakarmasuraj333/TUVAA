'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import ProjectForm from '@/components/admin/projects/ProjectForm'

export default function AdminNewProjectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Project created successfully!')
        router.push('/admin/projects')
        router.refresh()
      } else {
        const errData = await res.json()
        toast.error(errData.message || 'Failed to create project.')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Error creating project.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left pb-10">
      {/* Back Link & Header */}
      <div className="space-y-2">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
        </Link>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
          Create Project
        </h1>
      </div>

      {/* Form */}
      <ProjectForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
