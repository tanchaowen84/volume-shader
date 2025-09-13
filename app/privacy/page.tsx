import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { getSEOTags } from '@/lib/seo'

export const metadata: Metadata = getSEOTags({
  title: 'Privacy Policy – Volume Shader Benchmark',
  description:
    'How Volume Shader Benchmark collects, uses, and protects information, including analytics (Vercel Analytics, Google Analytics, Plausible) and cookies.',
  url: 'https://volumeshader.app/privacy',
})

const SITE_NAME = 'Volume Shader Benchmark'
const CONTACT_EMAIL = 'support@volumeshader.app'
const EFFECTIVE_DATE = 'September 13, 2025'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardContent className="prose prose-invert max-w-none p-6">
            <h1 className="mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Effective: {EFFECTIVE_DATE}</p>

            <p>
              This Privacy Policy describes how {SITE_NAME} ("we", "us") collects, uses, discloses,
              and protects information when you visit our website and use the built‑in benchmark. By
              accessing or using the site, you agree to this Policy.
            </p>

            <h2>Who We Are</h2>
            <p>
              Controller: {SITE_NAME}. Hosting and deployment are provided by Vercel. For questions
              or requests, contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>Information We Collect</h2>
            <ul>
              <li>
                Information you provide: messages or emails you send us, optional feedback.
              </li>
              <li>
                Benchmark and device context (client‑side): on‑screen telemetry such as FPS, frame
                time, quality preset, approximate viewport size, device pixel ratio, and WebGL
                capabilities. Unless explicitly stated otherwise, we process these values in your
                browser to render visuals; we generally do not persist raw benchmark frames or
                personally identifying information on our servers.
              </li>
              <li>
                Usage and analytics data: page views, referrers, UTM parameters, browser and device
                information, approximate geolocation (from IP), timestamps, and events. See
                “Analytics” below for providers.
              </li>
              <li>
                Cookies and similar technologies: see our <a href="/cookies" title="Read our Cookies Policy">Cookies Policy</a> for
                details and choices.
              </li>
            </ul>

            <h2>How We Use Information</h2>
            <ul>
              <li>Operate and improve the site and benchmark experience.</li>
              <li>Measure performance, reliability, and usage to guide product decisions.</li>
              <li>Detect, prevent, and investigate security incidents or abuse.</li>
              <li>Comply with legal obligations and enforce our <a href="/terms" title="Read our Terms of Use">Terms of Use</a>.</li>
              <li>Communicate with you about inquiries or support requests.</li>
            </ul>

            <h2>Legal Bases (EEA/UK)</h2>
            <ul>
              <li>Performance of a contract: providing the benchmark and site functionality.</li>
              <li>Legitimate interests: security, analytics, and product improvement.</li>
              <li>Consent: non‑essential cookies/trackers, where required by law.</li>
              <li>Legal obligation: responding to lawful requests and compliance duties.</li>
            </ul>

            <h2>Analytics</h2>
            <p>
              We currently use Vercel Analytics and may integrate Google Analytics and Plausible.
              Providers process data as our processors subject to their terms. Settings may vary by
              environment and can change over time; consult this page for updates.
            </p>
            <ul>
              <li>
                Vercel Analytics: a privacy‑friendly web analytics service provided by Vercel. It is
                typically cookie‑free and aggregates metrics to help us understand traffic and
                performance.
              </li>
              <li>
                Google Analytics (GA4): uses cookies and similar technologies to measure usage. Google
                may process data on servers in the U.S. We enable IP masking where available and use
                GA4 features consistent with applicable law. You can opt out via your ad settings or
                browser‑level tools.
              </li>
              <li>
                Plausible Analytics: a privacy‑focused analytics platform that can operate without
                cookies. If we enable cookie‑less mode, Plausible will avoid storing identifiers in your
                browser; otherwise, minimal identifiers may be used to measure visits.
              </li>
            </ul>

            <h2>Disclosures and Sharing</h2>
            <ul>
              <li>
                Service providers and processors (e.g., hosting, analytics, security) under contract
                to process data on our behalf.
              </li>
              <li>
                Legal and safety: if required by law, regulation, or valid legal process; or to protect
                rights, safety, or security.
              </li>
              <li>
                Business transfers: in connection with a merger, acquisition, or asset sale, subject to
                continued protection of personal data.
              </li>
            </ul>

            <h2>International Transfers</h2>
            <p>
              We may transfer, store, or process information in countries outside your own. Where
              required, we rely on appropriate safeguards such as Standard Contractual Clauses.
            </p>

            <h2>Retention</h2>
            <p>
              We retain information only as long as necessary for the purposes described, to comply
              with legal obligations, resolve disputes, and enforce agreements. Aggregated or
              de‑identified data may be retained longer.
            </p>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, delete, restrict, or
              object to processing; to portability; and to withdraw consent. EU/UK residents may also
              lodge complaints with a supervisory authority. California residents have rights to
              know/access, delete, correct, and limit use of sensitive information, and to opt out of
              “sharing”/targeted advertising. We do not sell personal information.
            </p>
            <p>
              To exercise rights, contact <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              We may need to verify your request. Authorized agent requests must include proof of
              authorization and verification of identity.
            </p>

            <h2>Do Not Track & Global Privacy Control</h2>
            <p>
              Our site honors applicable Global Privacy Control (GPC) signals where legally required.
              Industry standards for “Do Not Track” are evolving, and we do not currently respond to
              DNT signals.
            </p>

            <h2>Children’s Privacy</h2>
            <p>
              Our site is not directed to children under 13, and we do not knowingly collect personal
              information from them. If you believe a child provided information to us, please contact
              us to request deletion.
            </p>

            <h2>Security</h2>
            <p>
              We use reasonable administrative, technical, and physical safeguards to protect
              information. No method of transmission or storage is 100% secure.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Policy from time to time. The “Effective” date indicates the latest
              revision. Material changes will be posted on this page.
            </p>

            <h2>Contact</h2>
            <p>
              Questions or requests: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>

            <hr />
            <p className="text-xs text-muted-foreground">
              This document is provided for informational purposes only and does not constitute legal
              advice. Laws vary by jurisdiction. Please consult your legal counsel to adapt this policy
              to your specific circumstances.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
