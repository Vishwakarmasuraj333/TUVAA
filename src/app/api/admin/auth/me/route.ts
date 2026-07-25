import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma, isDbAvailable } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let userDetails = {
      id: session.id || 'admin-default-id',
      name: session.name || 'TUVAA Administrator',
      email: session.email,
      role: session.role || 'ADMIN',
      dpUrl: null as string | null,
    }

    const dbOnline = await isDbAvailable()
    if (dbOnline) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.email }
        })
        if (dbUser) {
          userDetails = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            dpUrl: (dbUser as any).dpUrl || null,
          }
        }
      } catch (err) {
        console.warn('DB query failed in /api/admin/auth/me, using session payload:', err)
      }
    }

    return NextResponse.json({ user: userDetails })
  } catch (error) {
    console.error('Error in /api/admin/auth/me:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
