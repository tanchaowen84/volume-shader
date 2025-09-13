import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Cookies Policy – Volume Shader Benchmark',
  description:
    'Details about cookies and similar technologies used by Volume Shader Benchmark, including choices and provider information.',
}

const SITE_NAME = 'Volume Shader Benchmark'
const CONTACT_EMAIL = 'support@volumeshader.app'
const EFFECTIVE_DATE = 'September 13, 2025'

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardContent className="prose prose-invert max-w-none p-6">
            <h1 className="mb-2">Cookies Policy</h1>
            <p className="text-muted-foreground">Effective: {EFFECTIVE_DATE}</p>

            <p>
              This Cookies Policy explains how {SITE_NAME} uses cookies and similar technologies on our
              website. For how we handle personal data more generally, see our
              {' '}<a href="/privacy" title="Read our Privacy Policy">Privacy Policy</a>.
            </p>

            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device to store data. We may also use
              localStorage, sessionStorage, and similar technologies for comparable purposes.
            </p>

            <h2>Types of Cookies We Use</h2>
            <ul>
              <li>
                Strictly Necessary: required for core functionality (e.g., your cookie preferences).
              </li>
              <li>
                Performance/Analytics: help us understand usage to improve the site (e.g., Google
                Analytics). Some providers (e.g., Vercel Analytics, Plausible in cookie‑less mode) may
                measure traffic without setting cookies.
              </li>
              <li>
                Functional: remember choices to enhance your experience.
              </li>
            </ul>

            <h2>Cookies We May Set</h2>
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Category</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>cookie_consent</td>
                  <td>Stores your cookie preferences</td>
                  <td>Strictly Necessary</td>
                  <td>6–12 months</td>
                </tr>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics visitor measurement</td>
                  <td>Performance</td>
                  <td>Up to 2 years</td>
                </tr>
                <tr>
                  <td>_ga_&lt;container-id&gt;</td>
                  <td>Google Analytics session state</td>
                  <td>Performance</td>
                  <td>Up to 2 years</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Google Analytics daily user distinction</td>
                  <td>Performance</td>
                  <td>24 hours</td>
                </tr>
                <tr>
                  <td>_gat</td>
                  <td>Google Analytics request throttling</td>
                  <td>Performance</td>
                  <td>1 minute</td>
                </tr>
              </tbody>
            </table>

            <p className="text-sm text-muted-foreground">
              Notes: (1) Vercel Analytics does not normally use cookies. (2) Plausible can operate
              cookie‑less; if configured to use identifiers, it may store minimal data in your
              browser. Providers may update their implementations; see their documentation for details.
            </p>

            <h2>Your Choices</h2>
            <ul>
              <li>
                Cookie Banner/Settings: where available, use our on‑site controls to accept, reject,
                or customize non‑essential cookies.
              </li>
              <li>
                Browser Settings: block or delete cookies in your browser. Blocking cookies may impact
                site functionality.
              </li>
              <li>
                Analytics Opt‑Out: use Google’s opt‑out tools or your ad settings; enable Global
                Privacy Control (GPC) where supported.
              </li>
            </ul>

            <h2>Do Not Track (DNT) & GPC</h2>
            <p>
              We honor applicable Global Privacy Control (GPC) signals where required. Industry
              standards for DNT are not uniform; we do not currently respond to DNT headers.
            </p>

            <h2>Updates</h2>
            <p>
              We may update this Cookies Policy from time to time. Material changes will be posted on
              this page. For questions, contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
