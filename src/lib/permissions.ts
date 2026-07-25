import { SessionPayload } from './auth'

export function isSuperAdmin(user: SessionPayload | null | undefined): boolean {
  return user?.role === 'super_admin'
}

export function isAdminOrSuperAdmin(user: SessionPayload | null | undefined): boolean {
  return user?.role === 'admin' || user?.role === 'super_admin'
}

export function isTester(user: SessionPayload | null | undefined): boolean {
  return user?.role === 'tester'
}

export function canWrite(user: SessionPayload | null | undefined): boolean {
  return user?.role === 'admin' || user?.role === 'super_admin'
}

export function canDelete(user: SessionPayload | null | undefined): boolean {
  // Super Admins can delete anything. Admins can delete regular content if allowed, 
  // but Super Admin manages settings, users and core structures.
  // The user rules specify: 
  // - super_admin: Full access, Delete records, manage settings
  // - admin: Manage content, cannot delete super admin, cannot change roles
  // So we will allow admin to create/update content, but delete should ideally be super_admin or admin depending on content.
  // Let's enforce that tester cannot write/delete, admin can write, super_admin has full delete.
  return user?.role === 'super_admin' || user?.role === 'admin'
}

export function canManageUsers(user: SessionPayload | null | undefined): boolean {
  return user?.role === 'super_admin'
}
