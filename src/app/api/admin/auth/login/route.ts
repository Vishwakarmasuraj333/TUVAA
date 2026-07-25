import { NextResponse } from 'next/server'
import { prisma, isDbAvailable } from '@/lib/prisma'
import { comparePassword } from '@/lib/password'
import { signToken } from '@/lib/auth'
import { setSession } from '@/lib/session'
import { logActivity } from '@/lib/activity-log'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = LoginSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email, password } = parsed.data

    const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'admin@tuvaa.org.uk').toLowerCase()
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'AdminTUVAA2026!'

    let user: { id: string; name: string; email: string; role: string; password?: string; isActive?: boolean } | null = null
    const dbOnline = await isDbAvailable()

    if (dbOnline) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email },
        })
        if (dbUser) {
          const isMatch = comparePassword(password, dbUser.password)
          if (isMatch && dbUser.isActive) {
            user = dbUser
          }
        }
      } catch (err) {
        console.warn('Database query failed, falling back to admin config checks:', err)
      }
    }

    // Fallback to environment default admin credentials if DB is offline or user not found in DB
    if (!user) {
      if (email.toLowerCase() === defaultAdminEmail && password === defaultAdminPassword) {
        user = {
          id: 'admin-default-id',
          name: 'TUVAA Administrator',
          email: defaultAdminEmail,
          role: 'ADMIN',
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials or inactive account.' },
        { status: 401 }
      )
    }

    const sessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    const token = await signToken(sessionPayload)
    await setSession(token)

    // Log Activity safely without throwing if DB is offline
    if (dbOnline) {
      const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      try {
        await logActivity({
          userId: user.id,
          action: 'LOGIN',
          entity: 'USER',
          entityId: user.id,
          message: `User ${user.email} logged in successfully`,
          ipAddress,
        })
      } catch {
        // Ignore logging errors when DB has issues
      }
    }

    return NextResponse.json({
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 })
  }
}

