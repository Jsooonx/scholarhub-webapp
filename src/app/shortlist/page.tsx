import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShortlistClient from './ShortlistClient';
import Footer from '@/components/Footer';
import { BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'My Shortlist & Tracker',
  description: 'Track your application status and save notes for your saved scholarships.',
  alternates: {
    canonical: `${BASE_URL}/shortlist`,
  },
};

export default function ShortlistPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-screen animate-pulse bg-brand-bg" />}>
          <ShortlistClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
