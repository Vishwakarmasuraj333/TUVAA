import type { Metadata } from 'next'
import DirectoryPage from '@/components/directory/DirectoryPage'
import { getDirectoryListings } from '@/lib/directory'

export const metadata: Metadata = { title: 'BBAM Musicians Directory', description: 'Discover musicians and performers supported by TUVAA and BBAM.' }
export const dynamic = 'force-dynamic'

export default async function MusiciansPage() {
  return <DirectoryPage type="musician" listings={await getDirectoryListings('musician')} />
}
