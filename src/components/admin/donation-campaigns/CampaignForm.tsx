'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import CloudinaryImageUpload from '@/components/admin/CloudinaryImageUpload'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and dashes only'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image path is required'),
  goalAmount: z.number().min(1, 'Goal amount must be at least £1'),
  isPublished: z.boolean(),
})

type FormInput = z.infer<typeof formSchema>

interface CampaignFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export default function CampaignForm({ initialData, onSubmit, isSubmitting }: CampaignFormProps) {
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
      description: initialData?.description || '',
      image: initialData?.image || '/images/donate-placeholder.jpg',
      goalAmount: initialData?.goalAmount || 1000,
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
          Campaign Title
        </label>
        <input
          type="text"
          {...register('title')}
          className="w-full bg-[#fdfcfb] border border-[#e8dfc8] rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f]"
          placeholder="e.g. Young People Sailing Support"
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
          placeholder="e.g. young-people-sailing-support"
        />
        {errors.slug && (
          <p className="text-xs text-red-500 font-semibold">{errors.slug.message}</p>
        )}
      </div>

      {/* Image Path with Cloudinary Upload */}
      <CloudinaryImageUpload
        value={watch('image')}
        onChange={(url) => setValue('image', url, { shouldValidate: true })}
        label="Campaign Image (Cloudinary)"
        placeholder="/images/donate-young-people.jpg"
        error={errors.image?.message}
        required
      />

      {/* Goal Amount */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-cinzel font-bold text-[#35170f] uppercase tracking-widest block">
          Goal Amount (£)
        </label>
        <input
          type="number"
          {...register('goalAmount', { valueAsNumber: true })}
          className="w-full bg-[#fdfcfb] border border-[#e8dfc8] rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f]"
          placeholder="5000"
        />
        {errors.goalAmount && (
          <p className="text-xs text-red-500 font-semibold">{errors.goalAmount.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-cinzel font-bold text-[#35170f] uppercase tracking-widest block">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={6}
          className="w-full bg-[#fdfcfb] border border-[#e8dfc8] rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] resize-none"
          placeholder="Describe what these donations will support..."
        />
        {errors.description && (
          <p className="text-xs text-red-500 font-semibold">{errors.description.message}</p>
        )}
      </div>

      {/* Published Status Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublished"
          {...register('isPublished')}
          className="h-4 w-4 border-[#e8dfc8] text-[#DB9E30] focus:ring-[#DB9E30] bg-[#fdfcfb] rounded cursor-pointer"
        />
        <label htmlFor="isPublished" className="text-xs font-bold text-[#5a5048] select-none cursor-pointer uppercase font-cinzel tracking-wider">
          Publish campaign immediately
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-hover w-full disabled:bg-zinc-300 text-white font-cinzel font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {isSubmitting ? 'Saving Campaign...' : 'Save Campaign'}
        </button>
      </div>
    </form>
  )
}
