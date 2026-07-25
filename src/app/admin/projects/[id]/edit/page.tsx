'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ProjectForm from '@/components/admin/projects/ProjectForm'

interface EditProjectProps {
  params: Promise<{ id: string }>
}

export default function AdminEditProjectPage({ params }: EditProjectProps) {
  const { id } = use(params)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/admin/projects/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data)
        } else {
          toast.error('Failed to load project details')
          router.push('/admin/projects')
        }
      } catch (e) {
        console.error('Error fetching project:', e)
        toast.error('Error loading project')
        router.push('/admin/projects')
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [id, router])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        toast.success('Project updated successfully!')
        router.push('/admin/projects')
        router.refresh()
      } else {
        const errData = await res.json()
        toast.error(errData.message || 'Failed to update project.')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Error saving project.')
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
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
        </Link>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
          Edit Project
        </h1>
      </div>

      {/* Form */}
      {project && (
        <ProjectForm
          initialData={project}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
