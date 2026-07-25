import PageBanner from '@/components/common/PageBanner'
import GalleryTabs from '@/components/gallery/GalleryTabs'
import { getGalleryItems } from '@/lib/gallery'

export const metadata = {
  title: 'Gallery - TUVAA',
  description: 'View photos and videos of TUVAA cultural events, King Mzilikazi Commemorations, and Youth water sports in Southampton.',
}

export const revalidate = 0

export default async function GalleryPage() {
  const items = await getGalleryItems()

  return (
    <div className="w-full bg-white pb-20">
      {/* Banner */}
      <PageBanner title="Gallery" breadcrumb="Gallery" />

      {/* Tabs Layout */}
      <GalleryTabs initialItems={items} />
    </div>
  )
}
