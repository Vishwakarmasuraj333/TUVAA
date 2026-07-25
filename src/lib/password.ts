import bcrypt from 'bcryptjs'

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function comparePassword(password: string, hashed: string): boolean {
  return bcrypt.compareSync(password, hashed)
}
