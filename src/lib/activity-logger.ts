import { prisma } from './prisma'
import { getSession } from './auth'

export type ActivityAction = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'BULK_DELETE'
  | 'STATUS_UPDATE'
  | 'PASSWORD_CHANGE'
  | 'SETTINGS_UPDATE'

interface LogActivityProps {
  action: ActivityAction
  entity: string
  entityId?: string
  message: string
  metadata?: any
  userId?: string
}

export async function logActivity(data: LogActivityProps) {
  try {
    let userId = data.userId
    
    // If no user ID provided, try to get from session
    if (!userId) {
      const session = await getSession()
      if (session) {
        userId = session.id
      }
    }

    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        message: data.message,
        metadata: data.metadata ? data.metadata : undefined,
      }
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}
