import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PageBanner from '@/components/common/PageBanner'
import ServiceCommentForm from '@/components/services/ServiceCommentForm'
import { getServiceBySlug, getAllServices } from '@/lib/services'

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const services = await getAllServices()
    return services.map((s) => ({
      slug: s.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for services:', error)
    return []
  }
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: `${service.title} – TUVAA`,
    description: `TUVAA ${service.title} service detail page.`,
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  return (
    <div className="w-full bg-white text-zinc-800">
      {/* Reusable Page Banner */}
      <PageBanner
        title={service.title}
        breadcrumb={
          <>
            <Link href="/our-services" className="text-white hover:text-[#DB9E30] transition-colors duration-250 font-medium">
              All Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90 font-medium">{service.title}</span>
          </>
        }
      />

      <article className="w-full max-w-[760px] mx-auto px-6 pt-[55px] md:pt-[80px] pb-[70px] text-center flex flex-col items-center">
        {/* Feature Image Wrapper */}
        <div className="relative aspect-[16/9] w-full max-w-[680px] rounded-sm overflow-hidden shadow-sm border border-zinc-100 mb-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 680px"
            className="object-cover object-center bg-zinc-50"
          />
        </div>

        {/* Content Paragraph */}
        <div className="w-full max-w-[760px] mt-[45px] text-left text-[#8b8178] text-[15px] md:text-[18px] leading-[1.8] font-roboto text-justify space-y-6">
          {service.content && (
            <p className="whitespace-pre-line">{service.content}</p>
          )}
        </div>

        {/* Divider Line */}
        <div className="w-full border-t border-[#eee8df] mt-[60px]" />

        {/* Leave a Comment form */}
        <div className="w-full mt-10">
          <ServiceCommentForm serviceSlug={service.slug} />
        </div>
      </article>
    </div>
  )
}
