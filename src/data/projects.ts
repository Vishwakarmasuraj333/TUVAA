export interface ProjectItem {
  id: string
  title: string
  slug: string
  image: string
  excerpt: string
  content: string
  isPublished: boolean
  order: number
}

export const fallbackProjects: ProjectItem[] = [
  {
    id: 'p1',
    title: 'King Mzilikazi Commemoration',
    slug: 'king-mzilikazi-commemoration',
    image: '/images/King-Mzilikazi-Commemoration.jpg',
    excerpt:
      "Retracing King Lobengula's emmisarries' journey from Cape Town, South Africa, to Southampton to meet with Queen Victoria in 1898.",
    content:
      "The King Mzilikazi Commemoration is one of TUVAA's most significant cultural preservation projects. King Mzilikazi was a great leader who founded the Ndebele Kingdom in the 19th century. Our annual commemoration brings together Ndebele and Zulu diaspora communities, alongside the wider Hampshire community, to celebrate and learn about this rich history.",
    isPublished: true,
    order: 0,
  },
  {
    id: 'p2',
    title: 'Mental Health Project',
    slug: 'mental-health-project',
    image: '/images/youth.jpg',
    excerpt:
      'TUVAA has forged and established partnerships with various groups and organisations with similar interests.',
    content:
      "Mental health remains a heavily stigmatized subject within many minority ethnic communities. TUVAA's Mental Health Project aims to break down these barriers by creating safe, non-judgmental environments where Black men and women can talk, share experiences, and receive support.",
    isPublished: true,
    order: 1,
  },
  {
    id: 'p3',
    title: 'Youth Project',
    slug: 'youth-project',
    image: '/images/youth.png',
    excerpt:
      'TUVAA have run and is running several youth projects including art projects, theatre, football, water sports, swimming, and heritage projects.',
    content:
      "TUVAA's Youth Project is designed to provide constructive channels for youths from underrepresented backgrounds to build confidence, discover their potential, and acquire critical life skills.",
    isPublished: true,
    order: 2,
  },
]
