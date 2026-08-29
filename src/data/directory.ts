export const directoryTypes = ['artist', 'musician', 'business', 'professional', 'community_group'] as const
export type DirectoryType = (typeof directoryTypes)[number]

export interface DirectoryListingView {
  id: string
  type: DirectoryType
  title: string
  slug: string
  description: string
  image: string | null
  gallery?: string[]
  category: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  socialUrl?: string | null
  isPublished?: boolean
  order?: number
}

export const directoryPageContent: Record<DirectoryType, { title: string; intro: string; bannerImage?: string }> = {
  artist: {
    title: 'Artists',
    intro: 'Our black communities have fantastic artists hidden in our deprived communities and do not have opportunities to be seen and known by both the black and the larger community. TUVAA aims to change that. As a result of the BBAM Festival we have arranged some exhibitions for some of the artist. We will continue to create platforms for exhibitions and also developmental pathways for their growth. You can enjoy some of the artworks by these artist here',
    bannerImage: '/images/bbam-collage.jpg',
  },
  musician: {
    title: 'Musicians',
    intro: 'TUVAA supports Black, African, Caribbean and community musicians by creating platforms where their talent can be celebrated, promoted and connected with wider audiences. Through BBAM and community events, musicians are given opportunities to perform, network and grow their creative journey.',
    bannerImage: '/images/tuvaa-music.jpg',
  },
  business: {
    title: 'Businesses',
    intro: 'TUVAA promotes Black and African-owned businesses by giving them visibility, networking opportunities and community support. The BBAM platform helps entrepreneurs showcase their services, connect with customers and grow sustainable businesses.',
    bannerImage: '/images/bbam-gala.jpg',
  },
  professional: {
    title: 'Skills / Professionals',
    intro: 'The Skills and Professionals directory highlights talented individuals, experts and skilled community members who can support growth, mentoring, training and collaboration across our communities.',
    bannerImage: '/images/tuva1-400x450.jpg',
  },
  community_group: {
    title: 'Community Groups',
    intro: 'TUVAA works with African community groups in Southampton and Hampshire to build unity, representation and stronger community support. This directory helps groups become visible, connect with others and access opportunities through the wider TUVAA network.',
    bannerImage: '/images/african-family-group.jpg',
  },
}

const images = {
  artist: ['/images/artist-1.jpg', '/images/artist-2.jpg', '/images/artist-3.jpg', '/images/artist-4.jpg', '/images/artist-5.jpg', '/images/artist-6.jpg', '/images/artist-7.jpg', '/images/artist-8.jpg'],
  musician: ['/images/tuvaa-music.jpg', '/images/african-dance.jpg', '/images/events-cultural.jpg', '/images/tuvaa-enjoy.jpg'],
  business: ['/images/bbam-gala.jpg', '/images/community-meeting.jpg', '/images/education-empowerment.jpg', '/images/support-tuvaa-donate.jpg'],
  professional: ['/images/tuva1-400x450.jpg', '/images/youth-empowerment.jpg', '/images/hidden-histories.png', '/images/health-wellbeing-info.jpg'],
  community_group: ['/images/african-family-group.jpg', '/images/community-meeting.jpg', '/images/events-cultural.jpg', '/images/newtown-community-centre.jpg'],
}

const content: Record<DirectoryType, Array<[string, string, string]>> = {
  artist: [
    ['BBAM Visual Artist Collection', 'Visual Arts', 'A selection of original work celebrating African heritage, identity and community.'],
    ['African Heritage in Colour', 'Painting', 'Contemporary paintings inspired by African stories, landscapes and lived experience.'],
    ['Community Portraits', 'Portraiture', 'Portrait work giving visibility to people and stories across our communities.'],
    ['Mixed Media Exhibition', 'Mixed Media', 'Layered artwork connecting culture, memory and modern Black British life.'],
  ],
  musician: [
    ['Richman Bana & The Sunset Band', 'Afrobeat & Reggae', 'An energetic live act bringing Afrobeat and reggae fusion to community stages.'],
    ['Hampshire African Drumming Club', 'Traditional Percussion', 'A community ensemble sharing West African djembe and dunun rhythms.'],
    ['Voices of BBAM', 'Soul & Gospel', 'Local vocalists performing soul, gospel and contemporary African music.'],
    ['Southampton Afrofusion DJs', 'Afrofusion', 'DJs connecting audiences through Afrobeats, amapiano and global Black music.'],
  ],
  business: [
    ['Savannah Kitchen Catering', 'Food & Catering', 'Authentic African cuisine and event catering for families, organisations and celebrations.'],
    ['Zuri Ankara Fashions', 'Fashion', 'Bespoke African-print clothing, accessories and contemporary designs.'],
    ['Ubuntu Events & Décor', 'Events', 'Community-focused event planning, styling and celebration décor.'],
    ['Nia Community Consulting', 'Business Services', 'Practical support for charities, start-ups and community enterprises.'],
  ],
  professional: [
    ['Dr Tariro Sibanda', 'Community Consultant', 'Capacity building, mentoring and funding guidance for community organisations.'],
    ['Chimwemwe Mbeke', 'Legal Adviser', 'Accessible community, immigration and small-business legal guidance.'],
    ['Amina Okafor', 'Educator & Mentor', 'Learning support, professional mentoring and skills development.'],
    ['Kofi Mensah', 'Digital Specialist', 'Web, media and digital communications support for local organisations.'],
  ],
  community_group: [
    ['Gambia Kaffo Southampton', 'Gambian Community', 'Connecting Gambian families and supporting culture, welfare and community participation.'],
    ['Nigerian Association Hampshire', 'Nigerian Community', 'Networking, cultural events and practical support for Nigerian residents.'],
    ['Zimbabwean Community Network', 'Zimbabwean Community', 'Family welfare, integration support and cultural programmes.'],
    ['Malawi Community Hampshire', 'Malawian Community', 'A supportive forum linking members with events and local opportunities.'],
  ],
}

export function getFallbackListings(type: DirectoryType): DirectoryListingView[] {
  return content[type].map(([title, category, description], index) => ({
    id: `fallback-${type}-${index + 1}`,
    type,
    title,
    slug: `${type}-${index + 1}`,
    description,
    image: images[type][index],
    gallery: type === 'artist' && index === 0 ? images.artist : undefined,
    category,
    email: 'info@tuvaa.org.uk',
    isPublished: true,
    order: index,
  }))
}
