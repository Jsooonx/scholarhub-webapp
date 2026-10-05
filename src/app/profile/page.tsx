import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProfileClient from './ProfileClient';
import ProfileSkeleton from './ProfileSkeleton';
import Footer from '@/components/Footer';
import { BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your ScholarHub profile.',
  alternates: {
    canonical: `${BASE_URL}/profile`,
  },
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main className="flex-grow">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
