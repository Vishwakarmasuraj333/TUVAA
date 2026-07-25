import type { Metadata } from 'next'
import { Cinzel, Roboto_Slab } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import RecaptchaProvider from '@/components/providers/RecaptchaProvider'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tuvaa.org.uk"),
  title: {
    default: "TUVAA – The United Voice of African Associations",
    template: "%s | TUVAA",
  },
  description:
    "TUVAA (The United Voice of African Associations) is an umbrella organisation uniting African community groups, professionals, and businesses in the UK. We support African communities through culture, events, services, and projects.",
  keywords: ["TUVAA", "African Associations", "Black Business", "BBAM", "African Community UK", "United Voice of African Associations"],
  authors: [{ name: "TUVAA" }],
  creator: "TUVAA",
  publisher: "TUVAA",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://tuvaa.org.uk",
    title: "TUVAA – The United Voice of African Associations",
    description:
      "TUVAA is an umbrella organisation uniting African community groups, professionals, and businesses in the UK.",
    siteName: "TUVAA",
    images: [
      {
        url: "/images/tuvaa-final-png.png",
        width: 1200,
        height: 630,
        alt: "TUVAA Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TUVAA – The United Voice of African Associations",
    description: "Supporting African communities through culture, events, services, and projects in the UK.",
    images: ["/images/tuvaa-final-png.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cinzel.variable} ${robotoSlab.variable}`}>
      <body className="bg-[#0d0905] text-[#f5f0eb] min-h-screen flex flex-col antialiased">
        <Providers>
          <RecaptchaProvider>
            <Header />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </RecaptchaProvider>
        </Providers>
      </body>
    </html>
  )
}
