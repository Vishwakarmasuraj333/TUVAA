import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-panel glass-panel-hover rounded-lg p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Decorative Golden Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-500/20 group-hover:border-gold-500/50 transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold-500/20 group-hover:border-gold-500/50 transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold-500/20 group-hover:border-gold-500/50 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-500/20 group-hover:border-gold-500/50 transition-colors" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {children}
      </div>
    </div>
  )
}
