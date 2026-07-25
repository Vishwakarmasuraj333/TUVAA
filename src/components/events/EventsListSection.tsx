import { getUpcomingEvents, getPastEvents } from '@/lib/events'
import EventListItem from './EventListItem'

export default async function EventsListSection() {
  const upcomingEvents = await getUpcomingEvents()
  const pastEvents = await getPastEvents()

  return (
    <section className="bg-white w-full py-16 sm:py-24 text-zinc-800">
      <div className="container mx-auto px-6 max-w-[1180px] flex flex-col space-y-16">
        
        {/* Section 1: Upcoming Events */}
        <div className="w-full">
          <h2 className="font-cinzel text-2xl sm:text-3xl text-[#2b1a12] font-bold uppercase tracking-widest text-left">
            Upcoming Events
          </h2>
          <div className="w-full h-[1px] bg-zinc-150/70 mt-4 mb-6" />

          {upcomingEvents.length > 0 ? (
            <div className="w-full flex flex-col">
              {upcomingEvents.map((event) => (
                <EventListItem key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm tracking-wide py-4 select-none">No upcoming events scheduled.</p>
          )}
        </div>

        {/* Section 2: Past Events */}
        <div className="w-full">
          <h2 className="font-cinzel text-2xl sm:text-3xl text-[#2b1a12] font-bold uppercase tracking-widest text-left">
            List Of Past Events
          </h2>
          <div className="w-full h-[1px] bg-zinc-150/70 mt-4 mb-6" />

          {pastEvents.length > 0 ? (
            <div className="w-full flex flex-col">
              {pastEvents.map((event) => (
                <EventListItem key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm tracking-wide py-4 select-none">No past events recorded.</p>
          )}
        </div>

      </div>
    </section>
  )
}
