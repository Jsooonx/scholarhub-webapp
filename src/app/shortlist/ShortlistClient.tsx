'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShortlistDashboard from '@/components/ShortlistDashboard';
import ShortlistSkeleton from './ShortlistSkeleton';
import { fetchShortlist, fetchProfile, getCachedShortlist, getCachedProfile, type ScholarshipApplication } from '@/lib/client-api';
import { type QuizAnswers } from '@/lib/matching';
import { useIsHydrated } from '@/lib/hydration';

export default function ShortlistClient() {
  const router = useRouter();
  const isHydrated = useIsHydrated();

  const [initialData] = useState(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      const cachedShortlist = getCachedShortlist();
      const cachedProfile = getCachedProfile();
      if (cachedShortlist) {
        return {
          applications: cachedShortlist.applications || [],
          email: cachedShortlist.email,
          quizAnswers: cachedProfile?.profile?.quiz_answers || null,
          hasCache: true,
        };
      }
    }
    return {
      applications: [],
      email: undefined,
      quizAnswers: null,
      hasCache: false,
    };
  });

  const [applications, setApplications] = useState<ScholarshipApplication[]>(initialData.applications);
  const [email, setEmail] = useState<string | undefined>(initialData.email);
  const [error, setError] = useState<string | undefined>(undefined);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(initialData.quizAnswers);
  const [loading, setLoading] = useState(!initialData.hasCache);

  useEffect(() => {
    let isCancelled = false;

    // Immediately restore from cache on client mount if not already initialized
    const cachedShortlist = getCachedShortlist();
    const cachedProfile = getCachedProfile();
    if (cachedShortlist) {
      setApplications(cachedShortlist.applications || []);
      setEmail(cachedShortlist.email);
      setLoading(false);
    }
    if (cachedProfile?.profile?.quiz_answers) {
      setQuizAnswers(cachedProfile.profile.quiz_answers);
    }

    async function load() {
      try {
        const result = await fetchShortlist();
        if (isCancelled) return;

        if (!result.authenticated) {
          router.replace('/login?next=/shortlist');
          return;
        }

        setApplications(result.applications || []);
        setEmail(result.email);
        setError(result.error);

        const profileRes = await fetchProfile();
        if (isCancelled) return;
        if (profileRes.profile?.quiz_answers) {
          setQuizAnswers(profileRes.profile.quiz_answers);
        }
      } catch (err) {
        console.error('Error loading shortlist:', err);
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

  if (!isHydrated || loading) {
    return <ShortlistSkeleton />;
  }

  return (
    <ShortlistDashboard
      initialApplications={applications}
      email={email}
      error={error}
      quizAnswers={quizAnswers}
    />
  );
}
