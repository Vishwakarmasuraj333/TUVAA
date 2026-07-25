import { prisma, isDbAvailable } from './prisma'

export interface EventData {
  id?: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  image?: string | null
  posterImage?: string | null
  videoUrl?: string | null
  date: Date
  endDate?: Date | null
  startTime?: string | null
  endTime?: string | null
  organizer?: string | null
  venue?: string | null
  location?: string | null
  status: 'upcoming' | 'past'
  isPublished?: boolean
}

export const STATIC_EVENTS: EventData[] = [
  {
    slug: 'black-business-art-and-music-festival-bbam',
    title: 'Black Business Art And Music Festival (BBAM)',
    excerpt: 'Join us for the Black Business Art and Music Festival (BBAM) on Sunday, October 12th, 2025 at the Guildhall Square!',
    content: `Join us for the Black Business Art and Music Festival (BBAM) on Sunday, October 12th, 2025 at the Guildhall Square!

We’re looking for enthusiastic and dedicated volunteers willing to give their time free to help make this event a success. Various roles are available and your lunch is on us.

If you’re passionate about art, music, and community, we want YOU to be part of our team!

Contact Pee for More Information
Call/text: +44 7843 106868

Join us in celebrating African, Caribbean, and Black British cultures. Let’s make this festival unforgettable!

Get involved, give your time and be part of something amazing!`,
    posterImage: '/images/bbam-festival-2025.jpg',
    videoUrl: '/images/v.mp4',
    date: new Date('2025-10-12T11:00:00Z'),
    startTime: '11:00 am',
    endTime: '7:00 pm',
    organizer: 'TUVAA',
    venue: 'Guildhall Square, Southampton',
    location: 'Southampton',
    status: 'upcoming',
  },
  {
    slug: 'women-swimming-lesson',
    title: 'Women Swimming Lesson',
    excerpt: 'Accessible and affordable swimming lessons for women and children in the Southampton community.',
    content: `TUVAA has partnered with Energise Me and Active Nation to deliver accessible and affordable swimming lessons to TUVAA members and supporters in the Southampton community. The programme has been running for two years and is held on Sundays at Bitterne Leisure Centre for women and children.

The lessons cater to over 40 women and 60 children of different abilities in each term. Feedback from the participants is overwhelmingly positive with many returnees each term. Some of the participants have gone on to attend taster sessions in watersports after gaining water confidence.`,
    image: '/images/women-swimming.jpg',
    date: new Date('2025-12-02T14:00:00Z'),
    startTime: '2:00 pm',
    endTime: '4:00 pm',
    organizer: 'TUVAA',
    venue: 'Bitterne Leisure Centre, Southampton',
    location: 'Southampton',
    status: 'upcoming',
  },
  {
    slug: 'bbam-gala-2025',
    title: 'BBAM Gala 2025',
    excerpt: 'Pre-festival fundraiser, gala and awards night celebrating Black Business, Art & Music.',
    content: `Celebrating our entrepreneurs and artists at the annual TUVAA gala. Pre-festival gala night celebrating black entrepreneurs and visual artists. Ticket proceeds go to youth kayak sailing initiatives.`,
    image: '/images/bbam-gala.jpg',
    date: new Date('2025-07-20T18:00:00Z'),
    startTime: '6:00 pm',
    endTime: '11:00 pm',
    organizer: 'TUVAA',
    venue: 'O2 Guildhall Southampton',
    location: 'Southampton',
    status: 'upcoming',
  },
  {
    slug: 'men-swimming-lesson',
    title: 'Men Swimming Lesson',
    excerpt: 'TUVAA took the initiative to start men swimming to promote physical health, water safety and confidence.',
    content: `Black people are more likely to be inactive compare to their white colleagues. Black people are also known to be non-swimmers when compared to their white colleagues. This is more sure in our black community in Southampton. TUVAA took the initiative to start men swimming. A total of 30 men took a plug into the water and a majority of them have improved their water confidence and majority have improved their swimming skills. TUVAA is starting new lessons at Bittern leisure centre to attract more men.`,
    image: '/images/men-swimming.jpg',
    date: new Date('2025-09-04T19:00:00Z'),
    startTime: '7:00 pm',
    endTime: '9:00 pm',
    organizer: 'TUVAA',
    venue: 'Bitterne Leisure Centre, Southampton',
    location: 'Southampton',
    status: 'upcoming',
  },
  {
    slug: 'black-business-artist-music-festival-bbam-past',
    title: 'Black Business Artist & Music Festival (BBAM)',
    excerpt: 'Highlights and celebration from the past Black Business Artist & Music Festival.',
    content: `A celebration of African, Caribbean, and Black British cultures. Thank you to all who attended, performed, and supported.`,
    image: '/images/bbam-festival-2025.jpg',
    date: new Date('2025-10-01T11:00:00Z'),
    startTime: '11:00 am',
    endTime: '7:00 pm',
    organizer: 'TUVAA',
    venue: 'Guildhall Square, Southampton',
    location: 'Southampton',
    status: 'past',
  },
]

export async function getEvents(): Promise<EventData[]> {
  if (await isDbAvailable()) {
    try {
      const events = await prisma.event.findMany({
        where: { isPublished: true },
        orderBy: { date: 'asc' },
      })
      if (events && events.length > 0) {
        return events as EventData[]
      }
    } catch (error) {
      // Fallback
    }
  }
  return STATIC_EVENTS
}

export async function getUpcomingEvents(): Promise<EventData[]> {
  if (await isDbAvailable()) {
    try {
      const events = await prisma.event.findMany({
        where: { isPublished: true, status: 'upcoming' },
        orderBy: { date: 'asc' },
      })
      if (events && events.length > 0) {
        return events as EventData[]
      }
    } catch (error) {
      // Fallback
    }
  }
  return STATIC_EVENTS.filter((e) => e.status === 'upcoming')
}

export async function getPastEvents(): Promise<EventData[]> {
  if (await isDbAvailable()) {
    try {
      const events = await prisma.event.findMany({
        where: { isPublished: true, status: 'past' },
        orderBy: { date: 'desc' },
      })
      if (events && events.length > 0) {
        return events as EventData[]
      }
    } catch (error) {
      // Fallback
    }
  }
  return STATIC_EVENTS.filter((e) => e.status === 'past').sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function getEventBySlug(slug: string): Promise<EventData | null> {
  if (await isDbAvailable()) {
    try {
      const event = await prisma.event.findUnique({
        where: { slug },
      })
      if (event) return event as EventData
    } catch (error) {
      // Fallback
    }
  }
  const fallback = STATIC_EVENTS.find((e) => e.slug === slug)
  return fallback || null
}

export async function getPrevNextEvents(currentSlug: string): Promise<{ prev: EventData | null; next: EventData | null }> {
  try {
    const events = await getEvents()
    const currentIndex = events.findIndex((e) => e.slug === currentSlug)
    if (currentIndex === -1) {
      return { prev: null, next: null }
    }
    const prev = currentIndex > 0 ? events[currentIndex - 1] : null
    const next = currentIndex < events.length - 1 ? events[currentIndex + 1] : null
    return { prev, next }
  } catch (error) {
    // Fallback
  }
  return { prev: null, next: null }
}
