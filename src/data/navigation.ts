export interface NavigationItem {
  name: string
  href?: string
  dropdown?: { name: string; href: string }[]
}

export const bbamLinks = [
  { name: 'Artists', href: '/artist' },
  { name: 'Musicians', href: '/musicians' },
  { name: 'Businesses', href: '/businesses' },
  { name: 'Skills / Professionals', href: '/skills-professionals' },
]

export const navigationItems: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/our-services' },
  { name: 'Events', href: '/our-events' },
  {
    name: 'Membership',
    href: '/membership',
    dropdown: [{ name: 'African Community Group', href: '/african-community-group' }],
  },
  {
    name: 'Our Projects',
    href: '/our-projects',
    dropdown: [
      { name: 'King Mzilikazi Commemoration', href: '/king-mzilikazi-commemoration' },
      { name: 'Mental Health Project', href: '/mental-health-project' },
      { name: 'Youth Project', href: '/youth-project' },
    ],
  },
  { name: 'Donate', href: '/donate' },
  { name: 'News', href: '/news' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'BBAM', href: '/bbam-2', dropdown: bbamLinks },
  { name: 'Community Groups', href: '/community-groups' },
]

export function isNavigationItemActive(pathname: string, item: NavigationItem) {
  return pathname === item.href || Boolean(item.dropdown?.some((sub) => pathname === sub.href))
}
