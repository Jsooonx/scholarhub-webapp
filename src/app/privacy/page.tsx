import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SplitText from '@/components/SplitText';
import { BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the privacy policy for ScholarHub.',
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy',
    description: 'Read the privacy policy for ScholarHub.',
    url: `${BASE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': BASE_URL,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Privacy Policy',
        'item': `${BASE_URL}/privacy`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <main className="flex-grow">
        <div className="border-b border-brand-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <nav className="text-xs text-brand-muted mb-6">
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
              <span className="mx-2">·</span>
              <span className="text-brand-dark font-medium">Privacy Policy</span>
            </nav>
            <SplitText
              text="Privacy Policy"
              className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-brand-dark mb-4 leading-tight"
              tag="h1"
              delay={30}
              duration={0.6}
              ease="power2.out"
              threshold={0.1}
            />
            <p className="text-xs text-brand-muted">
              Last updated: June 12, 2026
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-sm max-w-none text-brand-muted leading-relaxed space-y-6">
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">1. Overview</h2>
              <p className="text-xs">
                ScholarHub (scholarhub.jsooonx.my.id) is built to be a simple, clean, and private scholarship directory. We respect your privacy and are committed to protecting any personal information you share with us. This Privacy Policy describes how we collect, use, and safeguard your data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">2. Information We Collect</h2>
              <div className="space-y-2 text-xs">
                <p>
                  We collect very limited personal data:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Email Address:</strong> If you voluntarily subscribe to our newsletter for scholarship alerts, we collect your email address.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> We do not track you across the web, nor do we run invasive tracking cookies. We may use privacy-friendly analytics tools to check general traffic numbers (like page views) without identifying individual visitors.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">3. How We Use Your Data</h2>
              <p className="text-xs">
                Your email address is used solely to send you notifications about new scholarship additions or major updates to ScholarHub. We do not use your email for marketing unrelated products, and we never sell, lease, or share your email with third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">4. Third-Party Service Providers</h2>
              <p className="text-xs">
                We use <strong>Resend</strong> as our third-party email delivery service to store and manage our subscriber list and send out notification emails. Resend is configured to keep your data secure. You can review Resend's Privacy Policy on their official website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">5. Unsubscribing</h2>
              <p className="text-xs">
                You can opt-out of receiving updates from us at any time. Every email we send includes an "Unsubscribe" link at the bottom, or you can contact us directly at <a href="mailto:jsnxbusiness@gmail.com" className="text-brand-dark hover:underline font-medium">jsnxbusiness@gmail.com</a> to have your email removed immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">6. Contact Us</h2>
              <p className="text-xs">
                If you have any questions or concerns about this Privacy Policy, feel free to contact us at <a href="mailto:jsnxbusiness@gmail.com" className="text-brand-dark hover:underline font-medium">jsnxbusiness@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
