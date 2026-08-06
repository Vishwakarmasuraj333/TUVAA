import type { Metadata } from 'next'
import PageBanner from '@/components/common/PageBanner'
import BlogSidebar from '@/components/common/BlogSidebar'
import { getDirectoryListings } from '@/lib/directory'
import { Users2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Community Groups',
  description: 'Connect with African community groups in Southampton and Hampshire.',
}

export const dynamic = 'force-dynamic'

export default async function CommunityGroupsPage() {
  const listings = await getDirectoryListings('community_group')

  return (
    <div className="w-full bg-[#f8f6f2] text-[#1f1a17]">
      <PageBanner title="Community Groups" breadcrumb="Community Groups" />

      <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start lg:px-10 lg:py-24">
        <main>
          <div className="mb-12 max-w-5xl text-base leading-8 text-[#8b8178] sm:text-lg">
            TUVAA is keen to promote the great work done by various black communities across Southampton and Hampshire. Some of these great community groups can be found here.
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {listings.map((group) => (
              <div key={group.id} className="border border-[#eee7dc] bg-white text-center flex flex-col items-center justify-center p-8 aspect-square transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md rounded-sm">
                <div className="w-12 h-12 rounded-full bg-[#DB9E30]/10 flex items-center justify-center text-[#DB9E30] mb-4">
                  <Users2 className="h-6 w-6" />
                </div>
                <h2 className="font-cinzel text-xl md:text-[20px] font-bold uppercase mb-4 text-[#35170f]">{group.title}</h2>
                <p className="text-xs leading-6 text-[#8b8178] line-clamp-4">{group.description}</p>
                {group.email && (
                  <a href={`mailto:${group.email}`} className="mt-4 text-[11px] font-bold font-cinzel text-[#DB9E30] hover:text-[#57a68f]">
                    Contact Group
                  </a>
                )}
              </div>
            ))}
          </div>
        </main>
        
        <BlogSidebar />
      </div>
    </div>
  )
}

