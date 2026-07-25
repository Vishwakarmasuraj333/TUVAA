'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const commentFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  comment: z.string().min(1, 'Comment is required'),
  acceptedPrivacy: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the storage and handling of your data.',
  }),
  mathAnswer: z.string().refine((val) => val.trim() === '4', {
    message: 'Math answer must be 4',
  }),
  saveInfo: z.boolean().optional(),
  honeypot: z.string().optional(),
})

type CommentFormValues = z.infer<typeof commentFormSchema>

interface ServiceCommentFormProps {
  serviceSlug: string
}

export default function ServiceCommentForm({ serviceSlug }: ServiceCommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      comment: '',
      acceptedPrivacy: false,
      mathAnswer: '',
      saveInfo: false,
      honeypot: '',
    },
  })

  const onSubmit = async (data: CommentFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/service-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceSlug,
          name: data.name,
          email: data.email,
          comment: data.comment,
          mathAnswer: data.mathAnswer,
          acceptedPrivacy: data.acceptedPrivacy,
          saveInfo: data.saveInfo,
          honeypot: data.honeypot,
        }),
      })

      const resData = await response.json()

      if (response.ok && resData.success !== false) {
        toast.success(resData.message || 'Comment submitted successfully and is awaiting approval.')
        reset()
      } else {
        toast.error(resData.message || 'Please fill all required fields correctly.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onInvalid = () => {
    toast.error('Please fill all required fields correctly.')
  }

  return (
    <div className="w-full max-w-[760px] mx-auto text-left py-6 font-roboto">
      <h3 className="font-cinzel text-xl sm:text-2xl text-[#31170d] font-bold uppercase tracking-wider mb-8">
        LEAVE A COMMENT
      </h3>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        {/* Honeypot field (hidden for spam prevention) */}
        <input
          type="text"
          {...register('honeypot')}
          className="hidden"
          autoComplete="off"
        />

        {/* Name and Email side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <input
              type="text"
              placeholder="Your Name *"
              {...register('name')}
              className={`w-full p-4 bg-[#fbfaf4] text-[#31170d] text-sm rounded-md outline-none transition-all border ${
                errors.name ? 'border-red-400' : 'border-transparent focus:border-[#DB9E30]/40'
              }`}
            />
            {errors.name && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Your E-mail *"
              {...register('email')}
              className={`w-full p-4 bg-[#fbfaf4] text-[#31170d] text-sm rounded-md outline-none transition-all border ${
                errors.email ? 'border-red-400' : 'border-transparent focus:border-[#DB9E30]/40'
              }`}
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>

        {/* Save info Checkbox */}
        <div className="flex items-start gap-2.5 text-[#8b8178] text-[13px] leading-relaxed">
          <input
            type="checkbox"
            id="saveInfo"
            {...register('saveInfo')}
            className="mt-1 cursor-pointer accent-[#DB9E30] rounded border-zinc-300"
          />
          <label htmlFor="saveInfo" className="cursor-pointer select-none">
            Save my name, email, and website in this browser for the next time I comment.
          </label>
        </div>

        {/* Captcha Section */}
        <div className="space-y-3">
          <p className="text-[#8b8178] text-[13px] tracking-wide">
            Please enter an answer in digits:
          </p>
          <div className="flex items-center gap-3.5">
            <span className="text-sm font-medium text-[#31170d] select-none font-cinzel">
              four × 1 =
            </span>
            <input
              type="text"
              {...register('mathAnswer')}
              maxLength={4}
              className={`w-16 p-3 bg-[#fbfaf4] text-center text-[#31170d] text-sm font-bold rounded-md outline-none transition-all border ${
                errors.mathAnswer ? 'border-red-400' : 'border-transparent focus:border-[#DB9E30]/40'
              }`}
            />
          </div>
          {errors.mathAnswer && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.mathAnswer.message}
            </span>
          )}
        </div>

        {/* Comment Textarea */}
        <div>
          <textarea
            placeholder="Your comment *"
            rows={8}
            {...register('comment')}
            style={{ height: '190px' }}
            className={`w-full p-4 bg-[#fbfaf4] text-[#31170d] text-sm rounded-md outline-none transition-all resize-none border ${
              errors.comment ? 'border-red-400' : 'border-transparent focus:border-[#DB9E30]/40'
            }`}
          />
          {errors.comment && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.comment.message}
            </span>
          )}
        </div>

        {/* Privacy Checkbox */}
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 text-[#8b8178] text-[13px] leading-relaxed">
            <input
              type="checkbox"
              id="acceptedPrivacy"
              {...register('acceptedPrivacy')}
              className="mt-1 cursor-pointer accent-[#DB9E30] rounded border-zinc-300"
            />
            <label htmlFor="acceptedPrivacy" className="cursor-pointer select-none">
              By using this form you agree with the storage and handling of your data by this website. *
            </label>
          </div>
          {errors.acceptedPrivacy && (
            <span className="text-xs text-red-500 block">
              {errors.acceptedPrivacy.message}
            </span>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary-hover disabled:opacity-60 font-cinzel font-bold text-xs uppercase tracking-widest px-9 py-4 rounded-sm shadow hover:shadow-md cursor-pointer"
          >
            {isSubmitting ? 'Submitting...' : 'Leave a comment'}
          </button>
        </div>
      </form>
    </div>
  )
}
