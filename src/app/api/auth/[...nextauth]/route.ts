import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  return NextResponse.json({
    user: session
      ? {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
        }
      : null,
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  })
}

export async function POST() {
  const session = await getSession()
  return NextResponse.json({
    user: session
      ? {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
        }
      : null,
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  })
}

