import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tuvaa-admin-secret-key-super-secure'
)

export const AUTH_COOKIE_NAME = 'tuvaa_auth'

export interface SessionPayload {
  id: string
  name: string
  email: string
  role: string
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch (error) {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) return null

  return await verifyToken(token)
}

export function hasRole(session: SessionPayload | null, roles: string[]): boolean {
  if (!session || !session.role) return false
  const userRole = session.role.toLowerCase()
  if (userRole === 'tester') return false
  const allowedRoles = roles.map((r) => r.toLowerCase())
  return (
    allowedRoles.includes(userRole) ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    userRole === 'sub_admin' ||
    userRole === 'administrator'
  )
}
