import type { Metadata } from 'next'
import PageBanner from '@/components/common/PageBanner'
import BlogSidebar from '@/components/common/BlogSidebar'
import SectionTitle from '@/components/common/SectionTitle'
import AfricanGroupForm from '@/components/forms/AfricanGroupForm'
import { Landmark, Users2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Community Groups',
  description: 'Connect with African community groups in Southampton and Hampshire.',
}

export const dynamic = 'force-dynamic'

const groups = [
  { name: 'GAMBIA', desc: 'The Gambian community of Southampton is supported by Gambia Kaffo. If you want to find more about this group contact us.' },
  { name: 'NIGERIA', desc: 'The Nigerian community of Southampton is supported by the Nigerian Association. If you want to find more about this group contact us.' },
  { name: 'ZIMBABWE', desc: 'The Zimbabwean community of Southampton is supported by the Zimbabwean Network. If you want to find more about this group contact us.' },
  { name: 'MALAWI', desc: 'The Malawian community of Southampton is supported by the Malawi Association. If you want to find more about this group contact us.' },
  { name: 'UGANDA', desc: 'The Ugandan community of Southampton is supported by the Ugandan Association. If you want to find more about this group contact us.' },
  { name: 'GHANA', desc: 'The Ghanaian community of Southampton is supported by the Ghana Association. If you want to find more about this group contact us.' },
]

export default async function CommunityGroupsPage() {
  return (
    <div className="w-full bg-[#f8f6f2] text-[#1f1a17]">
      <PageBanner title="Community Groups" breadcrumb="Community Groups" />

      <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start lg:px-10 lg:py-24">
        <main>
          <div className="mb-12 max-w-5xl text-base leading-8 text-[#8b8178] sm:text-lg">
            TUVAA is keen to promote the great work done by various black communities across Southampton and Hampshire. Some of these great community groups can be found here.
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mb-24">
            {groups.map((group) => (
              <div key={group.name} className="border border-[#eee7dc] bg-white text-center flex flex-col items-center justify-center p-8 aspect-square transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md">
                <h2 className="font-cinzel text-2xl md:text-[22px] font-bold uppercase mb-6 text-[#35170f]">{group.name}</h2>
                <p className="text-sm leading-7 text-[#8b8178]">{group.desc}</p>
              </div>
            ))}
          </div>

        </main>
        
        <BlogSidebar />
      </div>
    </div>
  )
}
