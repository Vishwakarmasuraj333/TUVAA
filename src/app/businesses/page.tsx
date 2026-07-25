import type { Metadata } from 'next'
import DirectoryPage from '@/components/directory/DirectoryPage'
import { getDirectoryListings } from '@/lib/directory'

export const metadata: Metadata = { title: 'BBAM Businesses Directory', description: 'Discover Black and African-owned businesses in the TUVAA network.' }
export const dynamic = 'force-dynamic'

export default async function BusinessesPage() {
  return <DirectoryPage type="business" listings={await getDirectoryListings('business')} />
}
