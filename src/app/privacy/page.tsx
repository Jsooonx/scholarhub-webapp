import type { Metadata } from 'next';
import Link from 'next/link';

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
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Email Address:</strong> If you voluntarily subscribe to our newsletter for scholarship alerts, or if you request a passwordless magic sign-in link to save your scholarship shortlist and application tracker data.
                  </li>
                  <li>
                    <strong>Shortlist & Application Tracker Data:</strong> When signed in, your bookmarked scholarships, pipeline milestones (Shortlisted, Applying, Outcome), custom target deadlines, and personal application notes are synchronized to your account so you can access them across multiple devices.
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
                Your email address is used solely to dispatch passwordless sign-in links and, if you opted in, periodic scholarship alerts. We do not use your personal information for third-party advertising, and we never sell, lease, or rent your data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">4. Third-Party Service Providers</h2>
              <div className="space-y-2 text-xs">
                <p>We work with trusted infrastructure providers to power ScholarHub:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Resend:</strong> Used as our transactional email delivery service to securely send passwordless magic login links and email newsletters.
                  </li>
                  <li>
                    <strong>Supabase:</strong> Used as our managed database service (PostgreSQL) to store user authentication sessions, profiles, and encrypted shortlist records.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-brand-dark">5. Managing or Deleting Your Data</h2>
              <p className="text-xs">
                You can opt out of receiving newsletter updates at any time via the "Unsubscribe" link in any alert email. To request deletion of your account and saved shortlist data, contact us directly at <a href="mailto:jsnxbusiness@gmail.com" className="text-brand-dark hover:underline font-medium">jsnxbusiness@gmail.com</a> and we will remove your records promptly.
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
