'use client';

import { useState, useEffect } from 'react';
import ScholarMatchQuiz from '@/components/ScholarMatchQuiz';
import { fetchProfile, getCachedProfile } from '@/lib/client-api';
import { type QuizAnswers } from '@/lib/matching';

export default function ScholarMatchQuizClient() {
  const [initialAnswers, setInitialAnswers] = useState<QuizAnswers | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Immediately restore cached answers on client mount (0ms latency, zero hydration mismatch)
    const cached = getCachedProfile();
    if (cached?.profile?.quiz_answers) {
      setInitialAnswers(cached.profile.quiz_answers);
    }
    if (cached) {
      setIsAuthenticated(Boolean(cached.authenticated));
    }

    async function load() {
      try {
        const res = await fetchProfile();
        if (res.profile?.quiz_answers) {
          setInitialAnswers(res.profile.quiz_answers);
        }
        setIsAuthenticated(Boolean(res.authenticated));
      } catch {
        // Continue with local storage
      }
    }
    load();
  }, []);

  return (
    <ScholarMatchQuiz
      initialAnswers={initialAnswers}
      isAuthenticated={isAuthenticated}
    />
  );
}
