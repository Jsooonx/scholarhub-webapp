import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import Footer from '@/components/Footer';
import ShortlistDashboard from '@/components/ShortlistDashboard';
import { getApplicationsWithDetails } from '@/app/actions/shortlist';
import { BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'My Shortlist & Tracker',
  description: 'Track your application status and save notes for your saved scholarships.',
  alternates: {
    canonical: `${BASE_URL}/shortlist`,
  },
};

export const dynamic = 'force-dynamic';

export default async function ShortlistPage() {
  const result = await getApplicationsWithDetails();

  if (!result.authenticated && !result.error) {
    redirect('/login?next=/shortlist');
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">


      <ShortlistDashboard
        initialApplications={result.applications}
        email={result.email}
        error={result.error}
      />

      <Footer />
    </div>
  );
}
