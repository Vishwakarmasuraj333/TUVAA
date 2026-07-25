import PageBanner from '@/components/common/PageBanner'
import EventsListSection from '@/components/events/EventsListSection'

export const metadata = {
  title: 'Our Events - TUVAA',
  description: 'Join us in our upcoming community events, sports classes, workshops, and cultural celebrations in Southampton and Hampshire.',
}

export default function EventsPage() {
  return (
    <div className="w-full">
      {/* Banner */}
      <PageBanner title="Our Events" breadcrumb="Our Events" />

      {/* Events List Grid */}
      <EventsListSection />
    </div>
  )
}
