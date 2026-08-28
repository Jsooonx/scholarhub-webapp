import { Suspense } from 'react';
import type { Metadata } from 'next';
import ScholarshipsClient from './ScholarshipsClient';
import Footer from '@/components/Footer';
import { BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'All Scholarships',
  description: 'Browse and filter all scholarships from DAAD, MEXT, Türkiye Burslari and more.',
  alternates: {
    canonical: `${BASE_URL}/scholarships`,
  },
  openGraph: {
    title: 'All Scholarships',
    description: 'Browse and filter all scholarships from DAAD, MEXT, Türkiye Burslari and more.',
    url: `${BASE_URL}/scholarships`,
  },
};

export default function ScholarshipsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-screen animate-pulse bg-brand-bg" />}>
          <ScholarshipsClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
