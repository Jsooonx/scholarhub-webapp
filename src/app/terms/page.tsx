import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/Footer';
import SplitText from '@/components/SplitText';
import { BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms of service for using ScholarHub.',
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
  openGraph: {
    title: 'Terms of Service',
    description: 'Read the terms of service for using ScholarHub.',
    url: `${BASE_URL}/terms`,
  },
};

export default function TermsPage() {
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
        'name': 'Terms of Service',
        'item': `${BASE_URL}/terms`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />


      <main className="flex-grow">
        <div className="border-b border-brand-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <nav className="text-xs text-brand-muted mb-6">
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
              <span className="mx-2">·</span>
              <span className="text-brand-dark font-medium">Terms of Service</span>
            </nav>
            <SplitText
              text="Terms of Service"
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
              <h2 className="font-serif text-xl font-bold text-brand-dark">1. Acceptance of Terms</h2>
              <p className="text-xs">
                By accessing and using ScholarHub (scholarhub.jsooonx.my.id), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not access or use the directory.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">2. Informational Purposes Only</h2>
              <p className="text-xs">
                ScholarHub is an independent directory of international scholarships. All information is manually collected and curated from official scholarship providers and university portals for general informational and educational purposes. We are not a scholarship provider and do not administer, evaluate, or award any scholarships listed on this website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">3. Accuracy of Information</h2>
              <p className="text-xs">
                While we strive to provide accurate, up-to-date, and verified information, scholarship programs, criteria, benefits, and deadlines are subject to change by the respective providers at any time without notice. ScholarHub does not guarantee the completeness, accuracy, or reliability of any information on the website. Users must always verify all details directly on the official provider website before applying.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">4. Outbound Links</h2>
              <p className="text-xs">
                ScholarHub contains links to external official websites of scholarship providers. We have no control over, and assume no responsibility for, the content, privacy policies, practices, or availability of any third-party websites or services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">5. Limitation of Liability</h2>
              <p className="text-xs">
                In no event shall ScholarHub or its creator (Jsooonx) be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the website or reliance on any information provided herein.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">6. Changes to Terms</h2>
              <p className="text-xs">
                We reserve the right to modify or replace these Terms of Service at any time. Your continued use of the website after any changes constitute acceptance of the new terms.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
