import type { Metadata } from 'next'
import DirectoryPage from '@/components/directory/DirectoryPage'
import { getDirectoryListings } from '@/lib/directory'

export const metadata: Metadata = { title: 'BBAM Artists Directory', description: 'Discover artists supported by TUVAA and the BBAM Festival.' }
export const dynamic = 'force-dynamic'

export default async function ArtistsPage() {
  return <DirectoryPage type="artist" listings={await getDirectoryListings('artist')} />
}
