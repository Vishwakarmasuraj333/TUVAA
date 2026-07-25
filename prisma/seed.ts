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

  console.log('Seed completed:')
  console.log({ superAdmin, admin, subAdmin, tester })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
