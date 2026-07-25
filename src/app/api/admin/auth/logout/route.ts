import { NextResponse } from 'next/server'
import { clearSession, getSession } from '@/lib/session'
import { logActivity } from '@/lib/activity-log'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (session) {
      const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      await logActivity({
        userId: session.id,
        action: 'LOGOUT',
        entity: 'USER',
        entityId: session.id,
        message: `User ${session.email} logged out successfully`,
        ipAddress,
      })
    }
    await clearSession()
    return NextResponse.json({ message: 'Logged out successfully.' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}

