import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const action = searchParams.get('action') || ''
    const entity = searchParams.get('entity') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    // Build filters
    const where: any = {}

    if (search) {
      where.OR = [
        { message: { contains: search } },
        { action: { contains: search } },
        { entity: { contains: search } },
      ]
    }

    if (action) {
      where.action = action
    }

    if (entity) {
      where.entity = entity
    }

    // Get total count
    const total = await prisma.activityLog.count({ where })

    // Fetch matching logs
    const logs = await prisma.activityLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    // Fetch user details for each log
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    const userMap = new Map(users.map((u) => [u.id, u]))

    const logsWithUser = logs.map((log) => ({
      ...log,
      user: log.userId ? userMap.get(log.userId) || { name: 'Unknown User', email: 'unknown@tuvaa.org.uk' } : null,
    }))

    return NextResponse.json({
      logs: logsWithUser,
      totalPages: Math.ceil(total / limit),
      total,
      page,
      limit,
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
