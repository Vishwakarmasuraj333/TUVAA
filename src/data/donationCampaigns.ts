export interface Campaign {
  slug: string
  title: string
  shortText: string
  fullDescription: string
  image: string
  goalAmount: number
  raisedAmount: number
  donationCount: number
}

export const campaigns: Campaign[] = [
  {
    slug: 'young-people',
    title: 'YOUNG PEOPLE',
    shortText:
      'TUVAA is creating a range of opportunities for young people who will otherwise be stuck at home on Xbox. We are running accessible and affordable football program for girls and boys at £2 per day...',
    fullDescription:
      'TUVAA is creating a range of opportunities for young people who will otherwise be stuck at home on Xbox. We are running accessible and affordable football program for girls and boys at £2 per day. We are also getting them involved in a range of volunteering activities to boost their CVs. Young people are created opportunities to work with academics and professionals to inspire them. We are currently working with some professionals to help young people make music. Your donations help our black children to thrive.',
    image: '/images/donate-young-people.jpg',
    goalAmount: 6032,
    raisedAmount: 5,
    donationCount: 1,
  },
  {
    slug: 'women',
    title: 'WOMEN',
    shortText:
      'Women are vulnerable and black women are even more vulnerable because of colour of their skin. We support black women with a range of services...',
    fullDescription:
      `Women are vulnerable and black women are even more vulnerable because of colour of their skin. We support black women with a range of services including swimming classes, support groups, counselling referrals, and safe spaces for discussion. Our Women's empowerment project creates opportunities for black women to build confidence, share experiences and access professional support. Your donations directly fund these vital services and help us reach more women in need across our communities.`,
    image: '/images/donate-women.jpg',
    goalAmount: 11263,
    raisedAmount: 0,
    donationCount: 0,
  },
  {
    slug: 'bbam-festival',
    title: 'BBAM FESTIVAL',
    shortText:
      'We are setting up black business network to enable black businesses to empower start ups and existing businesses...',
    fullDescription:
      'We are setting up black business network to enable black businesses to empower start ups and existing businesses. The Black Business, Artist and Musicians (BBAM) Festival is an annual celebration of Black talent, culture and entrepreneurship. Your donations help us fund the event, support artists, musicians and businesses participating, and create a legacy platform that promotes diversity and economic empowerment in our community. Every pound you donate goes directly to making this festival bigger and better.',
    image: '/images/donate-bbam-festival.jpg',
    goalAmount: 4596,
    raisedAmount: 0,
    donationCount: 0,
  },
]
