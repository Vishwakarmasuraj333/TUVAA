'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import CloudinaryImageUpload from '@/components/admin/CloudinaryImageUpload'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().min(1, 'Image path is required'),
  publishedAt: z.string().min(1, 'Published date is required'),
  isPublished: z.boolean(),
})

type FormInput = z.infer<typeof formSchema>

interface ServiceFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function ServiceForm({ initialData, onSubmit, isSubmitting }: ServiceFormProps) {
  // Format Date to YYYY-MM-DD for standard input date picker
  const getFormattedDate = (dateVal: any) => {
    if (!dateVal) return ''
    const d = new Date(dateVal)
    return d.toISOString().split('T')[0]
  }

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
      image: initialData?.image || '/images/event-placeholder.jpg',
      publishedAt: getFormattedDate(initialData?.publishedAt) || new Date().toISOString().split('T')[0],
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-zinc-900 border border-gold-500/20 rounded-md p-6 sm:p-10 text-left text-white shadow-xl">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">
          Service Title
        </label>
        <input
          type="text"
          {...register('title')}
          className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-colors"
          placeholder="e.g. Health and Wellbeing Information"
        />
        {errors.title && (
          <p className="text-xs text-red-400 font-medium">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">
          Slug
        </label>
        <input
          type="text"
          {...register('slug')}
          className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-colors"
          placeholder="e.g. health-and-wellbeing-information"
        />
        {errors.slug && (
          <p className="text-xs text-red-400 font-medium">{errors.slug.message}</p>
        )}
      </div>

      {/* Image Path with Cloudinary Upload */}
      <CloudinaryImageUpload
        value={watch('image')}
        onChange={(url) => setValue('image', url, { shouldValidate: true })}
        label="Service Image (Cloudinary)"
        placeholder="/images/event-placeholder.jpg"
        error={errors.image?.message}
        required
      />

      {/* Published Date */}
      <div className="space-y-1.5">
        <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">
          Publish Date
        </label>
        <input
          type="date"
          {...register('publishedAt')}
          className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-colors"
        />
        {errors.publishedAt && (
          <p className="text-xs text-red-400 font-medium">{errors.publishedAt.message}</p>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5">
        <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">
          Excerpt / Short Summary
        </label>
        <textarea
          {...register('excerpt')}
          rows={3}
          className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-colors resize-none"
          placeholder="Brief description for grid listings..."
        />
        {errors.excerpt && (
          <p className="text-xs text-red-400 font-medium">{errors.excerpt.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">
          Detailed Content
        </label>
        <textarea
          {...register('content')}
          rows={8}
          className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-colors resize-none"
          placeholder="Full detailed text of the service..."
        />
        {errors.content && (
          <p className="text-xs text-red-400 font-medium">{errors.content.message}</p>
        )}
      </div>

      {/* Published Status Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublished"
          {...register('isPublished')}
          className="h-4 w-4 border-gold-500/20 text-[#DB9E30] focus:ring-[#DB9E30] bg-black/40 rounded cursor-pointer"
        />
        <label htmlFor="isPublished" className="text-sm font-medium text-white/90 select-none cursor-pointer">
          Publish this service immediately
        </label>
      </div>

      {/* Submit Action */}
      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-grow bg-gold-600 hover:bg-gold-500 disabled:bg-zinc-700 text-[#0d0905] font-cinzel font-bold text-xs uppercase tracking-widest py-3.5 rounded transition-all active:scale-95 cursor-pointer"
        >
          {isSubmitting ? 'Saving...' : 'Save Service'}
        </button>
      </div>
    </form>
  )
}
