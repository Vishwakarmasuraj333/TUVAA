import PageBanner from '@/components/common/PageBanner'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Youth Project - TUVAA',
  description:
    'TUVAA Youth Project builds leadership, confidence, and teamwork through art, theatre, football, water sports, swimming, and heritage projects.',
}

export default function YouthProjectPage() {
  return (
    <div className="w-full bg-white">
      <PageBanner
        title="Youth Project"
        breadcrumb="Youth Project"
      />

      {/* Content Section */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[920px] px-6 py-[60px] md:py-[80px]">
          <div className="text-[#8b8178] text-[15px] leading-[1.8]">
            {/* Image floated left on desktop, full-width on mobile */}
            <div className="float-none md:float-left md:mr-8 mb-6 md:mb-4 md:w-[260px] lg:w-[300px]">
              <Image
                src="/images/youth.png"
                alt="Youth Project - Children jumping with colorful background"
                width={300}
                height={220}
                className="w-full h-auto object-contain"
                priority
              />
            </div>

            <p className="mb-5">
              TUVAA have run and is running several youth projects including art projects, theatre, football, water sports, swimming, and heritage projects. We are the winners of 2021 EDI community award for grassroot football.
            </p>

            <p className="mb-5">
              TUVAA continues to create opportunities for our children and young people to experiment and learn new skills by engaging them on a wide range of activities. TUVAA runs science projects and financial education to prepare our kids for an uncertain future.
            </p>

            <p>
              TUVAA also teaches our children our African languages such as Igbo, Mandinka and Wolof. This enables our young people to connect with their heritage and improve sense of identity.
            </p>
          </div>

          {/* Back to Projects */}
          <div className="mt-12 pt-8 border-t border-[#e8e0d4] clear-both">
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
