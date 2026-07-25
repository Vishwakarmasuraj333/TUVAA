import { prisma, isDbAvailable } from './prisma'

export interface NewsPostData {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string | null
  image: string
  extraImages?: string[]
  author?: string
  commentsCount?: number
  videoUrl?: string | null
  category?: string
  published?: boolean
  isPublished?: boolean
  publishedAt?: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export const FALLBACK_NEWS_POSTS: NewsPostData[] = [
  {
    id: 'news-kayak-sailing',
    title: 'KAYAK & Sailing',
    slug: 'kayak-and-sailing',
    excerpt: 'TUVAA in partnership with Active Nation and the Royal Yacht Association. For more information and how you can register please click the link below: https://widget.eola.co/550/activities/7zcf LAST CHANCE FOR KAYAKING THIS YEAR SEPT 23/24 BOOK AT LINK BELOW https://widget.eola.co/752/activities/tuvaa-watersports Announcement- water, sailing or kayak TUVAA’s partnership with Active Nation in watersports…',
    content: `TUVAA in partnership with Active Nation and the Royal Yacht Association. For more information and how you can register please click the link below:

https://widget.eola.co/550/activities/7zcf

LAST CHANCE FOR KAYAKING THIS YEAR SEPT 23/24 BOOK AT LINK BELOW:
https://widget.eola.co/752/activities/tuvaa-watersports

ANNOUNCEMENT- WATER, SAILING OR KAYAK

TUVAA’s partnership with Active Nation in watersports is open to everyone in our community!`,
    image: '/images/kayak-sailing.jpg',
    extraImages: ['/images/kayak-1.png', '/images/kayak-sailing.jpg'],
    author: 'TUVAA',
    commentsCount: 0,
    category: 'Youth',
    createdAt: '2022-05-21T12:00:00Z',
  },
  {
    id: 'news-1',
    title: 'BBAM fundraiser, gala and awards night',
    slug: 'bbam-fundraiser-gala-and-awards-night',
    excerpt: 'The United Voice of African Associations celebrated achievement, creativity and community at the BBAM fundraiser and awards evening.',
    content: `The United Voice of African Associations celebrated achievement, creativity and community at the BBAM fundraiser and awards evening.

The event brought together entrepreneurs, community leaders, and artists to highlight the vibrant achievements of our members while raising vital funds for youth programmes across Southampton.`,
    image: '/images/bbam-gala.jpg',
    category: 'Events',
    createdAt: '2024-02-07T12:00:00Z',
  },
  {
    id: 'news-2',
    title: 'Black History Month – Story Telling',
    slug: 'black-history-month-story-telling',
    excerpt: 'A memorable evening of history, lived experience and stories shared by members of our community.',
    content: `A memorable evening of history, lived experience and stories shared by members of our community.

We reflected on the powerful heritage and contributions of African diaspora communities in Hampshire, honoring our past while inspiring the next generation.`,
    image: '/images/hidden-histories.png',
    category: 'Culture',
    createdAt: '2023-11-17T12:00:00Z',
  },
  {
    id: 'news-3',
    title: 'Grant to the United Voice of Africa Association Southampton',
    slug: 'grant-to-the-united-voice-of-africa-association-southampton',
    excerpt: 'Support for TUVAA will help strengthen local programmes, community outreach and opportunities.',
    content: `Support for TUVAA will help strengthen local programmes, community outreach and opportunities.

This funding allows TUVAA to expand essential support services, educational workshops, and cultural celebrations across Southampton and surrounding areas.`,
    image: '/images/tuva1-400x450.jpg',
    category: 'Community',
    createdAt: '2023-11-01T12:00:00Z',
  },
]

export async function getNewsPostBySlug(slug: string): Promise<NewsPostData | null> {
  if (await isDbAvailable()) {
    try {
      const post = await prisma.newsPost.findUnique({
        where: { slug },
      })
      if (post) {
        return {
          ...post,
          excerpt: post.excerpt || post.content?.slice(0, 150) || '',
          content: post.content || '',
          image: post.image || '/images/event-placeholder.jpg',
          category: post.category || 'General',
        }
      }
    } catch (error) {
      // Fallback
    }
  }

  const fallback = FALLBACK_NEWS_POSTS.find((p) => p.slug === slug)
  return fallback || null
}

export async function getAllNewsPosts(): Promise<NewsPostData[]> {
  if (await isDbAvailable()) {
    try {
      const posts = await prisma.newsPost.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
      })
      if (posts && posts.length > 0) {
        return posts.map((post) => ({
          ...post,
          excerpt: post.excerpt || post.content?.slice(0, 150) || '',
          content: post.content || '',
          image: post.image || '/images/event-placeholder.jpg',
          category: post.category || 'General',
        }))
      }
    } catch (error) {
      // Fallback
    }
  }

  return FALLBACK_NEWS_POSTS
}
