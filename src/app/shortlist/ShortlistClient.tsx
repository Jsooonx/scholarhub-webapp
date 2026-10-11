'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShortlistDashboard from '@/components/ShortlistDashboard';
import ShortlistSkeleton from './ShortlistSkeleton';
import { fetchShortlist, fetchProfile, getCachedShortlist, getCachedProfile, type ScholarshipApplication } from '@/lib/client-api';
import { type QuizAnswers } from '@/lib/matching';

export default function ShortlistClient() {
  const router = useRouter();

  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    // Immediately restore from cache on client mount (0ms latency, zero hydration mismatch)
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

  if (loading) {
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
