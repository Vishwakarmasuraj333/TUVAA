import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Mail, Phone } from 'lucide-react'
import PageBanner from '@/components/common/PageBanner'
import BlogSidebar from '@/components/common/BlogSidebar'
import ArtistGallery from '@/components/directory/ArtistGallery'
import { directoryPageContent, DirectoryListingView, DirectoryType } from '@/data/directory'

export default function DirectoryPage({ type, listings }: { type: DirectoryType; listings: DirectoryListingView[] }) {
  const content = directoryPageContent[type]
  const galleryImages = type === 'artist'
    ? listings.flatMap((listing) => (listing.gallery?.length ? listing.gallery : listing.image ? [listing.image] : [])).map((src, index) => ({ src, alt: `${listings[Math.min(index, listings.length - 1)]?.title || 'BBAM'} artwork` }))
    : []

  return (
    <div className="w-full bg-white text-[#35170f]">
      <PageBanner title={content.title} breadcrumb={content.title} />
      <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start lg:px-10 lg:py-24">
        <main>
          <p className="mb-12 max-w-5xl text-base leading-8 text-[#8b8178] sm:text-lg">{content.intro}</p>

          {type === 'artist' && galleryImages.length > 0 ? (
            <ArtistGallery images={galleryImages} />
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
              {listings.map((listing) => (
                <article key={listing.id} className="group overflow-hidden border border-[#eee7dc] bg-white shadow-[0_8px_30px_rgba(53,23,15,0.07)] transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#f2eee8]">
                    {listing.image ? <Image src={listing.image} alt={listing.title} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center font-cinzel text-sm text-[#9a8d83]">TUVAA BBAM</div>}
                  </div>
                  <div className="p-6">
                    {listing.category && <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#DB9E30]">{listing.category}</p>}
                    <h2 className="font-cinzel text-xl font-bold leading-tight">{listing.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#8b8178]">{listing.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2.5 border-t border-[#eee7dc] pt-4 text-xs text-[#6f625a]">
                      {(listing.email || listing.type === 'musician' || type === 'musician') && (
                        <a
                          href={`mailto:${(listing.email || 'info@tuvaa.org.uk').trim()}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#dcd4c8] rounded hover:border-[#DB9E30] hover:text-[#57a68f] transition-colors focus:outline-none focus:ring-1 focus:ring-[#DB9E30] bg-white font-medium cursor-pointer"
                          aria-label={`Email ${listing.title}`}
                        >
                          <Mail className="h-3.5 w-3.5" /> Email
                        </a>
                      )}
                      {listing.phone && (
                        <a
                          href={`tel:${listing.phone.trim()}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#dcd4c8] rounded hover:border-[#DB9E30] hover:text-[#57a68f] transition-colors focus:outline-none focus:ring-1 focus:ring-[#DB9E30] bg-white font-medium cursor-pointer"
                          aria-label={`Call ${listing.title}`}
                        >
                          <Phone className="h-3.5 w-3.5" /> Call
                        </a>
                      )}
                      {listing.website && (
                        <a
                          href={listing.website.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#dcd4c8] rounded hover:border-[#DB9E30] hover:text-[#57a68f] transition-colors focus:outline-none focus:ring-1 focus:ring-[#DB9E30] bg-white font-medium cursor-pointer"
                          aria-label={`Visit website of ${listing.title}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Website
                        </a>
                      )}
                    </div>
                    {type === 'community_group' && <Link href="/african-community-group" className="btn-primary-hover mt-5 inline-block rounded-sm px-5 py-2.5 font-cinzel text-[10px] font-bold uppercase tracking-widest">Register a group</Link>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
        <BlogSidebar />
      </div>
    </div>
  )
}
