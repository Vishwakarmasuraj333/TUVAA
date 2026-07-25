import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing users to prevent duplicates if seeding multiple times
  await prisma.user.deleteMany({})

  const superAdminPassword = await bcrypt.hash('AdminTUVAA2026!', 10)
  const adminPassword = await bcrypt.hash('AdminTUVAA2026!', 10)
  const subAdminPassword = await bcrypt.hash('SubAdminTUVAA2026!', 10)
  const testerPassword = await bcrypt.hash('TesterTUVAA2026!', 10)

  // Seed Users
  const superAdmin = await prisma.user.create({
    data: {
      name: 'TUVAA Super Admin',
      email: 'admin@tuvaa.org.uk',
      password: superAdminPassword,
      role: 'super_admin',
    },
  })

  const admin = await prisma.user.create({
    data: {
      name: 'TUVAA Admin',
      email: 'manager@tuvaa.org.uk',
      password: adminPassword,
      role: 'admin',
    },
  })

  const subAdmin = await prisma.user.create({
    data: {
      name: 'TUVAA Sub Admin',
      email: 'subadmin@tuvaa.org.uk',
      password: subAdminPassword,
      role: 'sub_admin',
    },
  })

  const tester = await prisma.user.create({
    data: {
      name: 'TUVAA Tester',
      email: 'tester@tuvaa.org.uk',
      password: testerPassword,
      role: 'tester',
    },
  })

  // Seed 3 Main Donation Campaigns
  const campaignYoungPeople = await prisma.donationCampaign.upsert({
    where: { slug: 'young-people' },
    update: {},
    create: {
      slug: 'young-people',
      title: 'YOUNG PEOPLE',
      description:
        'TUVAA is creating a range of opportunities for young people who will otherwise be stuck at home on Xbox. We are running accessible and affordable football program for girls and boys at £2 per day. We are also getting them involved in a range of volunteering activities to boost their CVs. Young people are created opportunities to work with academics and professionals to inspire them. We are currently working with some professionals to help young people make music. Your donations help our black children to thrive.',
      image: '/images/donate-young-people.jpg',
      goalAmount: 6032,
      raisedAmount: 5,
      donationCount: 1,
      isPublished: true,
    },
  })

  const campaignWomen = await prisma.donationCampaign.upsert({
    where: { slug: 'women' },
    update: {},
    create: {
      slug: 'women',
      title: 'WOMEN',
      description:
        "Women are vulnerable and black women are even more vulnerable because of colour of their skin. We support black women with a range of services including swimming classes, support groups, counselling referrals, and safe spaces for discussion. Our Women's empowerment project creates opportunities for black women to build confidence, share experiences and access professional support. Your donations directly fund these vital services and help us reach more women in need across our communities.",
      image: '/images/donate-women.jpg',
      goalAmount: 11263,
      raisedAmount: 0,
      donationCount: 0,
      isPublished: true,
    },
  })

  const campaignBbam = await prisma.donationCampaign.upsert({
    where: { slug: 'bbam-festival' },
    update: {},
    create: {
      slug: 'bbam-festival',
      title: 'BBAM FESTIVAL',
      description:
        'We are setting up black business network to enable black businesses to empower start ups and existing businesses. The Black Business, Artist and Musicians (BBAM) Festival is an annual celebration of Black talent, culture and entrepreneurship. Your donations help us fund the event, support artists, musicians and businesses participating, and create a legacy platform that promotes diversity and economic empowerment in our community. Every pound you donate goes directly to making this festival bigger and better.',
      image: '/images/donate-bbam-festival.jpg',
      goalAmount: 4596,
      raisedAmount: 0,
      donationCount: 0,
      isPublished: true,
    },
  })

  // Seed Events
  const event1 = await prisma.event.upsert({
    where: { slug: 'black-business-art-and-music-festival-bbam' },
    update: {},
    create: {
      slug: 'black-business-art-and-music-festival-bbam',
      title: 'Black Business Art And Music Festival (BBAM)',
      excerpt: 'Join us for the Black Business Art and Music Festival (BBAM) on Sunday, October 12th at Guildhall Square!',
      content: `Join us for the Black Business Art and Music Festival (BBAM) on Sunday, October 12th!`,
      posterImage: '/images/bbam-festival-2025.jpg',
      date: new Date('2025-10-12T11:00:00Z'),
      startTime: '11:00 am',
      endTime: '7:00 pm',
      organizer: 'TUVAA',
      venue: 'Guildhall Square, Southampton',
      location: 'United Kingdom',
      status: 'upcoming',
      isPublished: true,
    },
  })

  const event2 = await prisma.event.upsert({
    where: { slug: 'women-swimming-lesson' },
    update: {},
    create: {
      slug: 'women-swimming-lesson',
      title: 'Women Swimming Lesson',
      excerpt: 'Accessible and affordable swimming lessons for women and children in the community.',
      content: 'TUVAA has partnered with Energise Me and Active Nation to deliver accessible and affordable swimming lessons.',
      image: '/images/women-swimming.jpg',
      date: new Date('2025-12-02T21:00:00Z'),
      startTime: '9:00 pm',
      endTime: '10:00 pm',
      organizer: 'TUVAA',
      venue: 'Bitterne Leisure Centre, Southampton',
      location: 'Southampton',
      status: 'upcoming',
      isPublished: true,
    },
  })

  const event3 = await prisma.event.upsert({
    where: { slug: 'bbam-gala-2025' },
    update: {},
    create: {
      slug: 'bbam-gala-2025',
      title: 'BBAM Gala 2025',
      excerpt: 'Pre-festival fundraiser, gala and awards night celebrating Black Business, Art & Music.',
      content: 'Celebrating our entrepreneurs and artists at the annual TUVAA gala.',
      image: '/images/bbam-gala.jpg',
      date: new Date('2025-07-20T22:00:00Z'),
      startTime: '10:00 pm',
      endTime: '10:00 pm',
      organizer: 'TUVAA',
      venue: 'O2 Guildhall Southampton',
      location: 'Southampton',
      status: 'upcoming',
      isPublished: true,
    },
  })

  const event4 = await prisma.event.upsert({
    where: { slug: 'men-swimming-lesson' },
    update: {},
    create: {
      slug: 'men-swimming-lesson',
      title: 'Men Swimming Lesson',
      excerpt: 'TUVAA took the initiative to start men swimming to promote physical health, water safety and confidence.',
      content: 'Promoting physical health and water confidence among men in Southampton.',
      image: '/images/men-swimming.jpg',
      date: new Date('2025-09-04T19:00:00Z'),
      startTime: '7:00 pm',
      endTime: '9:00 pm',
      organizer: 'TUVAA',
      venue: 'Bitterne Leisure Centre, Southampton',
      location: 'United Kingdom',
      status: 'past',
      isPublished: true,
    },
  })

  const event5 = await prisma.event.upsert({
    where: { slug: 'black-business-artist-music-festival-bbam-past' },
    update: {},
    create: {
      slug: 'black-business-artist-music-festival-bbam-past',
      title: 'Black Business Artist & Music Festival (BBAM)',
      excerpt: 'Highlights and celebration from the past Black Business Artist & Music Festival.',
      content: 'A celebration of African, Caribbean, and Black British cultures.',
      image: '/images/bbam-festival-2025.jpg',
      date: new Date('2025-10-01T11:00:00Z'),
      startTime: '11:00 am',
      endTime: '7:00 pm',
      organizer: 'TUVAA',
      venue: 'Guildhall Square, Southampton',
      location: 'United Kingdom',
      status: 'past',
      isPublished: true,
    },
  })

  console.log('Seed completed:')
  console.log({ superAdmin, admin, subAdmin, tester, campaignYoungPeople, campaignWomen, campaignBbam, event1, event2, event3, event4, event5 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
