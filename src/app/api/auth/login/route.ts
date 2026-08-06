import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid credentials or inactive account' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({ success: true, redirectUrl: '/admin' })

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    })

    // Log the login activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        message: 'User logged in',
        ipAddress: request.headers.get('x-forwarded-for') || 'Unknown',
      }
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
