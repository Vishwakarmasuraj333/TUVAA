'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const CATEGORIES = ['General', 'BBAM', 'Events', 'Culture', 'Community', 'Youth', 'Services']

interface GalleryEditFormProps {
  initialData: any
  onSubmit: (data: FormData | any) => void
  isSubmitting: boolean
}

export default function GalleryEditForm({ initialData, onSubmit, isSubmitting }: GalleryEditFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [type, setType] = useState<'image' | 'video'>(initialData?.type || 'image')
  const [category, setCategory] = useState(initialData?.category || 'General')
  const [altText, setAltText] = useState(initialData?.altText || '')
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.isPublished ?? true)
  
  const [useExternalUrl, setUseExternalUrl] = useState(!!initialData?.imageUrl && !initialData?.publicId)
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || '')
  const [publicId, setPublicId] = useState(initialData?.publicId || '')

  const [replacementFile, setReplacementFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || initialData?.videoUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (replacementFile) {
      const url = URL.createObjectURL(replacementFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [replacementFile])

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()

    if (!useExternalUrl && replacementFile) {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('type', type)
      formData.append('category', category)
      formData.append('altText', altText.trim())
      formData.append('isPublished', isPublished.toString())
      formData.append('file', replacementFile)
      onSubmit(formData)
    } else {
      onSubmit({
        title: title.trim(),
        type,
        category,
        altText: altText.trim(),
        isPublished,
        imageUrl: type === 'image' ? imageUrl.trim() : thumbnailUrl.trim(),
        videoUrl: type === 'video' ? videoUrl.trim() || imageUrl.trim() : null,
        thumbnailUrl: thumbnailUrl.trim() || (type === 'video' ? videoUrl.trim() : imageUrl.trim()),
        publicId: publicId.trim() || null,
      })
    }
  }

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6 bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded-sm p-6 sm:p-8 text-left shadow-sm">
      <div className="space-y-1.5">
        <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">Item Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">Media Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'image' | 'video')}
            className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
          >
            <option value="image">Image / Photo</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 py-1">
        <input
          type="checkbox"
          id="useExternalUrl"
          checked={useExternalUrl}
          onChange={(e) => setUseExternalUrl(e.target.checked)}
          className="accent-[#DB9E30] cursor-pointer"
        />
        <label htmlFor="useExternalUrl" className="text-xs font-medium cursor-pointer text-[#35170f] dark:text-white select-none">
          Use external URL / Edit Cloudinary fields directly
        </label>
      </div>

      {!useExternalUrl ? (
        <div className="space-y-3 p-4 border border-dashed border-[#DB9E30]/40 rounded bg-[#fdfcfb] dark:bg-[#1c1510]">
          <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">Replace Media File (Optional)</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setReplacementFile(e.target.files?.[0] || null)}
            accept={type === 'image' ? 'image/jpeg,image/png,image/webp' : 'video/mp4,video/webm,video/quicktime'}
            className="w-full text-xs text-[#8b8178] dark:text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-cinzel file:bg-[#DB9E30] file:text-[#0d0905] hover:file:bg-[#DB9E30]/80 cursor-pointer"
          />
          {previewUrl && (
            <div className="w-full max-h-48 rounded overflow-hidden border border-[#e8dfc8] dark:border-[#2a211a] bg-black flex justify-center items-center">
              {type === 'image' ? (
                <img src={previewUrl} alt="Preview" className="max-h-48 object-contain" />
              ) : (
                <video src={previewUrl} controls className="max-h-48 object-contain" />
              )}
            </div>
          )}
          <p className="text-[11px] text-[#8b8178] dark:text-white/50 italic">
            Leave file input empty to keep current media asset intact.
          </p>
        </div>
      ) : (
        <div className="space-y-4 p-4 border border-[#e8dfc8] dark:border-[#2a211a] rounded bg-[#fdfcfb] dark:bg-[#1c1510]">
          <div className="space-y-1.5">
            <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">Image / Media URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2 text-xs outline-none focus:border-[#DB9E30]"
            />
          </div>
          {type === 'video' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">Video URL</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2 text-xs outline-none focus:border-[#DB9E30]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">Thumbnail URL</label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2 text-xs outline-none focus:border-[#DB9E30]"
                />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">Cloudinary Public ID</label>
            <input
              type="text"
              value={publicId}
              onChange={(e) => setPublicId(e.target.value)}
              className="w-full bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2 text-xs outline-none focus:border-[#DB9E30]"
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">Alt Text (Optional)</label>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image/video..."
          className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublished"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="accent-[#DB9E30] cursor-pointer"
        />
        <label htmlFor="isPublished" className="text-xs font-medium cursor-pointer text-[#35170f] dark:text-white select-none">
          Publish this item immediately
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest w-full py-3.5 rounded shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Updating Gallery Item...' : 'Update Gallery Item'}
        </button>
      </div>
    </form>
  )
}
