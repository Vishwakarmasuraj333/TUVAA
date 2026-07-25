export type GalleryItem = {
  id: string
  title: string
  type: 'image' | 'video'
  imageUrl: string
  videoUrl?: string
  thumbnailUrl?: string
  category?: string
  createdAt: string
}

export const fallbackGalleryItems: GalleryItem[] = [
  // --- REAL TUVAA WORDPRESS GALLERY PHOTOS ---
  {
    id: 'wp1',
    title: 'TUVAA Community Workshop & Engagement Meeting',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0271.jpg',
    category: 'Community',
    createdAt: '2023-08-04T10:00:00Z',
  },
  {
    id: 'wp2',
    title: 'African Traditions & Cultural Family Showcase',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0270.jpg',
    category: 'Culture',
    createdAt: '2023-08-04T10:15:00Z',
  },
  {
    id: 'wp3',
    title: 'African Fashion Show - Lead Model Display',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0272.jpg',
    category: 'Culture',
    createdAt: '2023-08-04T10:30:00Z',
  },
  {
    id: 'wp4',
    title: 'African Fashion Show - Hijab & Traditional Attire',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0273.jpg',
    category: 'Culture',
    createdAt: '2023-08-04T10:45:00Z',
  },
  {
    id: 'wp5',
    title: 'Youth Cultural Gala & Stage Performance',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0274.jpg',
    category: 'Youth',
    createdAt: '2023-08-04T11:00:00Z',
  },
  {
    id: 'wp6',
    title: 'African Heritage Fashion Runway Walk',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0275.jpg',
    category: 'Culture',
    createdAt: '2023-08-04T11:15:00Z',
  },
  {
    id: 'wp7',
    title: 'BBAM Cultural Drumming & Music Performance',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0276.jpg',
    category: 'BBAM Festival',
    createdAt: '2023-08-04T11:30:00Z',
  },
  {
    id: 'wp8',
    title: 'TUVAA Youth Empowerment Training Workshop',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0277.jpg',
    category: 'Youth',
    createdAt: '2023-08-04T11:45:00Z',
  },
  {
    id: 'wp9',
    title: 'TUVAA Executive Committee & Gala Night',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0278.jpg',
    category: 'Community',
    createdAt: '2023-08-04T12:00:00Z',
  },
  {
    id: 'wp10',
    title: 'African Fashion & Textile Exhibition',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0279.jpg',
    category: 'Culture',
    createdAt: '2023-08-04T12:15:00Z',
  },
  {
    id: 'wp11',
    title: 'BBAM Festival Model Presentation',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0280.jpg',
    category: 'BBAM Festival',
    createdAt: '2023-08-04T12:30:00Z',
  },
  {
    id: 'wp12',
    title: 'TUVAA Community Celebration & Networking',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0281.jpg',
    category: 'Community',
    createdAt: '2023-08-04T12:45:00Z',
  },
  {
    id: 'wp13',
    title: 'BBAM Music Artists & Live Entertainment',
    type: 'image',
    imageUrl: '/images/IMG-20230804-WA0282.jpg',
    category: 'BBAM Festival',
    createdAt: '2023-08-04T13:00:00Z',
  },
  {
    id: 'fg1',
    title: 'BBAM Festival Stall Showcase',
    type: 'image',
    imageUrl: '/images/bbam-festival-2025.jpg',
    category: 'BBAM Festival',
    createdAt: '2025-10-12T12:00:00Z',
  },
  {
    id: 'fg2',
    title: 'Youth Sailing Lesson',
    type: 'image',
    imageUrl: '/images/kayak-sailing.jpg',
    category: 'Youth',
    createdAt: '2025-08-10T11:00:00Z',
  },

  // --- REAL TUVAA BBAM VIDEOS WITH AUDIO ---
  {
    id: 'fg12',
    title: 'BBAM Festival 2025 Highlights & Live Music Performance',
    type: 'video',
    imageUrl: '/images/bbam-festival-2025.jpg',
    thumbnailUrl: '/images/bbam-festival-2025.jpg',
    videoUrl: '/images/v.mp4',
    category: 'BBAM Festival',
    createdAt: '2025-10-12T13:00:00Z',
  },
  {
    id: 'fg13',
    title: 'TUVAA Community Work & Integration Video',
    type: 'video',
    imageUrl: '/images/tuva1-400x450.jpg',
    thumbnailUrl: '/images/tuva1-400x450.jpg',
    videoUrl: '/images/tuvaa-bbam-video.mp4',
    category: 'Community',
    createdAt: '2025-09-01T13:00:00Z',
  },
  {
    id: 'fg14',
    title: 'BBAM Gala & Fundraiser Awards Night Video',
    type: 'video',
    imageUrl: '/images/bbam-gala.jpg',
    thumbnailUrl: '/images/bbam-gala.jpg',
    videoUrl: '/images/bbam-festival-2025.mp4',
    category: 'Gala & Awards',
    createdAt: '2025-07-20T13:00:00Z',
  },
]
