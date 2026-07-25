import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'NextAuth is disabled. Use custom credentials endpoint.' })
}

export async function POST() {
  return NextResponse.json({ message: 'NextAuth is disabled. Use custom credentials endpoint.' })
}
