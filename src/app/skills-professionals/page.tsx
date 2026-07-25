import type { Metadata } from 'next'
import DirectoryPage from '@/components/directory/DirectoryPage'
import { getDirectoryListings } from '@/lib/directory'

export const metadata: Metadata = { title: 'BBAM Skills and Professionals', description: 'Connect with skilled professionals in the TUVAA community.' }
export const dynamic = 'force-dynamic'

export default async function ProfessionalsPage() {
  return <DirectoryPage type="professional" listings={await getDirectoryListings('professional')} />
}
