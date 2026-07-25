'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ShieldCheck, Loader2, Lock, Mail } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginInput = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  // Load saved email if 'Remember Me' was checked previously
  useEffect(() => {
    const savedEmail = localStorage.getItem('tuvaaAdminEmail')
    if (savedEmail) {
      setValue('email', savedEmail)
      setValue('rememberMe', true)
    }
  }, [setValue])

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || 'Invalid credentials')
      }

      // Handle Remember Me
      if (data.rememberMe) {
        localStorage.setItem('tuvaaAdminEmail', data.email)
      } else {
        localStorage.removeItem('tuvaaAdminEmail')
      }

      toast.success('Successfully logged in!')
      router.push('/admin')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white dark:bg-black transition-colors duration-300 group">
      {/* Premium Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.15] dark:opacity-40 scale-105 animate-pulse-slow transition-transform duration-[2000ms] ease-out group-hover:scale-110"
        style={{ backgroundImage: "url('/images/banner-2-v2.webp')" }}
      />
      
      {/* Light/Dark Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 dark:from-black dark:via-black/80 to-transparent transition-colors" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 dark:from-black dark:via-black/40 to-white dark:to-black transition-colors" />

      {/* Decorative Gold Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#DB9E30]/10 dark:bg-[#DB9E30]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#DB9E30]/5 dark:bg-[#DB9E30]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Glassmorphism Card */}
      <div className="w-full max-w-[420px] bg-white/95 dark:bg-zinc-950/60 border border-zinc-100 dark:border-[#DB9E30]/30 rounded-2xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_0_50px_rgba(219,158,48,0.15)] relative backdrop-blur-xl z-10 transition-all">
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#DB9E30] to-[#8a5f14] p-[2px] mx-auto shadow-[0_4px_15px_rgba(219,158,48,0.2)] dark:shadow-[0_0_20px_rgba(219,158,48,0.3)]">
            <div className="w-full h-full bg-white dark:bg-black rounded-full flex items-center justify-center text-[#DB9E30]">
              <ShieldCheck className="h-7 w-7" />
            </div>
          </div>
          <div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1c1510] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#DB9E30] dark:via-[#f9d976] dark:to-[#DB9E30] uppercase tracking-widest">
              TUVAA Admin
            </h1>
            <p className="text-[11px] text-[#1c1510]/50 dark:text-white/60 mt-1.5 font-bold tracking-[0.2em] uppercase transition-colors">
              Secure Dashboard Access
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[10px] font-cinzel text-[#1c1510]/70 dark:text-[#DB9E30] uppercase tracking-widest font-bold">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-[#DB9E30]/70" />
              <input
                type="email"
                id="email"
                placeholder="admin@tuvaa.org.uk"
                {...register('email')}
                className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-[#DB9E30] dark:focus:border-[#DB9E30]/80 focus:ring-1 focus:ring-[#DB9E30]/50 text-sm transition-all text-[#1c1510] dark:text-white placeholder:text-zinc-400 dark:placeholder-white/20 shadow-sm shadow-zinc-100/50 dark:shadow-none"
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-[10px] font-cinzel text-[#1c1510]/70 dark:text-[#DB9E30] uppercase tracking-widest font-bold">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-[#DB9E30]/70" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-[#DB9E30] dark:focus:border-[#DB9E30]/80 focus:ring-1 focus:ring-[#DB9E30]/50 text-sm transition-all text-[#1c1510] dark:text-white placeholder:text-zinc-400 dark:placeholder-white/20 shadow-sm shadow-zinc-100/50 dark:shadow-none"
              />
            </div>
            {errors.password && <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 rounded border-zinc-300 dark:border-white/20 accent-[#DB9E30] bg-zinc-50 dark:bg-black/40 cursor-pointer"
              />
              <span className="text-xs text-[#1c1510]/70 dark:text-white/70 group-hover:text-[#1c1510] dark:group-hover:text-white font-medium transition-colors">Remember my email</span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#DB9E30] to-[#b37a1e] hover:from-[#e9ab2d] hover:to-[#c9881d] disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black font-cinzel font-bold text-[13px] uppercase tracking-[0.2em] py-4 rounded-lg shadow-[0_8px_20px_rgba(219,158,48,0.25)] hover:shadow-[0_10px_25px_rgba(219,158,48,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Secure Login'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
