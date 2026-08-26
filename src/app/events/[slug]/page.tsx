import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PageBanner from '@/components/common/PageBanner'
import AddToCalendarButton from '@/components/events/AddToCalendarButton'
import EventMediaGallery from '@/components/events/EventMediaGallery'
import EventRegisterForm from '@/components/events/EventRegisterForm'
import { getEventBySlug, getPrevNextEvents } from '@/lib/events'

interface EventDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  return {
    title: event ? `${event.title} - TUVAA Events` : 'Event Not Found',
    description: event?.excerpt || 'Join us for TUVAA community events in Southampton and Hampshire.',
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const { prev, next } = await getPrevNextEvents(slug)

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="w-full bg-white text-zinc-800 pb-20">
      {/* Page Banner */}
      <PageBanner
        title={event.title}
        breadcrumb={`Events / ${event.title}`}
      />

      <div className="container mx-auto px-6 py-16 max-w-[900px] text-left">
        
        {/* Top Notice: This event has passed */}
        {event.status === 'past' && (
          <div className="mb-8 p-4 bg-zinc-100 text-zinc-500 rounded-sm text-sm font-semibold tracking-wide text-center uppercase border border-zinc-200 select-none">
            This event has passed.
          </div>
        )}

        {/* Event Video/Media section */}
        {event.videoUrl && (
          <EventMediaGallery event={event} />
        )}

        {/* Featured Main Image or Poster Image */}
        {(event.image || event.posterImage) && !event.videoUrl && (
          <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden mb-10 border border-zinc-200 shadow-md">
            <Image
              src={event.image || event.posterImage || '/images/event-placeholder.jpg'}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover object-center bg-zinc-100"
            />
          </div>
        )}

        {/* Content Title */}
        <h2 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold text-[#2b1a12] mb-6 uppercase tracking-wider">
          {event.slug === 'black-business-art-and-music-festival-bbam' 
            ? 'BBAM Festival Volunteers Wanted!' 
            : event.title}
        </h2>

        {/* Paragraph Content */}
        {event.content && (
          <div className="prose prose-zinc max-w-none text-[#555] text-sm sm:text-base leading-relaxed text-justify space-y-6 whitespace-pre-line font-roboto">
            {event.content}
          </div>
        )}

        {/* BBAM Specific Highlights List */}
        {event.slug === 'black-business-art-and-music-festival-bbam' && (
          <div className="mt-8 mb-10 text-left border-t border-zinc-100 pt-8">
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#2b1a12] mb-4 uppercase tracking-wide">
              BBAM is back with a Bang and it is free entry. Highlights include:
            </h3>
            <ul className="list-decimal pl-6 space-y-2 text-[#555] text-sm sm:text-base leading-relaxed text-justify font-roboto">
              <li>Military parade by commonwealth veterans and servicemen</li>
              <li>Cultural displays and entertainment from Africa and Caribbean Islands including: Nigeria, Gambia, Ghana, Zimbabwe, Zambia, Malawi, Guinea, Somalia, Sudan, Cameroon, Kenya, Commonwealth and Caribbean Islands.</li>
              <li>Varieties of live music and entertainment by black artists</li>
              <li>Jolof rice competition – let the judges decide the winner</li>
              <li>Dance and Fashion show – try out our fashion</li>
              <li>Art exhibition and sales</li>
              <li>Children's bouncy castle and more</li>
            </ul>
          </div>
        )}

        {/* Action Buttons: Register and Add to Calendar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <a href="#register-section" className="w-full sm:w-auto">
            <button className="btn-primary-hover w-full sm:w-auto font-cinzel font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm shadow-md hover:shadow-lg cursor-pointer">
              Register
            </button>
          </a>
          <AddToCalendarButton event={event} />
        </div>

        {/* Details Grid */}
        <div className="mt-12 py-8 px-6 sm:px-10 border border-zinc-200 rounded-sm bg-zinc-50/50 text-left">
          <h3 className="font-cinzel text-sm font-bold text-[#2b1a12] tracking-widest uppercase mb-4 border-b border-zinc-250 pb-2">
            Details
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm font-roboto">
            <div>
              <dt className="font-bold text-[#2b1a12] mb-0.5">Date:</dt>
              <dd className="text-[#555]">{formattedDate}</dd>
            </div>
            {(event.startTime || event.endTime) && (
              <div>
                <dt className="font-bold text-[#2b1a12] mb-0.5">Time:</dt>
                <dd className="text-[#555]">
                  {event.startTime || '11:00 am'} - {event.endTime || '7:00 pm'}
                </dd>
              </div>
            )}
            {event.organizer && (
              <div>
                <dt className="font-bold text-[#2b1a12] mb-0.5">Organizer:</dt>
                <dd className="text-[#555]">{event.organizer}</dd>
              </div>
            )}
            {event.venue && (
              <div>
                <dt className="font-bold text-[#2b1a12] mb-0.5">Venue:</dt>
                <dd className="text-[#555]">{event.venue}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Event Registration Form */}
        <div id="register-section" className="mt-16">
          <EventRegisterForm eventSlug={event.slug} eventName={event.title} />
        </div>

        {/* Prev / Next Nav */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-zinc-200">
          {prev ? (
            <Link
              href={`/events/${prev.slug}`}
              className="text-sm font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase font-bold tracking-wider transition-colors duration-250"
            >
              &larr; Previous Event
            </Link>
          ) : (
            <span className="text-sm text-zinc-400 select-none font-cinzel uppercase font-bold tracking-wider">
              &larr; Previous Event
            </span>
          )}

          {next ? (
            <Link
              href={`/events/${next.slug}`}
              className="text-sm font-cinzel text-[#DB9E30] hover:text-[#57a68f] uppercase font-bold tracking-wider transition-colors duration-250"
            >
              Next Event &rarr;
            </Link>
          ) : (
            <span className="text-sm text-zinc-400 select-none font-cinzel uppercase font-bold tracking-wider">
              Next Event &rarr;
            </span>
          )}
        </div>

      </div>
    </div>
  )
}
