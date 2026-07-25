"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WelcomeSection() {
  return (
    <section className="relative flex min-h-[500px] md:min-h-[600px] w-full items-center justify-center overflow-hidden border-b border-[#DB9E30]/10 bg-[#120c08] py-16 md:py-28">
      {/* Background Image */}
      <Image
        src="/images/banner-2-v2.webp"
        alt="Welcome to TUVAA background"
        fill
        priority
        quality={95}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Clear Overlays as specified */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.38)' }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.28) 50%, rgba(0, 0, 0, 0.45) 100%)'
        }}
      />

      {/* Golden glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DB9E30]/10 blur-[130px]" />

      {/* Content */}
      <div className="container relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 45, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mx-auto max-w-[900px] space-y-7 flex flex-col items-center"
        >

          <h2 className="font-cinzel text-4xl font-extrabold uppercase leading-tight tracking-wider text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.65)] sm:text-5xl md:text-6xl">
            WELCOME TO THE TUVAA
          </h2>

          <div className="h-[3px] w-28 rounded-full bg-[#DB9E30]" />

          <p className="font-roboto text-sm font-medium leading-8 text-white/95 drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)] sm:text-base md:text-[17px] text-center">
            The United Voice of African Association is an umbrella organisation
            for African groups in Southampton and its surrounding towns. The
            unified voice and welfare of Africans is our top priority. We pride
            ourselves in bringing Africans from different countries together,
            sharing cultures and traditions and creating opportunities for our
            communities. We do a lot of partnership work with voluntary
            organisations and community groups to promote integration and deliver
            support services impacting the lives of ordinary people accessing our
            services.
          </p>

          <div className="pt-3">
            <Link
              href="/about"
              className="btn-primary-hover inline-flex items-center justify-center rounded-md px-9 py-4 font-cinzel text-xs font-bold uppercase tracking-[0.2em] shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
            >
              Read More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}