'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-right" theme="dark" richColors closeButton />
    </SessionProvider>
  )
}
