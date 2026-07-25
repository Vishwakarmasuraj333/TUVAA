import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { hashPassword } from '@/lib/password'
import { userSchema } from '@/lib/validations/users'
import { logActivity } from '@/lib/activity-log'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role !== 'super_admin') {
    return NextResponse.json({ message: 'Forbidden: Super Admin only access' }, { status: 403 })
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('API admin users list error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role !== 'super_admin') {
    return NextResponse.json({ message: 'Forbidden: Super Admin only access' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = userSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 })
    }

    const { name, email, password, role, isActive } = parsed.data
    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 })
    }

    const hashedPassword = hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    })

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'CREATE',
      entity: 'USER',
      entityId: user.id,
      message: `Created admin user: "${user.name}" (${user.email}) with role: "${user.role}"`,
      ipAddress,
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('API admin user create error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

