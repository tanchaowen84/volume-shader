interface SEOConfig {
  url?: string
  title?: string
  description?: string
  images?: Array<{
    url: string
    width?: number
    height?: number
    alt?: string
  }>
  locale?: string
  siteName?: string
}

export function getSEOTags(config: SEOConfig = {}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Volume Shader Benchmark'
  const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en'
  
  const url = config.url || siteUrl
  const title = config.title || 'Volume Shader Benchmark – Professional GPU Performance Test | Real‑time FPS Scoring'
  const description = config.description || 'Online volume shader benchmark with three quality levels, real‑time FPS monitoring, and a five‑tier scoring system. Test if your GPU can handle advanced volume shader rendering in the browser.'
  const locale = config.locale || defaultLocale
  
  const images = config.images || [
    {
      url: `${siteUrl}/og.png`,
      width: 1200,
      height: 630,
      alt: title,
    },
  ]

  return {
    // Basic Meta Tags
    title,
    description,
    
    // Open Graph
    openGraph: {
      type: 'website',
      locale,
      url,
      title,
      description,
      siteName,
      images,
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images[0]?.url,
      creator: '@volumeshader', // Replace with actual Twitter handle
    },
    
    // Canonical URL
    alternates: {
      canonical: url,
    },
    
    // Additional Meta Tags
    other: {
      'twitter:site': '@volumeshader', // Replace with actual Twitter handle
    },
  }
}