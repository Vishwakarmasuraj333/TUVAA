import { Suspense } from 'react'
import PageBanner from '@/components/common/PageBanner'
import ContactForm from '@/components/forms/ContactForm'

export const metadata = {
  title: 'Contact Us - TUVAA',
  description: 'Get in touch with TUVAA. Call us, send an email, or visit our Newtown Youth Centre office in Southampton.',
}

export default function ContactPage() {
  return (
    <div className="w-full bg-white min-h-screen pb-20">
      <PageBanner
        title="Contact"
        breadcrumb="Contact"
      />

      <div className="container mx-auto px-6 py-16 md:py-24 max-w-[1100px] text-[#8b8178]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Details (Left Column) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <h2 className="font-cinzel text-3xl md:text-4.5xl text-[#35170f] font-bold uppercase tracking-wider">
              CONTACT INFO
            </h2>

            <div className="space-y-6 pt-4">
              <h3 className="font-cinzel text-lg font-bold text-[#35170f] tracking-wide uppercase">
                The United Voice of African Association(TUVAA)
              </h3>
              
              <p className="text-sm md:text-base leading-relaxed">
                Newtown Youth Centre. Graham Rd. Southampton. SO14 0AW
              </p>

              <div className="space-y-2 pt-2 text-sm md:text-base font-medium">
                <p>
                  <span className="text-[#35170f] font-bold">Phone:</span>{' '}
                  <a href="tel:07385932327" className="text-[#DB9E30] hover:text-[#57a68f] transition-colors">
                    07385932327
                  </a>
                </p>
                <p>
                  <span className="text-[#35170f] font-bold">Email:</span>{' '}
                  <a href="mailto:info@tuvaa.org.uk" className="text-[#DB9E30] hover:text-[#57a68f] transition-colors">
                    info@tuvaa.org.uk
                  </a>
                </p>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="w-full h-[300px] md:h-[350px] rounded-sm overflow-hidden shadow-sm border border-[#e8dfc8] mt-8 relative">
              <iframe
                title="Newtown Youth Centre Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2515.7032731871216!2d-1.397637823528825!3d50.91067285420138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487471415ca68551%3A0x673d325785055b41!2sNewtown%20Youth%20Centre!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form Container (Right Column) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <h2 className="font-cinzel text-3xl md:text-4.5xl text-[#35170f] font-bold uppercase tracking-wider">
              GET IN TOUCH
            </h2>

            <div className="space-y-6 pt-4">
              <p className="text-sm md:text-base leading-relaxed text-[#8b8178]">
                Have questions about TUVAA programs or services? Let us help. Use our contact
                form and we'll get back to you as soon as possible.
              </p>
              
              <div className="pt-2">
                <Suspense fallback={<div className="h-64 animate-pulse bg-gray-50 rounded" />}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
