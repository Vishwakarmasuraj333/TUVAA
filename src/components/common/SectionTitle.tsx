import { cn } from '@/lib/utils'

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'space-y-3 mb-12',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        align === 'right' && 'text-right',
        className
      )}
    >
      <h2 className="font-cinzel text-3xl md:text-4xl font-extrabold text-charcoal tracking-wider uppercase inline-block relative pb-3 leading-tight">
        {title}
        {/* Underline highlight */}
        <span
          className={cn(
            'absolute bottom-0 h-[2.5px] w-16 bg-gradient-to-r from-gold-600 to-gold-400 rounded-full',
            align === 'center' && 'left-1/2 -translate-x-1/2',
            align === 'left' && 'left-0',
            align === 'right' && 'right-0'
          )}
        />
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
