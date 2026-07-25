'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function ArtistGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const close = useCallback(() => setActiveIndex(null), [])
  const previous = useCallback(() => setActiveIndex((index) => index === null ? null : (index - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setActiveIndex((index) => index === null ? null : (index + 1) % images.length), [images.length])

  useEffect(() => {
    if (activeIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKeyDown)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
    }
  }, [activeIndex, close, next, previous])

  return (
    <>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-4">
        {images.map((image, index) => (
          <button key={`${image.src}-${index}`} type="button" onClick={() => setActiveIndex(index)} className="group relative aspect-square overflow-hidden bg-[#eee9e2] focus-visible:outline-4 focus-visible:outline-[#DB9E30]" aria-label={`View ${image.alt}`}>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {activeIndex !== null && (
        <div role="dialog" aria-modal="true" aria-label="Artwork preview" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" onPointerDown={close}>
          <button type="button" onClick={close} className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-3 text-white hover:text-[#DB9E30]" aria-label="Close preview"><X /></button>
          {images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); previous() }} className="absolute left-3 z-10 rounded-full bg-black/60 p-3 text-white sm:left-8" aria-label="Previous artwork"><ChevronLeft /></button>}
          <div className="relative h-[85vh] w-[90vw] max-w-5xl" onPointerDown={(event) => event.stopPropagation()}>
            <Image src={images[activeIndex].src} alt={images[activeIndex].alt} fill priority sizes="90vw" className="object-contain" />
          </div>
          {images.length > 1 && <button type="button" onClick={(event) => { event.stopPropagation(); next() }} className="absolute right-3 z-10 rounded-full bg-black/60 p-3 text-white sm:right-8" aria-label="Next artwork"><ChevronRight /></button>}
        </div>
      )}
    </>
  )
}
