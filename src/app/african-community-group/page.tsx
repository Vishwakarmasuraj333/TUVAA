import PageBanner from '@/components/common/PageBanner'
import SectionTitle from '@/components/common/SectionTitle'
import AfricanGroupForm from '@/components/forms/AfricanGroupForm'
import { Landmark, Users2, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'African Community Group Registration - TUVAA',
  description: 'Register your African community group or association with TUVAA. Registration is only £20.',
}

export default function AfricanCommunityGroupPage() {
  return (
    <div className="w-full pb-20 bg-[#f8f6f2]">
      <PageBanner
        title="African Community Group"
        breadcrumb="African Community Group"
      />

      <div className="container mx-auto px-6 py-16 max-w-[1180px] bg-[#f8f6f2] text-[#1f1a17]">
        <SectionTitle
          title="Group Registration"
          subtitle="Join the umbrella network of African community groups operating in Southampton & Hampshire."
        />

        {/* Intro Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-16 text-left border-b border-gold-500/10 pb-12">
          <div className="md:col-span-8 space-y-4">
            <h3 className="font-cinzel text-xl text-charcoal font-bold uppercase tracking-wider">
              Voice and Power is in the Numbers
            </h3>
            <p className="text-charcoal/80 leading-relaxed">
              The United Voice of African Associations (TUVAA) is an umbrella organisation for African groups in the city. We believe that by building strong collaborations and coordinating our efforts, we can secure better resources, represent our people more effectively, and address the systemic challenges faced by our communities.
            </p>
            <p className="text-charcoal/80 leading-relaxed">
              African groups and community associations are welcomed to register with TUVAA. Registration is only **£20** annually, helping to cover administrative cost.
            </p>
          </div>

          <div className="md:col-span-4 grid grid-cols-1 gap-4">
            <div className="p-4 rounded bg-gold-500/5 border border-gold-500/10 flex items-center gap-3">
              <Landmark className="h-6 w-6 text-gold-500 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-[#DB9E30] uppercase">Umbrella Network</p>
                <p className="text-[#7a5518]">Official representation</p>
              </div>
            </div>
            <div className="p-4 rounded bg-gold-500/5 border border-gold-500/10 flex items-center gap-3">
              <Users2 className="h-6 w-6 text-gold-500 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-[#DB9E30] uppercase">£20 Fee</p>
                <p className="text-[#7a5518]">Annual registration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="form-card md:p-12">
          <h3 className="font-cinzel text-xl text-[#1f1a17] font-bold uppercase tracking-wider text-center mb-8 border-b border-[#DB9E30] pb-4">
            African Community Group Application
          </h3>

          <AfricanGroupForm />
        </div>
      </div>
    </div>
  )
}
