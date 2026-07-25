'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  UploadCloud,
  Link as LinkIcon,
  X,
  FileImage,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from 'lucide-react'
import { toast } from 'sonner'

interface SelectedFileItem {
  id: string
  file: File
  type: 'image' | 'video'
  title: string
  category: string
  altText: string
  previewUrl: string
  sizeFormatted: string
  status: 'ready' | 'uploading' | 'uploaded' | 'failed'
  errorMsg?: string
}

const CATEGORIES = ['General', 'BBAM', 'Events', 'Culture', 'Community', 'Youth', 'Services']

export default function AdminNewGalleryPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [mode, setMode] = useState<'upload' | 'external'>('upload')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Upload Mode State
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([])
  const [commonCategory, setCommonCategory] = useState<string>('General')
  const [commonAltText, setCommonAltText] = useState<string>('')
  const [publishImmediately, setPublishImmediately] = useState<boolean>(true)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 })

  // External URL Mode State
  const [extTitle, setExtTitle] = useState('')
  const [extType, setExtType] = useState<'image' | 'video'>('image')
  const [extCategory, setExtCategory] = useState('General')
  const [extUrl, setExtUrl] = useState('')
  const [extVideoUrl, setExtVideoUrl] = useState('')
  const [extThumbnailUrl, setExtThumbnailUrl] = useState('')
  const [extPublicId, setExtPublicId] = useState('')
  const [extAltText, setExtAltText] = useState('')
  const [extPublish, setExtPublish] = useState(true)
  const [isSubmittingExt, setIsSubmittingExt] = useState(false)

  const isTester = currentUser?.role === 'tester'

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user)
      })
      .catch(console.error)
      .finally(() => setLoadingAuth(false))
  }, [])

  // Helper to format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Handle File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newItems: SelectedFileItem[] = []

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/')
      const detectedType: 'image' | 'video' = isVideo ? 'video' : 'image'

      // Generate clean title from filename (e.g. bbam-festival-culture.jpg -> BBAM Festival Culture)
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())

      const previewUrl = URL.createObjectURL(file)

      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        type: detectedType,
        title: cleanTitle,
        category: commonCategory,
        altText: commonAltText,
        previewUrl,
        sizeFormatted: formatBytes(file.size),
        status: 'ready',
      })
    })

    setSelectedFiles((prev) => [...prev, ...newItems])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Remove file from queue
  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  // Update specific item metadata
  const handleUpdateItem = (id: string, key: keyof SelectedFileItem, value: any) => {
    setSelectedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    )
  }

  // Update all items category
  const handleApplyCommonCategory = (cat: string) => {
    setCommonCategory(cat)
    setSelectedFiles((prev) => prev.map((item) => ({ ...item, category: cat })))
  }

  // Submit Upload Mode
  const handleUploadAll = async () => {
    if (isTester) {
      toast.error('Read-only users cannot perform this action.')
      return
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload.')
      return
    }

    setIsUploading(true)
    setUploadProgress({ current: 0, total: selectedFiles.length })

    const formData = new FormData()
    const metadataList: any[] = []

    selectedFiles.forEach((item) => {
      formData.append('files', item.file)
      metadataList.push({
        title: item.title,
        type: item.type,
        category: item.category,
        altText: item.altText,
        isPublished: publishImmediately,
      })
    })

    formData.append('metadata', JSON.stringify(metadataList))

    try {
      // Set status to uploading
      setSelectedFiles((prev) => prev.map((i) => ({ ...i, status: 'uploading' })))

      const res = await fetch('/api/admin/gallery/bulk-upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(data.message || 'Gallery items uploaded successfully.')
        setSelectedFiles((prev) => prev.map((i) => ({ ...i, status: 'uploaded' })))
        setTimeout(() => {
          router.push('/admin/gallery')
          router.refresh()
        }, 1200)
      } else {
        toast.error(data.message || 'Failed to upload gallery items.')
        if (data.failedItems && Array.isArray(data.failedItems)) {
          setSelectedFiles((prev) =>
            prev.map((item) => {
              const failed = data.failedItems.find((f: any) => f.file === item.file.name)
              if (failed) {
                return { ...item, status: 'failed', errorMsg: failed.reason }
              }
              return { ...item, status: 'uploaded' }
            })
          )
        } else {
          setSelectedFiles((prev) => prev.map((i) => ({ ...i, status: 'failed' })))
        }
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Error executing upload.')
      setSelectedFiles((prev) => prev.map((i) => ({ ...i, status: 'failed' })))
    } finally {
      setIsUploading(false)
    }
  }

  // Submit External Mode
  const handleSaveExternal = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isTester) {
      toast.error('Read-only users cannot perform this action.')
      return
    }

    if (!extTitle.trim()) {
      toast.error('Item title is required.')
      return
    }
    if (!extUrl.trim()) {
      toast.error('External URL is required.')
      return
    }

    setIsSubmittingExt(true)
    try {
      const payload = {
        title: extTitle.trim(),
        type: extType,
        imageUrl: extType === 'image' ? extUrl.trim() : extThumbnailUrl.trim() || extUrl.trim(),
        videoUrl: extType === 'video' ? extVideoUrl.trim() || extUrl.trim() : null,
        thumbnailUrl: extThumbnailUrl.trim() || (extType === 'video' ? extUrl.trim() : null),
        publicId: extPublicId.trim() || null,
        category: extCategory,
        altText: extAltText.trim(),
        isPublished: extPublish,
      }

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.success !== false) {
        toast.success(data.message || 'Gallery item saved successfully!')
        router.push('/admin/gallery')
        router.refresh()
      } else {
        toast.error(data.message || 'Failed to save gallery item.')
      }
    } catch (error: any) {
      console.error(error)
      toast.error('Error saving external gallery item.')
    } finally {
      setIsSubmittingExt(false)
    }
  }

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-[#DB9E30]" />
      </div>
    )
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e8dfc8]/50 dark:border-[#2a211a] pb-5">
        <div className="space-y-1">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Gallery
          </Link>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#35170f] dark:text-white uppercase tracking-wider">
            Add Gallery Items
          </h1>
        </div>

        {isTester && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-cinzel text-xs font-bold uppercase tracking-widest rounded-sm">
            <ShieldAlert className="w-3.5 h-3.5" /> Read Only Mode
          </span>
        )}
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex bg-[#f7f3e8] dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] rounded p-1 max-w-md">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 py-2.5 px-4 text-xs font-cinzel font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'upload'
              ? 'bg-[#DB9E30] text-[#0d0905] shadow'
              : 'text-[#8b8178] hover:text-[#DB9E30]'
          }`}
        >
          <UploadCloud className="w-4 h-4" /> Bulk Upload Files
        </button>
        <button
          type="button"
          onClick={() => setMode('external')}
          className={`flex-1 py-2.5 px-4 text-xs font-cinzel font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'external'
              ? 'bg-[#DB9E30] text-[#0d0905] shadow'
              : 'text-[#8b8178] hover:text-[#DB9E30]'
          }`}
        >
          <LinkIcon className="w-4 h-4" /> External URL / Cloudinary Recovery
        </button>
      </div>

      {/* MODE 1: BULK FILE UPLOAD */}
      {mode === 'upload' && (
        <div className="space-y-6">
          {/* Upload Dropzone Box */}
          <div className="bg-white dark:bg-[#17110d] border-2 border-dashed border-[#DB9E30]/40 rounded-sm p-8 sm:p-12 text-center space-y-4 hover:border-[#DB9E30] transition-colors">
            <div className="w-16 h-16 rounded-full bg-[#DB9E30]/10 border border-[#DB9E30]/30 flex items-center justify-center mx-auto text-[#DB9E30]">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-[#35170f] dark:text-white uppercase tracking-wider">
                Select Multiple Files to Upload
              </h3>
              <p className="text-xs text-[#8b8178] dark:text-white/60 mt-1">
                Supports Images (JPG, PNG, WEBP) & Videos (MP4, WEBM, MOV). Uploads directly to Cloudinary <code className="text-[#DB9E30]">tuvaa/gallery</code>.
              </p>
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg,video/mp4,video/webm,video/quicktime"
                className="hidden"
                disabled={isUploading || isTester}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isTester}
                className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow cursor-pointer disabled:opacity-50"
              >
                Choose Files (Multiple)
              </button>
            </div>
          </div>

          {/* Queue Settings & Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4 bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] p-6 rounded-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e8dfc8] dark:border-[#2a211a] pb-4">
                <div>
                  <h4 className="font-cinzel font-bold text-sm text-[#35170f] dark:text-white uppercase tracking-wider">
                    Upload Queue ({selectedFiles.length} item{selectedFiles.length > 1 ? 's' : ''})
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <label className="font-cinzel font-bold text-[#8b8178] dark:text-white/70 uppercase">
                      Apply Category To All:
                    </label>
                    <select
                      value={commonCategory}
                      onChange={(e) => handleApplyCommonCategory(e.target.value)}
                      className="bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-3 py-1.5 rounded text-xs focus:outline-none focus:border-[#DB9E30]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="publishImmediately"
                      checked={publishImmediately}
                      onChange={(e) => setPublishImmediately(e.target.checked)}
                      className="accent-[#DB9E30] cursor-pointer"
                    />
                    <label
                      htmlFor="publishImmediately"
                      className="cursor-pointer select-none text-[#35170f] dark:text-white font-medium"
                    >
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>

              {/* Selected Files List */}
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {selectedFiles.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] rounded text-xs"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-14 bg-black rounded overflow-hidden shrink-0 border border-[#e8dfc8] dark:border-[#2a211a]">
                      {item.type === 'image' ? (
                        <img src={item.previewUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <video src={item.previewUrl} className="w-full h-full object-cover" />
                      )}
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 px-1 py-0.5 text-[9px] font-bold text-white rounded">
                        {item.type === 'image' ? (
                          <FileImage className="w-3 h-3 text-blue-400 inline" />
                        ) : (
                          <FileVideo className="w-3 h-3 text-green-400 inline" />
                        )}
                      </span>
                    </div>

                    {/* Editable Title */}
                    <div className="flex-grow space-y-1.5 w-full sm:w-auto">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                        placeholder="Editable Title..."
                        className="w-full bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] px-3 py-1.5 rounded font-bold text-[#35170f] dark:text-white focus:border-[#DB9E30] outline-none"
                      />
                      <div className="flex items-center gap-3 text-[10px] text-[#8b8178] dark:text-white/50">
                        <span>Size: {item.sizeFormatted}</span>
                        <span>Type: {item.type.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div className="w-full sm:w-32 shrink-0">
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                        className="w-full bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] px-2 py-1.5 rounded text-[#35170f] dark:text-white outline-none"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status / Remove */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {item.status === 'ready' && (
                        <span className="px-2.5 py-1 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 font-cinzel font-bold text-[10px] uppercase rounded">
                          Ready
                        </span>
                      )}
                      {item.status === 'uploading' && (
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-cinzel font-bold text-[10px] uppercase rounded flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading
                        </span>
                      )}
                      {item.status === 'uploaded' && (
                        <span className="px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 font-cinzel font-bold text-[10px] uppercase rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Uploaded
                        </span>
                      )}
                      {item.status === 'failed' && (
                        <span
                          title={item.errorMsg}
                          className="px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 font-cinzel font-bold text-[10px] uppercase rounded flex items-center gap-1 cursor-help"
                        >
                          <AlertCircle className="w-3 h-3" /> Failed
                        </span>
                      )}

                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar & Upload Button */}
              <div className="pt-4 border-t border-[#e8dfc8] dark:border-[#2a211a] flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-xs text-[#8b8178] dark:text-white/60">
                  Total {selectedFiles.length} file(s) ready to upload.
                </span>

                <button
                  type="button"
                  onClick={handleUploadAll}
                  disabled={isUploading || isTester || selectedFiles.length === 0}
                  className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUploading ? 'Uploading to Cloudinary & Saving...' : 'Upload & Save All Items'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: EXTERNAL URL / CLOUDINARY RECOVERY */}
      {mode === 'external' && (
        <form
          onSubmit={handleSaveExternal}
          className="bg-white dark:bg-[#17110d] border border-[#e8dfc8] dark:border-[#2a211a] p-6 sm:p-8 rounded-sm space-y-5 text-left"
        >
          <div className="space-y-1">
            <h3 className="font-cinzel text-base font-bold text-[#35170f] dark:text-white uppercase tracking-wider">
              External URL / Recover Cloudinary Asset
            </h3>
            <p className="text-xs text-[#8b8178] dark:text-white/60">
              Save gallery items directly via secure URL or recover media already stored in Cloudinary.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">
                Item Title *
              </label>
              <input
                type="text"
                value={extTitle}
                onChange={(e) => setExtTitle(e.target.value)}
                placeholder="e.g. BBAM Festival Culture"
                required
                className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">
                Media Type *
              </label>
              <select
                value={extType}
                onChange={(e) => setExtType(e.target.value as 'image' | 'video')}
                className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
              >
                <option value="image">Image / Photo</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          {/* External URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">
              External / Cloudinary Media URL *
            </label>
            <input
              type="text"
              value={extUrl}
              onChange={(e) => setExtUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... or https://..."
              required
              className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
            />
          </div>

          {/* If Video: Optional Video URL & Thumbnail */}
          {extType === 'video' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">
                  Video URL (If YouTube / MP4)
                </label>
                <input
                  type="text"
                  value={extVideoUrl}
                  onChange={(e) => setExtVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or MP4"
                  className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">
                  Thumbnail Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={extThumbnailUrl}
                  onChange={(e) => setExtThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
                />
              </div>
            </div>
          )}

          {/* Cloudinary Public ID & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">
                Cloudinary Public ID (Optional for Cloudinary deletion)
              </label>
              <input
                type="text"
                value={extPublicId}
                onChange={(e) => setExtPublicId(e.target.value)}
                placeholder="e.g. tuvaa/gallery/abcd123"
                className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">
                Category
              </label>
              <select
                value={extCategory}
                onChange={(e) => setExtCategory(e.target.value)}
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

          {/* Alt Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-cinzel font-bold text-[#35170f] dark:text-[#DB9E30] uppercase tracking-wider block">
              Alt Text (Optional)
            </label>
            <input
              type="text"
              value={extAltText}
              onChange={(e) => setExtAltText(e.target.value)}
              placeholder="Describe the image/video..."
              className="w-full bg-[#fdfcfb] dark:bg-[#1c1510] border border-[#e8dfc8] dark:border-[#2a211a] text-[#35170f] dark:text-white px-4 py-2.5 rounded text-xs outline-none focus:border-[#DB9E30]"
            />
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="extPublish"
              checked={extPublish}
              onChange={(e) => setExtPublish(e.target.checked)}
              className="accent-[#DB9E30] cursor-pointer"
            />
            <label
              htmlFor="extPublish"
              className="cursor-pointer select-none text-xs text-[#35170f] dark:text-white font-medium"
            >
              Publish this item immediately
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmittingExt || isTester}
              className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmittingExt && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmittingExt ? 'Saving External Item...' : 'Save External Gallery Item'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
