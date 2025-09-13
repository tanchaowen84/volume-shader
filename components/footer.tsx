import Link from 'next/link'

const SITE_NAME = 'Volume Shader Benchmark'
const CURRENT_YEAR = new Date().getFullYear()
const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/tanchaowen84/volume-shader'

export default function Footer() {
  return (
    <footer role="contentinfo" className="mt-16 border-t border-border/60 bg-black/30 glass-card">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold neon-text">{SITE_NAME}</p>
            <p className="text-xs text-muted-foreground">
              Browser‑based volume shader benchmark with real‑time scoring.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link className="hover:underline" href="/privacy" title="Read our Privacy Policy">Privacy</Link>
            <Link className="hover:underline" href="/terms" title="Read our Terms of Use">Terms</Link>
            <Link className="hover:underline" href="/cookies" title="Read our Cookies Policy">Cookies</Link>
            {GITHUB_URL && (
              <a className="hover:underline" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
          </nav>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <p>
            © {CURRENT_YEAR} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
