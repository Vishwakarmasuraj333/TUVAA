import type { Metadata } from 'next'
import PageBanner from '@/components/common/PageBanner'
import BlogSidebar from '@/components/common/BlogSidebar'

export const metadata: Metadata = {
  title: 'Privacy Policy - TUVAA',
  description: 'TUVAA Privacy Policy. Learn how we handle and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-white text-[#35170f]">
      <PageBanner
        title="PRIVACY POLICY"
        breadcrumb="Privacy Policy"
      />

      <div className="container max-w-[1200px] mx-auto px-4 sm:px-6 py-12 lg:py-16 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-sm shadow-sm border border-[#e7e0d5] space-y-8">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="font-cinzel text-lg sm:text-xl font-bold uppercase text-[#35170f] tracking-wide border-b border-[#eee7dc] pb-2">
                1. PRIVACY POLICY
              </h2>
              <p className="text-[#5b4b43] text-sm sm:text-base leading-relaxed">
                About our privacy practices please write to our email provided. Please read this privacy policy in conjunction with our Terms and Conditions.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="font-cinzel text-lg sm:text-xl font-bold uppercase text-[#35170f] tracking-wide border-b border-[#eee7dc] pb-2">
                2. INFORMATION WE COLLECT ABOUT YOU
              </h2>
              <p className="text-[#5b4b43] text-sm sm:text-base leading-relaxed">
                We will collect personal information, including specific details and other information. Personal information refers to individually identifiable information that you would allow us to determine the actual identity of a specific person. Sensitive information includes comments or content (e.g. photographs, profiles and lifestyle) which you optionally provide.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="font-cinzel text-lg sm:text-xl font-bold uppercase text-[#35170f] tracking-wide border-b border-[#eee7dc] pb-2">
                3. HOW WE PROTECT YOUR PERSONAL INFORMATION
              </h2>
              <p className="text-[#5b4b43] text-sm sm:text-base leading-relaxed">
                We take security measures to help safeguard your personal information from unauthorized access and disclosure. However, no system can be completely secure. Therefore, although we take steps to secure your information, we do not promise, and you should not expect, that your personal information will always remain secure. You agree that we may communicate with you electronically regarding security, privacy, and administrative issues, such as security breaches. We may post a notice on our Service if a security breach occurs. We may also send an email to you at the email address you have provided to us.
              </p>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
