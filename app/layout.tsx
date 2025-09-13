import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import content from '@/content/home.en.json'
import { getSEOTags } from '@/lib/seo'
import Script from 'next/script'
import './globals.css'
import Footer from '@/components/footer'
const IS_PROD = process.env.NODE_ENV === 'production'

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
        {/* Analytics: production-only injection, exact user-provided snippets */}
        {IS_PROD && (
          <>
            {/* Google tag (gtag.js) */}
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-90JHQDZ9ZN"></script>
            {/* eslint-disable-next-line react/no-danger */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);} 
  gtag('js', new Date());

  gtag('config', 'G-90JHQDZ9ZN');
                `.trim(),
              }}
            />
            {/* Plausible */}
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <script defer data-domain="volumeshader.app" src="https://myplausible.app/js/script.js"></script>
          </>
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
