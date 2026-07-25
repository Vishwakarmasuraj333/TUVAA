import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { directoryTypes } from '@/data/directory'

export async function GET(request: Request) {
  const type = new URL(request.url).searchParams.get('type')
  if (type && !directoryTypes.includes(type as (typeof directoryTypes)[number])) {
    return NextResponse.json({ message: 'Invalid directory type' }, { status: 400 })
  }
  try {
    const listings = await prisma.directoryListing.findMany({
      where: { isPublished: true, ...(type ? { type } : {}) },
      orderBy: [{ order: 'asc' }, { title: 'asc' }],
    })
    return NextResponse.json(listings)
  } catch (error) {
    console.error('Public directory API error:', error)
    return NextResponse.json({ message: 'Directory is temporarily unavailable' }, { status: 503 })
  }
}
