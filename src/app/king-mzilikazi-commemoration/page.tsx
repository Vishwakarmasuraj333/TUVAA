import PageBanner from '@/components/common/PageBanner'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'King Mzilikazi Commemoration - TUVAA',
  description:
    'Learn about the annual King Mzilikazi Commemoration event organized by TUVAA, celebrating Ndebele culture, music, dances, and history.',
}

export default function KingMzilikaziPage() {
  return (
    <div className="w-full bg-white">
      <PageBanner
        title="King Mzilikazi Commemoration"
        breadcrumb="King Mzilikazi Commemoration"
      />

      {/* Content Section */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[960px] px-6 py-[60px] md:py-[80px]">
          {/* Two-column layout: poster left, text right */}
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 md:gap-12 items-start">
            {/* Poster Image */}
            <div className="w-full max-w-[300px] mx-auto md:mx-0">
              <Image
                src="/images/King-Mzilikazi-Commemoration.jpg"
                alt="King Mzilikazi Commemoration 2023 - Dance, Lecture, Poetry, Singing, Food, Drumming"
                width={300}
                height={400}
                className="w-full h-auto object-cover shadow-md"
                priority
              />
            </div>

            {/* Text Content */}
            <div className="space-y-6 text-[#8b8178] text-[15px] leading-[1.8]">
              <p>
                Retracing King Lobengula&apos;s emmisarries&apos; journey from Cape Town, South Africa, to Southampton to meet with Queen Victoria in 1898.
              </p>

              <p>
                In the last 3 years, the Zimbabwe society, in Association with TUVAA, held successful cultural commemoration of King Mzilikazi, the founder of the Ndebele nation who died in 1868. Hundreds of people from various cultural backgrounds across the globe, tuned in to watch the function which entailed, cultural song and dance, speeches and narrations of King Mzilikazi&apos;s journey, in 1823, fleeing Shaka the Zulu king, in Zululand, to the beginning of his Ndebele nation building by conquering various tribes in South Africa, moving up north with them, crossing the Limpopo River, until he reached the capital Bulawayo, in present day Zimbabwe.
              </p>
            </div>
          </div>

          {/* Full-width paragraphs below */}
          <div className="mt-10 space-y-6 text-[#8b8178] text-[15px] leading-[1.8]">
            <p>
              The event also featured a short film about 2 mercenaries sent by King Lobengula, the second Ndebele king and son to King Mzilikazi, to London in Retracing emissaries&apos; journey from South Africa.
            </p>

            <p>
              The other aim of this event was to show the link between the Ndebele people and Southampton: the 2 mercenaries landed at the Southampton Docks and stayed at the London Hotel, in Oxford Street, before meeting with Queen Victoria in London the following day. These were very colourful events.
            </p>
          </div>

          {/* Back to Projects */}
          <div className="mt-12 pt-8 border-t border-[#e8e0d4]">
            <Link
              href="/our-projects"
              className="btn-primary-hover inline-block font-semibold text-sm px-[26px] py-[12px] rounded-sm"
            >
              ← Back to Our Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
