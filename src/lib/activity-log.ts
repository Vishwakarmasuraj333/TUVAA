import { prisma } from './prisma'

interface LogActivityParams {
  userId?: string | null
  action: string
  entity: string
  entityId?: string | null
  message: string
  metadata?: any
  ipAddress?: string | null
}

export async function logActivity({
  userId,
  action,
  entity,
  entityId,
  message,
  metadata,
  ipAddress,
}: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        entity,
        entityId: entityId || null,
        message,
        metadata: metadata || null,
        ipAddress: ipAddress || null,
      },
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}
