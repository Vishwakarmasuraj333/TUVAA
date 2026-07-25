import PageBanner from '@/components/common/PageBanner'
import ServicesGrid from '@/components/services/ServicesGrid'
import CommunityStreetCleaning from '@/components/services/CommunityStreetCleaning'
import DonateSection from '@/components/services/DonateSection'
import { getAllServices } from '@/lib/services'

export const metadata = {
  title: 'Our Services - TUVAA',
  description: 'Explore community support services offered by TUVAA, covering BAME Health, Youth Football, Newtown Community Centre, Language and IT Classes.',
}

export default async function OurServicesPage() {
  const services = await getAllServices()

  return (
    <div className="w-full">
      {/* Banner */}
      <PageBanner title="Our Services" breadcrumb="Home / Our Services" />

      {/* Services Grid Section */}
      <ServicesGrid services={services} />

      {/* Street Cleaning Section */}
      <CommunityStreetCleaning />

      {/* Donate Section */}
      <DonateSection />
    </div>
  )
}
