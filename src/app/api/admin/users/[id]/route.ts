import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { hashPassword } from '@/lib/password'
import { userSchema } from '@/lib/validations/users'
import { logActivity } from '@/lib/activity-log'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role !== 'super_admin') {
    return NextResponse.json({ message: 'Forbidden: Super Admin only access' }, { status: 403 })
  }

  const { id } = await params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error('API admin user fetch error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role !== 'super_admin') {
    return NextResponse.json({ message: 'Forbidden: Super Admin only access' }, { status: 403 })
  }

  const { id } = await params

  try {
    const formData = await req.formData()
    
    const name = formData.get('name') as string | null
    const email = formData.get('email') as string | null
    const role = formData.get('role') as string | null
    const password = formData.get('password') as string | null
    const dpFile = formData.get('dpFile') as File | null
    
    const updateData: any = {}
    
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    
    if (password && password.trim() !== '') {
      updateData.password = hashPassword(password)
    }

    if (dpFile) {
      const arrayBuffer = await dpFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const { uploadToCloudinary } = await import('@/lib/cloudinary')
      try {
        const uploadResult: any = await uploadToCloudinary(buffer, 'tuvaa/users', 'image')
        updateData.dpUrl = uploadResult.secure_url
      } catch (err) {
        return NextResponse.json({ message: 'Failed to upload profile picture' }, { status: 500 })
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // @ts-ignore
        dpUrl: true,
        isActive: true,
      },
    })

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'UPDATE',
      entity: 'USER',
      entityId: user.id,
      message: `Updated admin user: "${user.name}" (${user.email}), role: "${user.role}"`,
      ipAddress,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('API admin user update error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  if (session.role !== 'super_admin') {
    return NextResponse.json({ message: 'Forbidden: Super Admin only access' }, { status: 403 })
  }

  const { id } = await params

  if (session.id === id) {
    return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id },
    })

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    await logActivity({
      userId: session.id,
      action: 'DELETE',
      entity: 'USER',
      entityId: id,
      message: `Deleted admin user account: "${user.name}" (${user.email})`,
      ipAddress,
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('API admin user delete error:', error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}

