'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { EventData } from '@/lib/events'

interface EventListItemProps {
  event: EventData
}

export default function EventListItem({ event }: EventListItemProps) {
  const eventDate = new Date(event.date)
  
  // Date parts
  const dateNumber = eventDate.getDate().toString().padStart(2, '0')
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' })
  const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'long' })

  // Format Time exactly matching screenshot: e.g. "12 Oct @ 11 am - 7 pm" or "04 Sep -"
  let dateString = ''
  if (event.startTime) {
    const startTimeFormatted = event.startTime.replace(':00', '').replace(' AM', ' am').replace(' PM', ' pm')
    const endTimeFormatted = event.endTime ? event.endTime.replace(':00', '').replace(' AM', ' am').replace(' PM', ' pm') : ''
    
    const timeRange = endTimeFormatted ? `${startTimeFormatted} - ${endTimeFormatted}` : startTimeFormatted
    dateString = `${eventDate.getDate().toString().padStart(2, '0')} ${month} @ ${timeRange}`
  } else {
    dateString = `${eventDate.getDate().toString().padStart(2, '0')} ${month} -`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-150/60 last:border-0"
    >
      {/* Left: Date & Text Info */}
      <div className="flex flex-row items-start gap-6 flex-grow">
        {/* Date block */}
        <div className="flex items-center gap-3 shrink-0 select-none">
          <span className="text-[48px] sm:text-[56px] font-extralight text-[#cfc8c0] leading-none">
            {dateNumber}
          </span>
          <div className="flex flex-col text-left leading-none space-y-1">
            <span className="text-sm font-bold text-[#2b1a12] uppercase tracking-wider">{month}</span>
            <span className="text-xs text-zinc-400 font-medium">{weekday}</span>
          </div>
        </div>

        {/* Title and Meta Info */}
        <div className="flex flex-col text-left space-y-2 pt-1.5">
          <h3 className="font-cinzel text-base sm:text-[17px] font-bold text-[#2b1a12] uppercase tracking-wider hover:text-[#DB9E30] transition-colors duration-205 leading-snug">
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </h3>
          <div className="flex flex-col space-y-1 text-xs text-[#555] font-roboto">
            <span className="font-medium text-zinc-500">{dateString}</span>
            {event.location && (
              <span className="text-[#DB9E30] font-semibold">{event.location},</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Button */}
      <div className="shrink-0 flex items-center md:justify-end">
        <Link href={`/events/${event.slug}`} className="w-full sm:w-auto">
          <button
            className="btn-primary-hover w-full sm:w-auto font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm shadow-sm hover:shadow cursor-pointer"
          >
            Event Details
          </button>
        </Link>
      </div>
    </motion.div>
  )
}
