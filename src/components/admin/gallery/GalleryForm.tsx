'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['image', 'video']),
  category: z.string().optional().nullable(),
  isPublished: z.boolean(),
  altText: z.string().optional().nullable(),
  // For external URL mode
  useExternalUrl: z.boolean().optional(),
  imageUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  publicId: z.string().optional().nullable(),
})

type FormInput = z.infer<typeof formSchema>

interface GalleryFormProps {
  initialData?: any
  onSubmit: (data: FormData | any) => void
  isSubmitting: boolean
}

export default function GalleryForm({ initialData, onSubmit, isSubmitting }: GalleryFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || 'image',
      category: initialData?.category || 'General',
      isPublished: initialData?.isPublished ?? true,
      altText: initialData?.altText || '',
      useExternalUrl: !!initialData?.imageUrl && !initialData?.publicId,
      imageUrl: initialData?.imageUrl || '',
      videoUrl: initialData?.videoUrl || '',
      thumbnailUrl: initialData?.thumbnailUrl || '',
      publicId: initialData?.publicId || '',
    },
  })

  const typeValue = watch('type')
  const useExternalUrl = watch('useExternalUrl')

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const onFormSubmit = (data: FormInput) => {
    // If not using external URL and we are creating a new item, we need a file
    if (!useExternalUrl && !initialData && !file) {
      alert("Please select a file to upload.")
      return
    }

    if (!useExternalUrl && file) {
      // Real upload (FormData)
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('type', data.type)
      if (data.category) formData.append('category', data.category)
      if (data.altText) formData.append('altText', data.altText)
      formData.append('isPublished', data.isPublished.toString())
      formData.append('file', file)
      onSubmit(formData)
    } else {
      // Manual/Edit update without file upload (JSON)
      onSubmit({
        ...data,
        // In edit mode without a new file, we don't send a file
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-2xl mx-auto bg-zinc-900 border border-gold-500/20 rounded-md p-6 sm:p-10 text-left text-white shadow-xl">
      <div className="space-y-1.5">
        <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">Item Title</label>
        <input type="text" {...register('title')} className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm outline-none focus:border-gold-400" placeholder="e.g. BBAM Festival Culture" />
        {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">Type</label>
          <select {...register('type')} className="w-full bg-zinc-950 border border-gold-500/20 rounded px-4 py-2.5 text-sm outline-none focus:border-gold-400">
            <option value="image">Image / Photo</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">Category</label>
          <select {...register('category')} className="w-full bg-zinc-950 border border-gold-500/20 rounded px-4 py-2.5 text-sm outline-none focus:border-gold-400">
            <option value="General">General</option>
            <option value="BBAM">BBAM</option>
            <option value="Events">Events</option>
            <option value="Culture">Culture</option>
            <option value="Community">Community</option>
            <option value="Youth">Youth</option>
            <option value="Services">Services</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 py-2">
        <input type="checkbox" id="useExternalUrl" {...register('useExternalUrl')} className="h-4 w-4 accent-gold-500" />
        <label htmlFor="useExternalUrl" className="text-sm font-medium">Use external URL (or recover Cloudinary upload)</label>
      </div>

      {!useExternalUrl ? (
        <div className="space-y-4 p-4 border border-dashed border-gold-500/30 rounded bg-black/20">
          <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">Upload Media File</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept={typeValue === 'image' ? "image/jpeg,image/png,image/webp" : "video/mp4,video/webm,video/quicktime"}
            className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-cinzel file:bg-gold-500 file:text-black hover:file:bg-gold-400"
          />
          {previewUrl && typeValue === 'image' && (
            <img src={previewUrl} alt="Preview" className="w-full max-h-48 object-contain rounded mt-2 border border-white/10" />
          )}
          {previewUrl && typeValue === 'video' && (
            <video src={previewUrl} controls className="w-full max-h-48 object-contain rounded mt-2 border border-white/10" />
          )}
          {initialData && !file && (
            <p className="text-xs text-zinc-400 italic">Leave empty to keep current media.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4 p-4 border border-gold-500/20 rounded bg-black/20">
          <div className="space-y-1.5">
            <label className="text-xs font-cinzel text-gold-400 uppercase tracking-widest block">External URL (Image or Video)</label>
            <input type="text" {...register('imageUrl')} className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm outline-none" placeholder="https://..." />
          </div>
          {typeValue === 'video' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel text-gold-400 uppercase tracking-widest block">Video URL (if different)</label>
                <input type="text" {...register('videoUrl')} className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm outline-none" placeholder="YouTube URL or MP4" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel text-gold-400 uppercase tracking-widest block">Video Thumbnail URL</label>
                <input type="text" {...register('thumbnailUrl')} className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm outline-none" />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-cinzel text-gold-400 uppercase tracking-widest block">Cloudinary Public ID (For Deletion)</label>
            <input type="text" {...register('publicId')} className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm outline-none" placeholder="e.g. tuvaa/gallery/abcd123" />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-cinzel font-bold text-gold-400 uppercase tracking-widest block">Alt Text (Optional)</label>
        <input type="text" {...register('altText')} className="w-full bg-black/40 border border-gold-500/20 rounded px-4 py-2.5 text-sm outline-none focus:border-gold-400" placeholder="Describe the image..." />
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="isPublished" {...register('isPublished')} className="h-4 w-4 accent-gold-500" />
        <label htmlFor="isPublished" className="text-sm font-medium">Publish this item immediately</label>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={isSubmitting} className="w-full bg-gold-600 hover:bg-gold-500 disabled:bg-zinc-700 text-black font-cinzel font-bold text-xs uppercase tracking-widest py-3.5 rounded transition-all active:scale-95">
          {isSubmitting ? (typeValue === 'video' && !useExternalUrl ? 'Uploading video, please wait...' : 'Saving...') : 'Save Gallery Item'}
        </button>
      </div>
    </form>
  )
}
