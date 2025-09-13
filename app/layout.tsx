import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import content from '@/content/home.en.json'
import { getSEOTags } from '@/lib/seo'
import Script from 'next/script'
import './globals.css'
import Footer from '@/components/footer'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js'
const PLAUSIBLE_API = process.env.NEXT_PUBLIC_PLAUSIBLE_API

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
        {/* Analytics: GA4 (enabled when NEXT_PUBLIC_GA_ID is set) */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} 
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
        {/* Analytics: Plausible (enabled when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set) */}
        {PLAUSIBLE_DOMAIN && (
          <Script
            id="plausible"
            strategy="afterInteractive"
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            {...(PLAUSIBLE_API ? { ['data-api']: PLAUSIBLE_API } : {})}
            src={PLAUSIBLE_SRC}
          />
        )}
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
