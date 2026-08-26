'use client'

import { useState } from 'react'
import Card from '@/components/common/Card'
import { Search, MapPin, Mail } from 'lucide-react'

interface CommunityGroup {
  id: string
  name: string
  description: string
  image: string | null
  contact: string | null
}

interface CommunityGroupsListProps {
  initialGroups: CommunityGroup[]
}

export default function CommunityGroupsList({ initialGroups }: CommunityGroupsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGroups = initialGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-12">
      {/* Search Input Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gold-500/60" />
        <input
          type="text"
          placeholder="Filter by country or community group name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-black/40 border border-gold-500/20 rounded focus:outline-none focus:border-gold-500 text-sm transition-colors text-white"
        />
      </div>

      {/* Community Grid */}
      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="border-gold-500/10">
              <div className="space-y-4 text-left flex flex-col justify-between h-full">
                <div className="space-y-3">
                  {/* Visual Silhouette/Flag Placeholder */}
                  <div className="relative h-32 bg-gradient-to-br from-[#201004] via-[#0d0905] to-[#120803] rounded flex items-center justify-center border border-gold-500/5">
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#e9ab2d_1px,transparent_1px)] [background-size:12px_12px]" />
                    <span className="font-cinzel text-xs font-bold text-gold-500/70 tracking-widest uppercase border border-gold-500/20 px-3 py-1.5 rounded">
                      {group.name} Group
                    </span>
                  </div>

                  <h3 className="font-cinzel text-lg text-white font-bold uppercase tracking-wider">
                    {group.name}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed min-h-[64px] line-clamp-3">
                    {group.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gold-500/10 mt-6 flex flex-col gap-2">
                  {group.contact && (
                    <a
                      href={
                        group.contact.includes('@')
                          ? `mailto:${group.contact}`
                          : group.contact.startsWith('http')
                          ? group.contact
                          : `mailto:${group.contact}`
                      }
                      target={group.contact.startsWith('http') ? '_blank' : undefined}
                      rel={group.contact.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-[10px] text-white/50 hover:text-gold-500 flex items-center gap-1.5 mb-2 line-clamp-1 transition-colors"
                      aria-label={`Contact ${group.name}`}
                    >
                      <Mail className="h-3 w-3 text-gold-500 shrink-0" />
                      Contact: {group.contact}
                    </a>
                  )}
                  <a
                    href={
                      group.contact
                        ? group.contact.includes('@')
                          ? `mailto:${group.contact}`
                          : group.contact.startsWith('http')
                          ? group.contact
                          : 'mailto:info@tuvaa.org.uk'
                        : 'mailto:info@tuvaa.org.uk'
                    }
                    target={group.contact?.startsWith('http') ? '_blank' : undefined}
                    rel={group.contact?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block text-center bg-gold-600 hover:bg-gold-500 text-[#0d0905] font-cinzel font-bold text-[10px] uppercase tracking-widest py-2.5 rounded transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500"
                    aria-label={`Contact ${group.name}`}
                  >
                    Contact Group
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-white/40 text-sm">
          No community groups matching "{searchQuery}" found.
        </div>
      )}
    </div>
  )
}
