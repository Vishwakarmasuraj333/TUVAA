'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceData {
  slug: string;
  title: string;
}

interface ServicesPreviewSectionProps {
  initialServices?: Array<{ num: string; title: string; slug: string }>
}

const fallbackServices = [
  { num: '01', title: 'PROMOTING AFRICAN CULTURES AND TRADITIONS', slug: 'promoting-african-cultures-and-traditions' },
  { num: '02', title: 'BAME MENTAL HEALTH AND WELLBEING', slug: 'bame-mental-health-and-wellbeing' },
  { num: '03', title: 'HIDDEN HISTORIES', slug: 'hidden-histories' },
]

export default function ServicesPreviewSection({ initialServices }: ServicesPreviewSectionProps = {}) {
  // Always ensure 3 items are present by padding with fallback items if fewer than 3 items returned
  const getPaddedServices = (inputList?: Array<{ num: string; title: string; slug: string }>) => {
    if (!inputList || inputList.length === 0) return fallbackServices;
    if (inputList.length >= 3) return inputList.slice(0, 3);
    const combined = [...inputList];
    fallbackServices.slice(inputList.length).forEach((fallback, idx) => {
      combined.push({
        num: `0${combined.length + 1}`,
        title: fallback.title,
        slug: fallback.slug,
      });
    });
    return combined;
  };

  const [services, setServices] = useState(getPaddedServices(initialServices));

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      setServices(getPaddedServices(initialServices));
      return;
    }

    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services?limit=3');
        if (res.ok) {
          const data = await res.json();
          if (data && data.services && data.services.length > 0) {
            const mapped = data.services.slice(0, 3).map((s: any, idx: number) => ({
              num: `0${idx + 1}`,
              title: s.title.toUpperCase(),
              slug: s.slug,
            }));
            setServices(getPaddedServices(mapped));
          }
        }
      } catch (error) {
        console.error('Failed to fetch services for preview section', error);
      }
    };
    fetchServices();
  }, [initialServices]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any },
    },
  }

  return (
    <section className="bg-[#faf8ef] pt-[70px] pb-[70px] md:pt-[110px] md:pb-[120px] relative overflow-hidden font-sans">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="container max-w-[1200px] mx-auto px-5 md:px-8 relative z-10 flex flex-col items-center"
      >
        {/* Section Heading & Subtitle */}
        <motion.div variants={itemVariants} className="text-center mb-[55px] flex flex-col items-center">
          <h2 className="font-cinzel text-3xl md:text-5xl text-[#35170f] font-extrabold tracking-[0.08em] uppercase mb-3">
            SERVICES
          </h2>
          <p className="text-[#DB9E30] font-cinzel text-sm md:text-base tracking-[0.15em] font-semibold uppercase">
            What We Do For Our Community
          </p>
        </motion.div>

        {/* Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[32px] w-full">
          {services.map((item, idx) => {
            const isMiddle = idx === 1;
            
            return (
              <motion.div 
                key={item.num}
                variants={itemVariants}
                className={cn(
                  "w-full h-[280px]",
                  isMiddle && "lg:-translate-y-6"
                )}
              >
                <Link 
                  href={`/services/${item.slug}`}
                  className="group relative block w-full h-full rounded-xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-[10px]"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/images/inner-page-bg.png"
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[1.08]"
                    />
                  </div>

                  {/* Overlays */}
                  <div className="absolute inset-0 z-10 bg-white/85 transition-colors duration-500 group-hover:bg-[#DB9E30]/90" />
                  
                  {/* Card Content */}
                  <div className="relative z-20 w-full h-full p-8 flex flex-col items-center justify-center text-center">
                    <span className="font-cinzel text-[64px] font-black leading-none text-[#1a1a1a] opacity-90 transition-colors duration-500 group-hover:text-white group-hover:opacity-100 mb-4 drop-shadow-sm">
                      {item.num}
                    </span>
                    
                    <h3 className="font-cinzel text-lg md:text-xl font-bold text-[#57a68f] uppercase tracking-wide transition-colors duration-500 group-hover:text-white">
                      {item.title}
                    </h3>

                    {/* Hover "Read More" Arrow */}
                    <div className="absolute bottom-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 flex items-center gap-2 text-white font-semibold text-sm tracking-widest uppercase">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* View All Button */}
        <motion.div variants={itemVariants} className="mt-[60px]">
          <Link
            href="/our-services"
            className="btn-primary-hover inline-flex items-center justify-center bg-[#DB9E30] hover:bg-[#57a68f] text-white font-cinzel font-bold text-sm tracking-[0.15em] uppercase w-[230px] h-[58px] rounded shadow-lg transition-all duration-300"
          >
            VIEW ALL SERVICES
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
