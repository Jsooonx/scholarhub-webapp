'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';
import ProfileSkeleton from './ProfileSkeleton';
import { fetchProfile, getCachedProfile } from '@/lib/client-api';
import type { Profile } from '@/app/actions/profile';

export default function ProfileClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const savedParam = searchParams.get('saved') ?? undefined;
  const errorParam = searchParams.get('error') ?? undefined;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    // Immediately restore from cache on client mount (0ms latency, zero hydration mismatch)
    const cached = getCachedProfile();
    if (cached) {
      if (cached.profile) setProfile(cached.profile);
      if (cached.email) setEmail(cached.email);
      setLoading(false);
    }

    async function load() {
      try {
        const res = await fetchProfile();
        if (isCancelled) return;

        if (!res.authenticated) {
          router.replace('/login?next=/profile');
          return;
        }
        setProfile(res.profile ?? null);
        setEmail(res.email);
        setErrorMsg(res.error);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      isCancelled = true;
    };
  }, [router]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <div className="border-b border-brand-border bg-brand-bg">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="mb-2 text-xs text-brand-muted">
            <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
            <span className="mx-2">·</span>
            <span className="font-medium text-brand-dark">Profile</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl">
            Profile
          </h1>
          <p className="mt-2 max-w-xl text-sm text-brand-muted">
            Set up your public ScholarHub identity before community features arrive.
          </p>
        </div>
      </div>

      <ProfileForm
        profile={profile}
        email={email}
        errorMsg={errorMsg}
        savedParam={savedParam}
        errorParam={errorParam}
      />
    </>
  );
}
