import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentProfile } from '@/app/actions/profile';
import { BASE_URL } from '@/lib/scholarships';
import SplitText from '@/components/SplitText';
import ProfileForm from '@/components/ProfileForm';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your ScholarHub profile.',
  alternates: {
    canonical: `${BASE_URL}/profile`,
  },
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const result = await getCurrentProfile();

  if (!result.authenticated && !result.error) {
    redirect('/login?next=/profile');
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Navbar />

      <main className="flex-grow">
        <div className="border-b border-brand-border bg-brand-bg">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <nav className="mb-2 text-xs text-brand-muted">
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
              <span className="mx-2">·</span>
              <span className="font-medium text-brand-dark">Profile</span>
            </nav>
            <SplitText
              text="Profile"
              className="font-serif text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl"
              tag="h1"
              delay={30}
              duration={0.6}
              ease="power2.out"
              threshold={0.1}
            />
            <p className="mt-2 max-w-xl text-sm text-brand-muted">
              Set up your public ScholarHub identity before community features arrive.
            </p>
          </div>
        </div>

        <ProfileForm
          profile={result.profile}
          email={result.email}
          errorMsg={result.error}
          savedParam={params.saved}
          errorParam={params.error}
        />
      </main>

      <Footer />
    </div>
  );
}
