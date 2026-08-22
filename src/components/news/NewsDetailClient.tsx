'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, MessageSquare, Twitter, Facebook, Linkedin, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import BlogSidebar from '@/components/common/BlogSidebar'
import { isHumanName } from '@/lib/validations/rules'

interface NewsDetailClientProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    content?: string | null
    image: string
    extraImages?: string[]
    author?: string
    commentsCount?: number
    category?: string
    createdAt?: Date | string
  }
}

export default function NewsDetailClient({ post }: NewsDetailClientProps) {
  const [commentName, setCommentName] = useState('')
  const [commentEmail, setCommentEmail] = useState('')
  const [commentText, setCommentText] = useState('')
  const [saveInfo, setSaveInfo] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<Array<{ name: string; date: string; text: string }>>([])

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'May 21, 2022'

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentName.trim() || !commentEmail.trim() || !commentText.trim()) {
      toast.error('Please fill in all required fields.')
      return
    }

    if (!isHumanName(commentName)) {
      toast.error('Please enter a valid name.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          name: commentName,
          email: commentEmail,
          message: commentText,
        }),
      })

      const resData = await res.json()
      if (!res.ok) throw new Error(resData.error || 'Failed to submit comment')

      toast.success('Your comment has been submitted and is pending approval!')
      setComments((prev) => [
        {
          name: commentName,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          text: commentText,
        },
        ...prev,
      ])
      setCommentName('')
      setCommentEmail('')
      setCommentText('')
      setSaveInfo(false)
    } catch (err: any) {
      toast.error(err.message || 'Error submitting comment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gallery photos if available
  const galleryPhotos = post.extraImages && post.extraImages.length > 0
    ? post.extraImages
    : post.slug === 'kayak-and-sailing'
    ? ['/images/kayak-1.png', '/images/kayak-sailing.jpg']
    : []

  return (
    <div className="container max-w-[1200px] mx-auto px-4 sm:px-6 py-12 lg:py-16 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Main Article Column (Left 8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-sm shadow-sm border border-[#e7e0d5] space-y-8">
          
          {/* Main Hero Image */}
          <div className="relative aspect-[16/9] w-full rounded overflow-hidden shadow-md bg-[#faf8ef]">
            <Image
              src={post.image || '/images/event-placeholder.jpg'}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover object-center"
            />
          </div>

          {/* Meta Row: Author, Date, Comments */}
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wider text-[#9a8d83] font-cinzel border-b border-[#eee7dc] pb-4">
            <span className="flex items-center gap-1.5 text-[#35170f] font-bold">
              <User className="h-3.5 w-3.5 text-[#DB9E30]" />
              {post.author || 'TUVAA'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#DB9E30]" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-[#DB9E30]" />
              {comments.length + (post.commentsCount || 0)} Comments
            </span>
          </div>

          {/* Article Main Text Content */}
          <div className="space-y-6 text-[#5b4b43] text-sm sm:text-base leading-relaxed font-sans whitespace-pre-line">
            {post.content || post.excerpt}
          </div>

          {/* Embedded Article Photos */}
          {galleryPhotos.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-[#eee7dc]">
              {galleryPhotos.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded overflow-hidden shadow-md border border-[#eee7dc]">
                  <Image
                    src={img}
                    alt={`Kayak watersports activity photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Social Share Bar */}
          <div className="pt-6 border-t border-[#eee7dc] flex items-center justify-between flex-wrap gap-4">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#35170f] flex items-center gap-2">
              <Share2 className="h-4 w-4 text-[#DB9E30]" /> Share This Post
            </span>
            <div className="flex gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-[#DB9E30] hover:bg-[#57a68f] text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Share on Twitter"
              >
                <Twitter className="h-4 w-4 fill-white" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-[#DB9E30] hover:bg-[#57a68f] text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Share on Facebook"
              >
                <Facebook className="h-4 w-4 fill-white" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded bg-[#DB9E30] hover:bg-[#57a68f] text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4 fill-white" />
              </a>
            </div>
          </div>

          {/* Display Posted Comments */}
          {comments.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#eee7dc]">
              <h3 className="font-cinzel text-lg font-bold text-[#35170f] uppercase">
                Comments ({comments.length})
              </h3>
              <div className="space-y-4">
                {comments.map((c, idx) => (
                  <div key={idx} className="bg-[#faf8ef] p-4 rounded border border-[#eee7dc] space-y-1">
                    <div className="flex justify-between items-center text-xs text-[#9a8d83] font-cinzel">
                      <span className="font-bold text-[#35170f]">{c.name}</span>
                      <span>{c.date}</span>
                    </div>
                    <p className="text-sm text-[#5b4b43]">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leave a Comment Form */}
          <div className="pt-8 border-t border-[#eee7dc] space-y-6">
            <h3 className="font-cinzel text-xl font-bold uppercase text-[#35170f] tracking-wider">
              Leave a Comment
            </h3>

            <form onSubmit={handleCommentSubmit} className="space-y-5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="comment-name" className="block text-xs font-cinzel font-semibold uppercase tracking-wider text-[#35170f] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="comment-name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full px-4 py-3 rounded bg-[#efeee7] text-sm text-[#35170f] outline-none border border-[#e7e0d5] focus:border-[#DB9E30] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="comment-email" className="block text-xs font-cinzel font-semibold uppercase tracking-wider text-[#35170f] mb-1.5">
                    Your Email *
                  </label>
                  <input
                    id="comment-email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded bg-[#efeee7] text-sm text-[#35170f] outline-none border border-[#e7e0d5] focus:border-[#DB9E30] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 select-none">
                <input
                  id="save-info"
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="accent-[#DB9E30] rounded cursor-pointer"
                />
                <label htmlFor="save-info" className="text-xs text-[#8b8178] cursor-pointer">
                  Save my name, email, and website in this browser for the next time I comment.
                </label>
              </div>

              <div>
                <label htmlFor="comment-text" className="block text-xs font-cinzel font-semibold uppercase tracking-wider text-[#35170f] mb-1.5">
                  Your Comment *
                </label>
                <textarea
                  id="comment-text"
                  rows={5}
                  required
                  placeholder="Write your comment here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-[#efeee7] text-sm text-[#35170f] outline-none border border-[#e7e0d5] focus:border-[#DB9E30] transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-hover font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow-md cursor-pointer text-white disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>

        </div>

        {/* Sidebar Column (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          <BlogSidebar />
        </div>

      </div>
    </div>
  )
}
