'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { EventData } from '@/lib/events'

interface AddToCalendarButtonProps {
  event: EventData
}

export default function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const startDate = new Date(event.date)
  const endDate = event.endDate 
    ? new Date(event.endDate) 
    : new Date(startDate.getTime() + 3 * 60 * 60 * 1000) // fallback 3 hours

  // Helper to format date as UTC YYYYMMDDTHHmmSSZ
  const formatUTC = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '')
  }

  const title = encodeURIComponent(event.title)
  const details = encodeURIComponent(event.excerpt || event.title)
  const location = encodeURIComponent(event.venue || event.location || '')
  const startUTC = formatUTC(startDate)
  const endUTC = formatUTC(endDate)

  // Google URL
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUTC}/${endUTC}&details=${details}&location=${location}`

  // Outlook 365 / Live URL
  const outlookUrl = `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${details}&location=${location}`
  const outlookLiveUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${details}&location=${location}`

  // Download ICS File
  const handleDownloadICS = () => {
    const icsText = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TUVAA//Events Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.slug}@tuvaa.org.uk`,
      `DTSTAMP:${formatUTC(new Date())}`,
      `DTSTART:${startUTC}`,
      `DTEND:${endUTC}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.excerpt || ''}`,
      `LOCATION:${event.venue || event.location || ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${event.slug}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative inline-block text-left w-full sm:w-auto z-30">
      <button
        onClick={toggleDropdown}
        className="btn-primary-hover w-full sm:w-auto inline-flex items-center justify-center gap-2 font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm shadow-md hover:shadow-lg cursor-pointer"
      >
        <Calendar className="h-4 w-4" />
        Add to calendar
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-2 w-56 rounded-md shadow-2xl bg-white ring-1 ring-black/5 focus:outline-none z-50 divide-y divide-zinc-100 border border-zinc-200">
          <div className="py-1">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-gold-500/10 hover:text-[#DB9E30] font-medium tracking-wide transition-colors"
            >
              Google Calendar
            </a>
            <a
              href={outlookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-gold-500/10 hover:text-[#DB9E30] font-medium tracking-wide transition-colors"
            >
              Outlook 365
            </a>
            <a
              href={outlookLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-gold-500/10 hover:text-[#DB9E30] font-medium tracking-wide transition-colors"
            >
              Outlook Live
            </a>
          </div>
          <div className="py-1">
            <button
              onClick={handleDownloadICS}
              className="w-full text-left block px-4 py-2.5 text-sm text-zinc-700 hover:bg-gold-500/10 hover:text-[#DB9E30] font-medium tracking-wide transition-colors cursor-pointer"
            >
              iCalendar (.ics Export)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
