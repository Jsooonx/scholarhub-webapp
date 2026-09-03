'use client';

import { useState, useEffect } from 'react';
import ShortlistDashboard from '@/components/ShortlistDashboard';
import { fetchShortlist, fetchProfile, type ScholarshipApplication } from '@/lib/client-api';
import { type QuizAnswers } from '@/lib/matching';

export default function ShortlistClient() {
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchShortlist();
        if (!result.authenticated) {
          window.location.href = '/login?next=/shortlist';
          return;
        }
        setApplications(result.applications || []);
        setEmail(result.email);
        setError(result.error);

        const profileRes = await fetchProfile();
        if (profileRes.profile?.quiz_answers) {
          setQuizAnswers(profileRes.profile.quiz_answers);
        }
      } catch (err) {
        console.error('Error loading shortlist:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-brand-muted">
        Loading shortlist...
      </div>
    );
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
