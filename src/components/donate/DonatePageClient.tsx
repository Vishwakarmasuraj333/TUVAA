'use client'

import { useState } from 'react'
import { Campaign } from '@/data/donationCampaigns'
import DonationModal from '@/components/donate/DonationModal'
import MonthlyDonationModal from '@/components/donate/MonthlyDonationModal'

interface DonatePageClientProps {
  campaigns: Campaign[]
}

export default function DonatePageClient({ campaigns }: DonatePageClientProps) {
  const [openCampaign, setOpenCampaign] = useState<Campaign | null>(null)
  const [showMonthly, setShowMonthly] = useState(false)

  return (
    <>
      {/* ===================== MAIN HEADING ===================== */}
      <section className="w-full bg-white pt-[70px] pb-[30px] text-center px-4">
        <h2
          className="font-cinzel font-bold uppercase text-center text-[#35170f] mx-auto"
          style={{ fontSize: 'clamp(28px, 5.5vw, 42px)', lineHeight: 1.18, maxWidth: '720px' }}
        >
          THANK YOU FOR YOUR<br />DESIRE TO GIVE!
        </h2>
        <div className="flex items-center justify-center gap-3 mt-6">
          <div style={{ height: 1, width: 56, background: 'rgba(219,158,48,0.5)' }} />
          <div style={{ height: 4, width: 40, background: '#DB9E30', borderRadius: 9999 }} />
          <div style={{ height: 1, width: 56, background: 'rgba(219,158,48,0.5)' }} />
        </div>
      </section>

      {/* ===================== CARDS — 3 columns ===================== */}
      <section className="w-full bg-white px-6 pt-[40px] pb-[50px]">
        <div className="mx-auto" style={{ maxWidth: 1160 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 36,
            }}
            className="donate-grid"
          >
            {campaigns.map((campaign) => {
              const progressPct =
                campaign.goalAmount > 0
                  ? Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100)
                  : 0

              return (
                <div
                  key={campaign.slug}
                  className="group relative"
                  style={{
                    background: '#fff',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
                    transition: 'transform 0.32s ease, box-shadow 0.32s ease',
                  }}
                  onMouseEnter={(e) => {
                    ; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'
                      ; (e.currentTarget as HTMLDivElement).style.boxShadow =
                        '0 18px 44px rgba(0,0,0,0.13)'
                  }}
                  onMouseLeave={(e) => {
                    ; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                      ; (e.currentTarget as HTMLDivElement).style.boxShadow =
                        '0 4px 18px rgba(0,0,0,0.08)'
                  }}
                >
                  {/* Diagonal Shine Effect */}
                  <div className="absolute top-0 -left-[150%] h-full w-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[150%] z-10 pointer-events-none" />
                  {/* Image */}
                  <div style={{ width: '100%', height: 220, overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Body */}
                  <div style={{ padding: '20px 22px 22px' }}>
                    {/* Title */}
                    <h3
                      className="font-cinzel font-bold uppercase text-[#35170f]"
                      style={{ fontSize: 16, letterSpacing: '0.04em', lineHeight: 1.35, marginBottom: 10 }}
                    >
                      {campaign.title}
                    </h3>

                    {/* Text — 3 lines */}
                    <p
                      style={{
                        fontSize: 13.5,
                        color: '#8b8178',
                        lineHeight: 1.78,
                        marginBottom: 14,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                      }}
                    >
                      {campaign.shortText}
                    </p>

                    {/* Donate link */}
                    <button
                      onClick={() => setOpenCampaign(campaign)}
                      style={{
                        display: 'inline-block',
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: '#35170f',
                        textDecoration: 'underline',
                        textUnderlineOffset: 3,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        marginBottom: 16,
                        fontFamily: 'inherit',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#DB9E30' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#35170f' }}
                    >
                      Donate
                    </button>

                    {/* Progress box */}
                    <div style={{ background: '#f7f7f7', borderRadius: 2, padding: '14px 16px 16px' }}>
                      <div
                        style={{
                          width: '100%',
                          height: 8,
                          background: '#e3e8e3',
                          borderRadius: 99,
                          overflow: 'hidden',
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            width: `${progressPct}%`,
                            height: '100%',
                            background: '#68bd73',
                            borderRadius: 99,
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12.5, color: '#6b6560' }}>
                          £{campaign.raisedAmount.toFixed(2)}{' '}
                          <span style={{ fontSize: 11, color: '#a0988e' }}>
                            of £{campaign.goalAmount.toLocaleString()}
                          </span>
                        </span>
                        <span style={{ fontSize: 12, color: '#a0988e' }}>
                          {campaign.donationCount}{' '}
                          {campaign.donationCount === 1 ? 'donation' : 'donations'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Responsive: stack on mobile */}
          <style>{`
            @media (max-width: 900px) {
              .donate-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 580px) {
              .donate-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ===================== MONTHLY BOX — text left, btn right ===================== */}
      <section className="w-full bg-white px-6 pt-[10px] pb-[90px] flex justify-center">
        <div
          className="group relative"
          style={{
            background: 'linear-gradient(135deg, #57a68f 0%, #468c77 100%)',
            width: '100%',
            maxWidth: 1200,
            borderRadius: 2,
            padding: '56px 64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            flexWrap: 'wrap',
            boxShadow: '0 20px 40px rgba(87, 166, 143, 0.2)',
            overflow: 'hidden',
          }}
        >
          {/* Diagonal Shine Effect */}
          <div className="absolute top-0 -left-[150%] h-full w-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[150%] z-0 pointer-events-none" />
          {/* Text */}
          <p
            className="font-cinzel font-bold uppercase text-white"
            style={{ fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.6, letterSpacing: '0.08em', maxWidth: 640 }}
          >
            TO DONATE MONTH-TO-MONTH, PLEASE USE THE MONTHLY DONATION FORM
          </p>

          <button
            onClick={() => setShowMonthly(true)}
            className="bg-[#DB9E30] hover:bg-[#35170f] font-cinzel font-bold uppercase rounded-sm cursor-pointer flex-shrink-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(53,23,15,0.35)] text-white"
            style={{ fontSize: 12, padding: '12px 30px', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}
          >
            Monthly Donation Form
          </button>
        </div>
      </section>

      {/* ===================== MODALS ===================== */}
      {openCampaign && (
        <DonationModal
          campaign={openCampaign}
          onClose={() => setOpenCampaign(null)}
        />
      )}
      {showMonthly && (
        <MonthlyDonationModal onClose={() => setShowMonthly(false)} />
      )}
    </>
  )
}
