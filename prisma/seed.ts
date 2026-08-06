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

  // Seed Gallery Items
  const { fallbackGalleryItems } = await import('../src/data/gallery')
  for (const gItem of fallbackGalleryItems) {
    await prisma.galleryItem.upsert({
      where: { id: gItem.id },
      update: {
        title: gItem.title,
        type: gItem.type,
        imageUrl: gItem.imageUrl,
        videoUrl: gItem.videoUrl || null,
        thumbnailUrl: gItem.thumbnailUrl || gItem.imageUrl,
        category: gItem.category || 'General',
        isPublished: true,
      },
      create: {
        id: gItem.id,
        title: gItem.title,
        type: gItem.type,
        imageUrl: gItem.imageUrl,
        videoUrl: gItem.videoUrl || null,
        thumbnailUrl: gItem.thumbnailUrl || gItem.imageUrl,
        category: gItem.category || 'General',
        isPublished: true,
      },
    })
  }

  // Seed Directory Listings (Artist, Musician, Business, Professional, Community Group)
  const { directoryTypes, getFallbackListings } = await import('../src/data/directory')
  for (const dType of directoryTypes) {
    const listings = getFallbackListings(dType)
    for (const item of listings) {
      await prisma.directoryListing.upsert({
        where: { slug: item.slug },
        update: {
          title: item.title,
          type: item.type,
          description: item.description,
          image: item.image,
          category: item.category,
          email: item.email || null,
          isPublished: true,
        },
        create: {
          id: item.id,
          title: item.title,
          slug: item.slug,
          type: item.type,
          description: item.description,
          image: item.image,
          category: item.category,
          email: item.email || null,
          isPublished: true,
        },
      })
    }
  }

  // Seed News Posts
  const newsKayak = await prisma.newsPost.upsert({
    where: { slug: 'kayak-and-sailing' },
    update: {},
    create: {
      slug: 'kayak-and-sailing',
      title: 'KAYAK & Sailing',
      excerpt: 'TUVAA in partnership with Active Nation and the Royal Yacht Association. For more information and how you can register please click the link below: https://widget.eola.co/550/activities/7zcf LAST CHANCE FOR KAYAKING THIS YEAR SEPT 23/24 BOOK AT LINK BELOW https://widget.eola.co/752/activities/tuvaa-watersports Announcement- water, sailing or kayak TUVAA’s partnership with Active Nation in watersports…',
      content: `TUVAA in partnership with Active Nation and the Royal Yacht Association. For more information and how you can register please click the link below:\n\nhttps://widget.eola.co/550/activities/7zcf\n\nLAST CHANCE FOR KAYAKING THIS YEAR SEPT 23/24 BOOK AT LINK BELOW:\nhttps://widget.eola.co/752/activities/tuvaa-watersports\n\nANNOUNCEMENT- WATER, SAILING OR KAYAK\n\nTUVAA’s partnership with Active Nation in watersports is open to everyone in our community!`,
      image: '/images/kayak-sailing.jpg',
      category: 'Youth',
      published: true,
      isPublished: true,
      publishedAt: new Date('2025-05-21T12:00:00Z'),
    },
  })

  const newsMenSwimming = await prisma.newsPost.upsert({
    where: { slug: 'men-swimming' },
    update: {},
    create: {
      slug: 'men-swimming',
      title: 'MEN SWIMMING',
      excerpt: 'TUVAA is working in partnership with Active Nation to provide supportive swimming sessions for men.',
      content: 'TUVAA is working in partnership with Active Nation to provide supportive swimming sessions for men.',
      image: '/images/men-swimming.jpg',
      category: 'Sports',
      published: true,
      isPublished: true,
      publishedAt: new Date('2025-05-11T12:00:00Z'),
    },
  })

  const newsWomenSwimming = await prisma.newsPost.upsert({
    where: { slug: 'womens-swimming' },
    update: {},
    create: {
      slug: 'womens-swimming',
      title: 'Women’s Swimming',
      excerpt: 'Accessible swimming lessons support health, confidence and wellbeing for women in our community.',
      content: 'Accessible swimming lessons support health, confidence and wellbeing for women in our community.',
      image: '/images/women-swimming.jpg',
      category: 'Sports',
      published: true,
      isPublished: true,
      publishedAt: new Date('2025-05-10T12:00:00Z'),
    },
  })

  const news1 = await prisma.newsPost.upsert({
    where: { slug: 'bbam-fundraiser-gala-and-awards-night' },
    update: {},
    create: {
      slug: 'bbam-fundraiser-gala-and-awards-night',
      title: 'BBAM fundraiser, gala and awards night',
      excerpt: 'The United Voice of African Associations celebrated achievement, creativity and community at the BBAM fundraiser and awards evening.',
      content: 'The United Voice of African Associations celebrated achievement, creativity and community at the BBAM fundraiser and awards evening. The event brought together entrepreneurs, community leaders, and artists to highlight the vibrant achievements of our members while raising vital funds for youth programmes across Southampton.',
      image: '/images/bbam-gala.jpg',
      category: 'Festival',
      published: true,
      isPublished: true,
      publishedAt: new Date('2024-02-07T12:00:00Z'),
    },
  })

  const news2 = await prisma.newsPost.upsert({
    where: { slug: 'black-history-month-story-telling' },
    update: {},
    create: {
      slug: 'black-history-month-story-telling',
      title: 'Black History Month – Story Telling',
      excerpt: 'A memorable evening of history, lived experience and stories shared by members of our community.',
      content: 'A memorable evening of history, lived experience and stories shared by members of our community. We reflected on the powerful heritage and contributions of African diaspora communities in Hampshire, honoring our past while inspiring the next generation.',
      image: '/images/hidden-histories.png',
      category: 'Culture',
      published: true,
      isPublished: true,
      publishedAt: new Date('2023-11-17T12:00:00Z'),
    },
  })

  const news3 = await prisma.newsPost.upsert({
    where: { slug: 'grant-to-the-united-voice-of-africa-association-southampton' },
    update: {},
    create: {
      slug: 'grant-to-the-united-voice-of-africa-association-southampton',
      title: 'Grant to the United Voice of Africa Association Southampton',
      excerpt: 'Support for TUVAA will help strengthen local programmes, community outreach and opportunities.',
      content: 'Support for TUVAA will help strengthen local programmes, community outreach and opportunities. This funding allows TUVAA to expand essential support services, educational workshops, and cultural celebrations across Southampton and surrounding areas.',
      image: '/images/tuva1-400x450.jpg',
      category: 'Community',
      published: true,
      isPublished: true,
      publishedAt: new Date('2023-11-01T12:00:00Z'),
    },
  })

  // Seed Projects
  const project1 = await prisma.project.upsert({
    where: { slug: 'king-mzilikazi-commemoration' },
    update: {},
    create: {
      slug: 'king-mzilikazi-commemoration',
      title: 'King Mzilikazi Commemoration',
      excerpt: "Retracing King Lobengula's emmisarries' journey from Cape Town, South Africa, to Southampton to meet with Queen Victoria in 1898.",
      content: "The King Mzilikazi Commemoration is one of TUVAA's most significant cultural preservation projects. Our annual commemoration brings together Ndebele and Zulu diaspora communities, alongside the wider Hampshire community, to celebrate and learn about this rich history.",
      image: '/images/King-Mzilikazi-Commemoration.jpg',
      isPublished: true,
      order: 0,
    },
  })

  const project2 = await prisma.project.upsert({
    where: { slug: 'mental-health-project' },
    update: {},
    create: {
      slug: 'mental-health-project',
      title: 'Mental Health Project',
      excerpt: 'TUVAA has forged and established partnerships with various groups and organisations with similar interests.',
      content: "Mental health remains a heavily stigmatized subject within many minority ethnic communities. TUVAA's Mental Health Project aims to break down these barriers by creating safe, non-judgmental environments where Black men and women can talk, share experiences, and receive support.",
      image: '/images/youth.jpg',
      isPublished: true,
      order: 1,
    },
  })

  const project3 = await prisma.project.upsert({
    where: { slug: 'youth-project' },
    update: {},
    create: {
      slug: 'youth-project',
      title: 'Youth Project',
      excerpt: 'TUVAA have run and is running several youth projects including art projects, theatre, football, water sports, swimming, and heritage projects.',
      content: "TUVAA's Youth Project is designed to provide constructive channels for youths from underrepresented backgrounds to build confidence, discover their potential, and acquire critical life skills.",
      image: '/images/youth.png',
      isPublished: true,
      order: 2,
    },
  })

  // Seed Services
  const service1 = await prisma.service.upsert({
    where: { slug: 'health-and-wellbeing-information' },
    update: {},
    create: {
      slug: 'health-and-wellbeing-information',
      title: 'Health and Wellbeing Information',
      excerpt: 'Scan & Donate   Southampton Health and Support Information 1. Emergencies For any health-related emergency, please dial 999 for an ambulance. Calls to this number are always free. 2. Mental Health Support If you need immediate help with your mental health: NHS Urgent Mental Health Triage: Call 111 and…',
      content: 'Scan & Donate   Southampton Health and Support Information\n\n1. Emergencies\nFor any health-related emergency, please dial 999 for an ambulance. Calls to this number are always free.\n\n2. Mental Health Support\nIf you need immediate help with your mental health: NHS Urgent Mental Health Triage: Call 111 and mental health support team will assist you. TUVAA works in close partnership with local health initiatives to ensure community members can access resources and support systems without language or cultural barriers.',
      image: '/images/health-wellbeing-info.jpg',
      isPublished: true,
      publishedAt: new Date('2024-10-15T12:00:00Z'),
      comments: 0,
    },
  })

  const service2 = await prisma.service.upsert({
    where: { slug: 'youth-empowerment' },
    update: {},
    create: {
      slug: 'youth-empowerment',
      title: 'Youth Empowerment',
      excerpt: 'We identify black talents at an ear age, create pathways to nurture and create opportunities for them to realize their potential. We set up TUVAA football club to create opportunities for both boys and girls to realize their potential in sports. Also create them a pathway to become coaches, referees,…',
      content: 'We identify black talents at an ear age, create pathways to nurture and create opportunities for them to realize their potential. We set up TUVAA football club to create opportunities for both boys and girls to realize their potential in sports. Also create them a pathway to become coaches, referees, and leaders to help them realize their potential in sports and beyond.',
      image: '/images/youth-empowerment.jpg',
      isPublished: true,
      publishedAt: new Date('2022-04-19T12:00:00Z'),
      comments: 0,
    },
  })

  const service3 = await prisma.service.upsert({
    where: { slug: 'newtown-community-support-centre' },
    update: {},
    create: {
      slug: 'newtown-community-support-centre',
      title: 'NEWTOWN COMMUNITY SUPPORT CENTRE',
      excerpt: 'An opened access volunteer led service for people living in Bevois and its nearby wards. We provide support in completing a wide range of online forms including visa, passport, benefits, job applications and housing. We also sign post to a wide range of professional services across the city including Citizens…',
      content: 'An opened access volunteer led service for people living in Bevois and its nearby wards. We provide support in completing a wide range of online forms including visa, passport, benefits, job applications and housing. We also sign post to a wide range of professional services across the city including Citizens Advice, local authority services, and various health and support organizations.',
      image: '/images/newtown-community-centre.jpg',
      isPublished: true,
      publishedAt: new Date('2022-04-19T12:00:00Z'),
      comments: 1,
    },
  })

  const service4 = await prisma.service.upsert({
    where: { slug: 'education-and-empowerment' },
    update: {},
    create: {
      slug: 'education-and-empowerment',
      title: 'EDUCATION AND EMPOWERMENT',
      excerpt: 'TUVAA believes in empowerment and the bases of which is education. We run English classes for non-English speaks for 6 years to grasped basic communication skills in English. They are then supported and encouraged to register with ofsted registered training providers. We also run computer and internet training for 5…',
      content: 'TUVAA believes in empowerment and the bases of which is education. We run English classes for non-English speaks for 6 years to grasped basic communication skills in English. They are then supported and encouraged to register with ofsted registered training providers. We also run computer and internet training for 5 years to help participants build essential IT skills and confidence.',
      image: '/images/education-empowerment.jpg',
      isPublished: true,
      publishedAt: new Date('2022-04-19T12:00:00Z'),
      comments: 0,
    },
  })

  const service5 = await prisma.service.upsert({
    where: { slug: 'poverty-and-hunger' },
    update: {},
    create: {
      slug: 'poverty-and-hunger',
      title: 'POVERTY AND HUNGER',
      excerpt: 'TUVAA has run the Fairshare food project for several years and distributed thousands of food items. We also partner with Feed The Community to extend food support.',
      content: 'TUVAA has run the Fairshare food project for several years and distributed thousands of food items. We also partner with Feed The Community to extend food support. In periods of high living costs, these initiatives serve as a vital lifeline for vulnerable families.',
      image: '/images/community-meeting.jpg',
      isPublished: true,
      publishedAt: new Date('2022-04-19T12:00:00Z'),
      comments: 0,
    },
  })

  const service6 = await prisma.service.upsert({
    where: { slug: 'bame-physical-health-and-wellbeing' },
    update: {},
    create: {
      slug: 'bame-physical-health-and-wellbeing',
      title: 'BAME PHYSICAL HEALTH AND WELLBEING',
      excerpt: 'We pride ourselves on promoting the health and wellbeing of our community through accessible programmes, activities and support.',
      content: 'We pride ourselves on promoting the health and wellbeing of our community through accessible programmes, activities and support. Through active fitness workshops, walking clubs, nutrition webinars, and sports leagues, we enable community members of all ages to adopt healthier and happier lifestyles.',
      image: '/images/football-park.jpg',
      isPublished: true,
      publishedAt: new Date('2022-04-19T12:00:00Z'),
      comments: 0,
    },
  })

  const service7 = await prisma.service.upsert({
    where: { slug: 'promoting-african-cultures-and-traditions' },
    update: {},
    create: {
      slug: 'promoting-african-cultures-and-traditions',
      title: 'Promoting African Cultures and Traditions',
      excerpt: 'Celebrating, showcasing and preserving African heritage, music, dance and arts.',
      content: 'TUVAA hosts events, workshops and cultural festivals celebrating African traditions across Hampshire.',
      image: '/images/african-dance.jpg',
      isPublished: true,
      publishedAt: new Date('2020-08-31T12:00:00Z'),
      comments: 0,
    },
  })

  const service8 = await prisma.service.upsert({
    where: { slug: 'bame-mental-health-and-wellbeing' },
    update: {},
    create: {
      slug: 'bame-mental-health-and-wellbeing',
      title: 'BAME Mental Health and Wellbeing',
      excerpt: 'Community support groups, sports, swimming, and counselling referrals.',
      content: 'Providing safe, culturally-informed spaces for physical and mental health support.',
      image: '/images/african-family-group.jpg',
      isPublished: true,
      publishedAt: new Date('2020-08-31T12:00:00Z'),
      comments: 0,
    },
  })

  const service9 = await prisma.service.upsert({
    where: { slug: 'hidden-histories' },
    update: {},
    create: {
      slug: 'hidden-histories',
      title: 'HIDDEN HISTORIES',
      excerpt: 'Unearthing local African histories and contributions to the Hampshire community.',
      content: 'Unearthing local African histories and contributions to the Hampshire community. We worked with Dr Cheryl Butler to publish a book called Hidden History, celebrating important stories and overlooked community heritage in the Hampshire region.',
      image: '/images/hidden-histories.png',
      isPublished: true,
      publishedAt: new Date('2026-07-18T12:00:00Z'),
      comments: 0,
    },
  })

  const service10 = await prisma.service.upsert({
    where: { slug: 'community-street-cleaning' },
    update: {},
    create: {
      slug: 'community-street-cleaning',
      title: 'Community Street Cleaning',
      excerpt: 'Community action to clean and maintain public spaces in Southampton.',
      content: 'TUVAA organizes volunteer street cleaning projects across local neighborhoods in Southampton.',
      image: '/images/community-street-cleaning.jpg',
      isPublished: true,
      publishedAt: new Date('2017-12-07T12:00:00Z'),
      comments: 0,
    },
  })

  // Seed Directory Listings for Community Groups
  const group1 = await prisma.directoryListing.upsert({
    where: { slug: 'gambia-kaffo-southampton' },
    update: {},
    create: {
      type: 'community_group',
      title: 'Gambia Kaffo Southampton',
      slug: 'gambia-kaffo-southampton',
      category: 'Gambian Community',
      description: 'Connecting Gambian families and supporting culture, welfare and community participation.',
      image: '/images/african-family-group.jpg',
      email: 'info@tuvaa.org.uk',
      isPublished: true,
      order: 0,
    },
  })

  const group2 = await prisma.directoryListing.upsert({
    where: { slug: 'nigerian-association-hampshire' },
    update: {},
    create: {
      type: 'community_group',
      title: 'Nigerian Association Hampshire',
      slug: 'nigerian-association-hampshire',
      category: 'Nigerian Community',
      description: 'Networking, cultural events and practical support for Nigerian residents.',
      image: '/images/community-meeting.jpg',
      email: 'info@tuvaa.org.uk',
      isPublished: true,
      order: 1,
    },
  })

  const group3 = await prisma.directoryListing.upsert({
    where: { slug: 'zimbabwean-community-network' },
    update: {},
    create: {
      type: 'community_group',
      title: 'Zimbabwean Community Network',
      slug: 'zimbabwean-community-network',
      category: 'Zimbabwean Community',
      description: 'Family welfare, integration support and cultural programmes.',
      image: '/images/events-cultural.jpg',
      email: 'info@tuvaa.org.uk',
      isPublished: true,
      order: 2,
    },
  })

  const group4 = await prisma.directoryListing.upsert({
    where: { slug: 'malawi-community-hampshire' },
    update: {},
    create: {
      type: 'community_group',
      title: 'Malawi Community Hampshire',
      slug: 'malawi-community-hampshire',
      category: 'Malawian Community',
      description: 'A supportive forum linking members with events and local opportunities.',
      image: '/images/newtown-community-centre.jpg',
      email: 'info@tuvaa.org.uk',
      isPublished: true,
      order: 3,
    },
  })

  console.log('Seed completed:')
  console.log({ superAdmin, admin, subAdmin, tester, campaignYoungPeople, campaignWomen, campaignBbam, event1, event2, event3, news1, news2, news3, project1, project2, project3, service1, service2, service3, service4, service5, service6, service7, service8, service9, service10, group1, group2, group3, group4 })

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
