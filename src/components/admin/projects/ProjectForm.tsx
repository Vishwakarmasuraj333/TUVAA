'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().min(1, 'Image path is required'),
  order: z.number().min(0, 'Order must be non-negative'),
  isPublished: z.boolean(),
})

type FormInput = z.infer<typeof formSchema>

interface ProjectFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function ProjectForm({ initialData, onSubmit, isSubmitting }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      image: initialData?.image || '/images/project-placeholder.jpg',
      order: initialData?.order ?? 0,
      isPublished: initialData?.isPublished ?? true,
    },
  })

  const titleValue = watch('title')

  // Auto slug generation helper
  useEffect(() => {
    if (!initialData && titleValue) {
      const generated = titleValue
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', generated, { shouldValidate: true })
    }
  }, [titleValue, setValue, initialData])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-white border border-[#e8dfc8] rounded-sm p-6 sm:p-10 text-left shadow-sm">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-cinzel font-bold text-[#35170f] uppercase tracking-widest block">
          Project Title
        </label>
        <input
          type="text"
          {...register('title')}
          className="w-full bg-[#fdfcfb] border border-[#e8dfc8] rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f]"
          placeholder="e.g. Youth Sailing Initiative"
        />
        {errors.title && (
          <p className="text-xs text-red-500 font-semibold">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-cinzel font-bold text-[#35170f] uppercase tracking-widest block">
          Slug
        </label>
        <input
          type="text"
          {...register('slug')}
          className="w-full bg-[#fdfcfb] border border-[#e8dfc8] rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f]"
          placeholder="e.g. youth-sailing-initiative"
        />
        {errors.slug && (
          <p className="text-xs text-red-500 font-semibold">{errors.slug.message}</p>
        )}
      </div>

      {/* Image Path */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-cinzel font-bold text-[#35170f] uppercase tracking-widest block">
          Image Path / URL
        </label>
        <input
          type="text"
          {...register('image')}
          className="w-full bg-[#fdfcfb] border border-[#e8dfc8] rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f]"
          placeholder="/images/project-banner.jpg"
        />
        {errors.image && (
          <p className="text-xs text-red-500 font-semibold">{errors.image.message}</p>
        )}
      </div>

      {/* Sort Order */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-cinzel font-bold text-[#35170f] uppercase tracking-widest block">
          Sort Order
        </label>
        <input
          type="number"
          {...register('order', { valueAsNumber: true })}
          className="w-full bg-[#fdfcfb] border border-[#e8dfc8] rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f]"
          placeholder="0"
        />
        {errors.order && (
          <p className="text-xs text-red-500 font-semibold">{errors.order.message}</p>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-cinzel font-bold text-[#35170f] uppercase tracking-widest block">
          Excerpt / Short Summary
        </label>
        <textarea
          {...register('excerpt')}
          rows={3}
          className="w-full bg-[#fdfcfb] border border-[#e8dfc8] rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] resize-none"
          placeholder="Brief overview summary for grid..."
        />
        {errors.excerpt && (
          <p className="text-xs text-red-500 font-semibold">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-cinzel font-bold text-[#35170f] uppercase tracking-widest block">
          Detailed content
        </label>
        <textarea
          {...register('content')}
          rows={8}
          className="w-full bg-[#fdfcfb] border border-[#e8dfc8] rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] resize-none"
          placeholder="Full detailed project description..."
        />
        {errors.content && (
          <p className="text-xs text-red-500 font-semibold">{errors.content.message}</p>
        )}
      </div>

      {/* Published Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublished"
          {...register('isPublished')}
          className="h-4 w-4 border-[#e8dfc8] text-[#DB9E30] focus:ring-[#DB9E30] bg-[#fdfcfb] rounded cursor-pointer"
        />
        <label htmlFor="isPublished" className="text-xs font-bold text-[#5a5048] select-none cursor-pointer uppercase font-cinzel tracking-wider">
          Publish this project immediately
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-hover w-full disabled:bg-zinc-300 text-white font-cinzel font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {isSubmitting ? 'Saving Project...' : 'Save Project'}
        </button>
      </div>
    </form>
  )
}
