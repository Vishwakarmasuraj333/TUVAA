import PageBanner from '@/components/common/PageBanner'
import SectionTitle from '@/components/common/SectionTitle'
import MembershipForm from '@/components/forms/MembershipForm'
import { ShieldAlert, Award, FileText } from 'lucide-react'

export const metadata = {
  title: 'Membership Application - TUVAA',
  description: 'Apply for TUVAA membership. Only community groups or associations identifying as from an African country can become a member.',
}

export default function MembershipPage() {
  return (
    <div className="w-full pb-20 bg-[#f8f6f2]">
      <PageBanner
        title="Membership"
        breadcrumb="Membership"
      />

      <div className="container mx-auto px-6 py-16 max-w-4xl bg-[#f8f6f2] text-[#1f1a17]">
        <SectionTitle
          title="Become a Member"
          subtitle="Align your association with TUVAA to gain coordination support, resource access, and voice amplification."
        />

        {/* Membership Policies info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          <div className="p-6 rounded bg-gold-500/5 border border-gold-500/10 space-y-3">
            <div className="text-gold-500"><ShieldAlert className="h-8 w-8" /></div>
            <h4 className="font-cinzel font-bold text-[#1f1a17] uppercase text-sm tracking-wider">Group Only</h4>
            <p className="text-xs text-[#1f1a17]/70 leading-relaxed">
              Only groups that identify themselves as from an African country can become a member. We do not allow individual registrations.
            </p>
          </div>

          <div className="p-6 rounded bg-gold-500/5 border border-gold-500/10 space-y-3">
            <div className="text-gold-500"><Award className="h-8 w-8" /></div>
            <h4 className="font-cinzel font-bold text-[#1f1a17] uppercase text-sm tracking-wider">Annual Fee</h4>
            <p className="text-xs text-[#1f1a17]/70 leading-relaxed">
              Associations registering with TUVAA require a modest annual administration fee of £20 to sustain coordination operations.
            </p>
          </div>

          <div className="p-6 rounded bg-gold-500/5 border border-gold-500/10 space-y-3">
            <div className="text-gold-500"><FileText className="h-8 w-8" /></div>
            <h4 className="font-cinzel font-bold text-[#1f1a17] uppercase text-sm tracking-wider">Required Info</h4>
            <p className="text-xs text-[#1f1a17]/70 leading-relaxed">
              Provide group registration details, contact personnel details, official email address, and a brief description of activities.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="form-card rounded-lg p-8 border border-gold-500/10 shadow-lg relative bg-white">
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden rounded-tr-lg">
            <div className="absolute top-[-10px] right-[-10px] w-12 h-12 bg-gold-500 rotate-45 opacity-20" />
          </div>

          <h3 className="font-cinzel text-xl text-[#1f1a17] font-bold uppercase tracking-wider text-center mb-8 border-b border-gold-500/10 pb-4">
            Membership Registration Form
          </h3>

          <MembershipForm />
        </div>
      </div>
    </div>
  )
}
