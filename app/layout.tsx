import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import content from '@/content/home.en.json'
import { getSEOTags } from '@/lib/seo'
import Script from 'next/script'
import './globals.css'
import Footer from '@/components/footer'

export const metadata: Metadata = getSEOTags({
  title: content.meta.title,
  description: content.meta.description,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify(content.jsonLd.webApplication)}
        </Script>
        <Script id="faq-structured-data" type="application/ld+json">
          {JSON.stringify(content.jsonLd.faqPage)}
        </Script>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
