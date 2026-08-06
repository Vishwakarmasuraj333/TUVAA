'use client'

import { useState, useRef } from 'react'
import { UploadCloud, Loader2, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface CloudinaryImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
}

export default function CloudinaryImageUpload({
  value,
  onChange,
  label = 'IMAGE PATH / URL (CLOUDINARY)',
  placeholder = 'Select image or paste URL...',
  required = false,
  error,
}: CloudinaryImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic client validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB')
      return
    }

    setUploading(true)
    const toastId = toast.loading('Uploading image to Cloudinary...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.url) {
        onChange(data.url)
        toast.success('Image successfully uploaded to Cloudinary!', { id: toastId })
      } else {
        toast.error(data.error || 'Failed to upload image to Cloudinary', { id: toastId })
      }
    } catch (err) {
      console.error('Upload Error:', err)
      toast.error('Error connecting to Cloudinary upload service', { id: toastId })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-2 text-left">
      {label && (
        <label className="text-[10px] sm:text-xs font-cinzel font-bold text-[#DB9E30] dark:text-[#DB9E30] uppercase tracking-widest block flex items-center justify-between">
          <span>{label} {required && '*'}</span>
          <span className="text-[9px] text-[#57a68f] normal-case tracking-normal font-sans font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Cloudinary Enabled
          </span>
        </label>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Control Box: Input + Cloudinary Upload Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded px-4 py-2.5 text-xs focus:outline-none focus:border-[#DB9E30] text-[#35170f] dark:text-white transition-colors"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
              title="Clear image URL"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 bg-[#DB9E30] hover:bg-[#57a68f] disabled:opacity-50 text-white font-cinzel font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              <span>Upload to Cloudinary</span>
            </>
          )}
        </button>
      </div>

      {/* Image Preview Box */}
      {value ? (
        <div className="relative mt-3 p-2 bg-[#faf8ef] dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded flex items-center gap-3">
          <div className="relative h-14 w-20 shrink-0 bg-black/10 rounded overflow-hidden border border-gray-200 dark:border-white/10">
            <img
              src={value}
              alt="Cloudinary Image Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
          </div>
          <div className="overflow-hidden flex-grow text-xs">
            <p className="font-bold text-[#35170f] dark:text-white truncate">{value}</p>
            <p className="text-[10px] text-[#57a68f] font-medium mt-0.5">
              {value.includes('cloudinary') ? 'Hosted on Cloudinary CDN' : 'External / Local Path'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
            title="Remove Image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <p className="text-[10px] text-gray-500 dark:text-white/40 italic">
          Click <strong>Upload to Cloudinary</strong> to select a file from your computer, or paste an image URL.
        </p>
      )}

      {error && <p className="text-xs text-red-500 font-semibold mt-1">{error}</p>}
    </div>
  )
}
