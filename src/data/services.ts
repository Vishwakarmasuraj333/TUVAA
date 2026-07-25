export interface ServiceItem {
  id: string
  title: string
  slug: string
  image: string
  date: string
  comments: number
  excerpt: string
  content: string
}

export const fallbackServices: ServiceItem[] = [
  {
    id: 's1',
    title: 'Health and Wellbeing Information',
    slug: 'health-and-wellbeing-information',
    image: '/images/health-wellbeing-info.jpg',
    date: 'October 15, 2024',
    comments: 0,
    excerpt: 'Scan & Donate   Southampton Health and Support Information 1. Emergencies For any health-related emergency, please dial 999 for an ambulance. Calls to this number are always free. 2. Mental Health Support If you need immediate help with your mental health: NHS Urgent Mental Health Triage: Call 111 and…',
    content: 'Scan & Donate   Southampton Health and Support Information\n\n1. Emergencies\nFor any health-related emergency, please dial 999 for an ambulance. Calls to this number are always free.\n\n2. Mental Health Support\nIf you need immediate help with your mental health: NHS Urgent Mental Health Triage: Call 111 and mental health support team will assist you. TUVAA works in close partnership with local health initiatives to ensure community members can access resources and support systems without language or cultural barriers.',
  },
  {
    id: 's2',
    title: 'Youth Empowerment',
    slug: 'youth-empowerment',
    image: '/images/youth-empowerment.jpg',
    date: 'April 19, 2022',
    comments: 0,
    excerpt: 'We identify black talents at an ear age, create pathways to nurture and create opportunities for them to realize their potential. We set up TUVAA football club to create opportunities for both boys and girls to realize their potential in sports. Also create them a pathway to become coaches, referees,…',
    content: 'We identify black talents at an ear age, create pathways to nurture and create opportunities for them to realize their potential. We set up TUVAA football club to create opportunities for both boys and girls to realize their potential in sports. Also create them a pathway to become coaches, referees, and leaders to help them realize their potential in sports and beyond.',
  },
  {
    id: 's3',
    title: 'NEWTOWN COMMUNITY SUPPORT CENTRE',
    slug: 'newtown-community-support-centre',
    image: '/images/newtown-community-centre.jpg',
    date: 'April 19, 2022',
    comments: 1,
    excerpt: 'An opened access volunteer led service for people living in Bevois and its nearby wards. We provide support in completing a wide range of online forms including visa, passport, benefits, job applications and housing. We also sign post to a wide range of professional services across the city including Citizens…',
    content: 'An opened access volunteer led service for people living in Bevois and its nearby wards. We provide support in completing a wide range of online forms including visa, passport, benefits, job applications and housing. We also sign post to a wide range of professional services across the city including Citizens Advice, local authority services, and various health and support organizations.',
  },
  {
    id: 's4',
    title: 'EDUCATION AND EMPOWERMENT',
    slug: 'education-and-empowerment',
    image: '/images/education-empowerment.jpg',
    date: 'April 19, 2022',
    comments: 0,
    excerpt: 'TUVAA believes in empowerment and the bases of which is education. We run English classes for non-English speaks for 6 years to grasped basic communication skills in English. They are then supported and encouraged to register with ofsted registered training providers. We also run computer and internet training for 5…',
    content: 'TUVAA believes in empowerment and the bases of which is education. We run English classes for non-English speaks for 6 years to grasped basic communication skills in English. They are then supported and encouraged to register with ofsted registered training providers. We also run computer and internet training for 5 years to help participants build essential IT skills and confidence.',
  },
  {
    id: 's5',
    title: 'POVERTY AND HUNGER',
    slug: 'poverty-and-hunger',
    image: '/images/community-meeting.jpg',
    date: 'April 19, 2022',
    comments: 0,
    excerpt: 'TUVAA has run the Fairshare food project for several years and distributed thousands of food items. We also partner with Feed The Community to extend food support.',
    content: 'TUVAA has run the Fairshare food project for several years and distributed thousands of food items. We also partner with Feed The Community to extend food support. In periods of high living costs, these initiatives serve as a vital lifeline for vulnerable families.',
  },
  {
    id: 's6',
    title: 'BAME PHYSICAL HEALTH AND WELLBEING',
    slug: 'bame-physical-health-and-wellbeing',
    image: '/images/football-park.jpg',
    date: 'April 19, 2022',
    comments: 0,
    excerpt: 'We pride ourselves on promoting the health and wellbeing of our community through accessible programmes, activities and support.',
    content: 'We pride ourselves on promoting the health and wellbeing of our community through accessible programmes, activities and support. Through active fitness workshops, walking clubs, nutrition webinars, and sports leagues, we enable community members of all ages to adopt healthier and happier lifestyles.',
  },
  {
    id: 's7',
    title: 'PROMOTING AFRICAN CULTURES AND TRADITIONS',
    slug: 'promoting-african-cultures-and-traditions',
    image: '/images/african-dance.jpg',
    date: 'August 31, 2020',
    comments: 0,
    excerpt: 'Africa is made up of 54 countries and thousands of ethnic groups. TUVAA promotes African cultures, traditions, identity and community heritage.',
    content: 'Africa is made up of 54 countries and thousands of ethnic groups. TUVAA promotes African cultures, traditions, identity and community heritage. We organize annual festivals, dance showcases, drumming classes, and historical lectures to keep our heritage alive for the younger generations.',
  },
  {
    id: 's8',
    title: 'BAME MENTAL HEALTH AND WELLBEING',
    slug: 'bame-mental-health-and-wellbeing',
    image: '/images/african-family-group.jpg',
    date: 'August 31, 2020',
    comments: 0,
    excerpt: 'TUVAA works with community partners to investigate the factors affecting mental health and wellbeing within African and BAME communities.',
    content: 'TUVAA works with community partners to investigate the factors affecting mental health and wellbeing within African and BAME communities. We host weekly safe-space dialogue groups, counseling referrals, and therapeutic activities to remove the taboos around mental health in minority circles.',
  },
  {
    id: 's9',
    title: 'HIDDEN HISTORIES',
    slug: 'hidden-histories',
    image: '/images/hidden-histories.png',
    date: 'July 18, 2026',
    comments: 0,
    excerpt: 'Unearthing local African histories and contributions to the Hampshire community.',
    content: 'Unearthing local African histories and contributions to the Hampshire community. We worked with Dr Cheryl Butler to publish a book called Hidden History, celebrating important stories and overlooked community heritage in the Hampshire region.',
  },
]

export const services = fallbackServices

