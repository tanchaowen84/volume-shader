import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Use – Volume Shader Benchmark',
  description:
    'Terms governing your access to and use of the Volume Shader Benchmark website and benchmark tool.',
}

const SITE_NAME = 'Volume Shader Benchmark'
const CONTACT_EMAIL = 'support@volumeshader.app'
const EFFECTIVE_DATE = 'September 13, 2025'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardContent className="prose prose-invert max-w-none p-6">
            <h1 className="mb-2">Terms of Use</h1>
            <p className="text-muted-foreground">Effective: {EFFECTIVE_DATE}</p>

            <h2>Acceptance of Terms</h2>
            <p>
              These Terms of Use ("Terms") govern your access to and use of {SITE_NAME} (the
              "Service"). By accessing or using the Service, you agree to be bound by these Terms. If
              you do not agree, do not use the Service.
            </p>

            <h2>Eligibility</h2>
            <p>
              You must be at least the age of majority in your jurisdiction to use the Service. The
              Service is not intended for children under 13.
            </p>

            <h2>Benchmark Risks and Safe Use</h2>
            <ul>
              <li>
                The benchmark is compute‑intensive and may increase device temperature, battery drain,
                and fan speed. Use at your own risk and ensure adequate cooling and power.
              </li>
              <li>
                Do not leave the benchmark running unattended for extended periods, especially on
                mobile devices.
              </li>
              <li>
                We are not responsible for hardware wear, data loss, or other damages arising from use
                of the benchmark.
              </li>
            </ul>

            <h2>License and Intellectual Property</h2>
            <p>
              We grant you a limited, non‑exclusive, non‑transferable license to access and use the
              Service for personal or internal evaluation purposes. All rights not expressly granted
              are reserved. Third‑party marks and libraries are the property of their respective
              owners.
            </p>

            <h2>Acceptable Use</h2>
            <ul>
              <li>No reverse engineering of non‑open components.</li>
              <li>No automated scraping, rate‑limiting evasion, or disruptive load generation.</li>
              <li>No use that infringes rights, violates laws, or introduces malware.</li>
            </ul>

            <h2>Feedback</h2>
            <p>
              If you provide feedback, you grant us a worldwide, royalty‑free, irrevocable license to
              use, modify, and incorporate it without obligation.
            </p>

            <h2>Third‑Party Services</h2>
            <p>
              The Service may reference or integrate third‑party services (e.g., analytics providers).
              We are not responsible for third‑party content or practices. Your use of third‑party
              services is subject to their terms and policies.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, AND NON‑INFRINGEMENT. We do not warrant accuracy of scores,
              compatibility with your device, or that the Service will be uninterrupted or error‑free.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS, DATA, USE, OR GOODWILL, ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE,
              WHETHER BASED IN CONTRACT, TORT, OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
              DAMAGES. OUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED USD $100 OR THE AMOUNT YOU
              PAID (IF ANY) FOR THE SERVICE IN THE 12 MONTHS PRECEDING THE CLAIM, WHICHEVER IS LESS.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless {SITE_NAME} from any claims, losses,
              liabilities, and expenses (including attorneys’ fees) arising out of your use of the
              Service or violation of these Terms.
            </p>

            <h2>Changes to the Service and Terms</h2>
            <p>
              We may modify or discontinue the Service at any time. We may update these Terms; your
              continued use constitutes acceptance of the updated Terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of the jurisdiction of our principal place of
              business, without regard to conflict‑of‑laws rules. Venue and jurisdiction lie in the
              courts located there, unless applicable law provides otherwise.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these Terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>

            <hr />
            <p className="text-xs text-muted-foreground">
              This document is provided for informational purposes only and does not constitute legal
              advice. Please consult your legal counsel to adapt these Terms to your specific
              circumstances.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
