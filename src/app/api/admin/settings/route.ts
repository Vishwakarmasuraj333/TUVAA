import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { hashPassword, comparePassword } from '@/lib/password'
import { logActivity } from '@/lib/activity-log'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.siteSetting.findMany()
    const config: Record<string, string> = {}
    settings.forEach((s) => {
      config[s.key] = s.value
    })

    return NextResponse.json(config, { status: 200 })
  } catch (error) {
    console.error('Error fetching admin settings:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')

    // 1. UPDATE USER PROFILE
    if (action === 'PROFILE') {
      const { name, email } = body
      if (!name || !email) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
      }

      // Check if email is already in use by someone else
      const existingUser = await prisma.user.findFirst({
        where: { email, NOT: { id: session.id } },
      })
      if (existingUser) {
        return NextResponse.json({ message: 'Email is already in use' }, { status: 400 })
      }

      const updated = await prisma.user.update({
        where: { id: session.id },
        data: { name, email },
      })

      await logActivity({
        userId: session.id,
        action: 'UPDATE',
        entity: 'USER',
        entityId: session.id,
        message: `Updated own profile: Name to "${updated.name}", Email to "${updated.email}"`,
        ipAddress,
      })

      return NextResponse.json({ message: 'Profile updated successfully', user: updated })
    }

    // 2. CHANGE PASSWORD
    if (action === 'PASSWORD') {
      const { currentPassword, newPassword } = body
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ message: 'Missing password fields' }, { status: 400 })
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ message: 'New password must be at least 8 characters long' }, { status: 400 })
      }

      // Fetch user from DB to verify password
      const user = await prisma.user.findUnique({
        where: { id: session.id },
      })

      if (!user || !comparePassword(currentPassword, user.password)) {
        return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 })
      }

      const hashedPassword = hashPassword(newPassword)
      await prisma.user.update({
        where: { id: session.id },
        data: { password: hashedPassword },
      })

      await logActivity({
        userId: session.id,
        action: 'UPDATE',
        entity: 'USER',
        entityId: session.id,
        message: 'Changed account password successfully',
        ipAddress,
      })

      return NextResponse.json({ message: 'Password changed successfully' })
    }

    // 3. SITE SETTINGS (SUPER ADMIN ONLY)
    if (session.role !== 'super_admin') {
      return NextResponse.json({ message: 'Forbidden: Super Admin access required' }, { status: 403 })
    }

    const { siteSettings } = body
    if (!siteSettings) {
      return NextResponse.json({ message: 'Missing settings payload' }, { status: 400 })
    }

    const keys = Object.keys(siteSettings)
    for (const key of keys) {
      const value = siteSettings[key]
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    }

    await logActivity({
      userId: session.id,
      action: 'UPDATE',
      entity: 'SETTING',
      message: `Updated site settings for keys: ${keys.join(', ')}`,
      ipAddress,
    })

    return NextResponse.json({ message: 'Settings saved successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error saving admin settings:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}


