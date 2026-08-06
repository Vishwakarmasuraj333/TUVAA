"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Slide {
  image: string;
  titleLines: string[];
  button: string;
  href: string;
}

const slides: Slide[] = [
  {
    image: "/images/1117146-v2.webp",
    titleLines: ["THE UNITED VOICE", "OF AFRICAN ASSOCIATIONS"],
    button: "BECOME A MEMBER",
    href: "/membership",
  },
  {
    image: "/images/banner-2.webp",
    titleLines: ["BLACK BUSINESS ARTIST &", "MUSIC FESTIVAL (BBAM)"],
    button: "LEARN MORE",
    href: "/#bbam-section",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const wordVariants = {
  hidden: (i: number) => ({
    y: i % 2 === 0 ? 50 : -50,
    opacity: 0,
    filter: "blur(8px)",
  }),
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: "easeOut" as any,
    },
  },
  exit: (i: number) => ({
    y: i % 2 === 0 ? -40 : 40,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.5,
      ease: "easeInOut" as any,
    },
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as any },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4 },
  },
};

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      nextSlide();
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused, nextSlide]);

  if (!mounted) {
    return <div className="w-full h-[100vh] min-h-[850px] md:min-h-[950px] bg-black" />;
  }

  const activeSlide = slides[currentSlide];

  return (
    <section
      className="relative w-full h-[100vh] min-h-[850px] md:min-h-[950px] overflow-hidden bg-black"
    >
      {/* Background Image with AnimatePresence */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeSlide.image}
            className="absolute inset-0 w-full h-full relative overflow-hidden"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.12 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" },
            }}
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.titleLines.join(" ")}
              fill
              priority
              quality={90}
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark Overlay Gradient */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none" 
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.22), rgba(0,0,0,0.38), rgba(0,0,0,0.58))' }}
      />

      {/* Text Wrapper (top-[64%] md:top-[66%] ensures text sits lower down below top navigation header) */}
      <div className="absolute inset-x-0 top-[64%] md:top-[66%] -translate-y-1/2 z-20 px-5 text-center flex flex-col items-center">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) => (
            index === currentSlide && (
              <motion.div 
                key={index} 
                initial="hidden"
                animate="show"
                exit="exit"
                variants={containerVariants}
                className="w-full flex flex-col items-center"
              >
                {/* Title */}
                <div className="flex flex-col items-center w-full">
                  {slide.titleLines.map((line, lineIndex) => {
                    const words = line.split(" ");
                    return (
                      <h1
                        key={lineIndex}
                        className={`font-cinzel font-bold uppercase text-white tracking-[0.04em] leading-[1.05] text-[clamp(28px,8vw,38px)] md:text-[clamp(36px,6vw,56px)] lg:text-[clamp(44px,5vw,72px)] ${lineIndex > 0 ? "mt-[10px]" : ""} flex flex-wrap justify-center`}
                        style={{ textShadow: "0 6px 24px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)" }}
                      >
                        {words.map((word, wordIndex) => (
                          <motion.span
                            key={wordIndex}
                            custom={lineIndex * 10 + wordIndex}
                            variants={wordVariants}
                            className={`inline-block ${wordIndex < words.length - 1 ? 'mr-[0.25em]' : ''}`}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </h1>
                    );
                  })}
                </div>

                {/* Button */}
                <motion.div variants={buttonVariants} className="mt-8">
                  <Link
                    href={slide.href}
                    onClick={(e) => {
                      if (slide.href.includes('#')) {
                        const targetId = slide.href.split('#')[1]
                        const elem = document.getElementById(targetId)
                        if (elem) {
                          e.preventDefault()
                          elem.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }
                    }}
                    className="btn-primary-hover inline-flex items-center justify-center bg-[#DB9E30] hover:bg-[#57a68f] text-white rounded-md px-8 py-3.5 md:px-10 md:py-4 uppercase font-bold text-xs md:text-sm tracking-wider shadow-lg transition-colors duration-300 cursor-pointer"
                  >
                    {slide.button}
                  </Link>
                </motion.div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Slider Controls: Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 z-30 -translate-y-1/2 h-[48px] w-[48px] md:h-[56px] md:w-[56px] flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-[#DB9E30] hover:border-[#DB9E30]"
      >
        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 z-30 -translate-y-1/2 h-[48px] w-[48px] md:h-[56px] md:w-[56px] flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-[#DB9E30] hover:border-[#DB9E30]"
      >
        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
      </button>

      {/* Slider Controls: Dots */}
      <div className="absolute bottom-8 inset-x-0 z-30 flex items-center justify-center gap-3">
        {slides.map((_, index) => {
          const active = index === currentSlide;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                active ? "w-8 bg-[#DB9E30]" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}