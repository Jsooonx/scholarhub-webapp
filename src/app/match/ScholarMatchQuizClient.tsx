'use client';

import { useState, useEffect } from 'react';
import ScholarMatchQuiz from '@/components/ScholarMatchQuiz';
import ScholarMatchSkeleton from './ScholarMatchSkeleton';
import { fetchProfile, getCachedProfile } from '@/lib/client-api';
import { type QuizAnswers } from '@/lib/matching';
import { useIsHydrated } from '@/lib/hydration';

export default function ScholarMatchQuizClient() {
  const isHydrated = useIsHydrated();

  const [initialAnswers, setInitialAnswers] = useState<QuizAnswers | null>(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      const cached = getCachedProfile();
      if (cached?.profile?.quiz_answers) return cached.profile.quiz_answers;
      try {
        const savedAnswers = sessionStorage.getItem('scholarMatchAnswers');
        const savedCompleted = sessionStorage.getItem('scholarMatchCompleted') === 'true';
        if (savedAnswers && savedCompleted) {
          return JSON.parse(savedAnswers);
        }
      } catch {}
    }
    return null;
  });

  const [ready, setReady] = useState(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      const cached = getCachedProfile();
      if (cached?.profile?.quiz_answers) return true;
      try {
        const savedAnswers = sessionStorage.getItem('scholarMatchAnswers');
        const savedCompleted = sessionStorage.getItem('scholarMatchCompleted') === 'true';
        if (savedAnswers && savedCompleted) return true;
      } catch {}
    }
    return false;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      return Boolean(getCachedProfile()?.authenticated);
    }
    return false;
  });

  const [authChecked, setAuthChecked] = useState(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      return Boolean(getCachedProfile());
    }
    return false;
  });

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      // 1. Read local cached profile
      const cached = getCachedProfile();
      let answers: QuizAnswers | null = cached?.profile?.quiz_answers || null;
      let auth = Boolean(cached?.authenticated);

      // 2. Read session storage if not found in cache
      if (!answers && typeof window !== 'undefined') {
        const savedAnswers = sessionStorage.getItem('scholarMatchAnswers');
        const savedCompleted = sessionStorage.getItem('scholarMatchCompleted') === 'true';
        if (savedAnswers && savedCompleted) {
          try {
            answers = JSON.parse(savedAnswers);
          } catch {}
        }
      }

      // If answers exist locally, display immediately and silently revalidate
      if (answers) {
        if (!isCancelled) {
          setInitialAnswers(answers);
          setIsAuthenticated(auth);
          setAuthChecked(Boolean(cached));
          setReady(true);
        }

        try {
          const res = await fetchProfile();
          if (!isCancelled) {
            if (res.profile?.quiz_answers) {
              setInitialAnswers(res.profile.quiz_answers);
            }
            setIsAuthenticated(Boolean(res.authenticated));
            setAuthChecked(true);
          }
        } catch {}
        return;
      }

      // 3. Otherwise, reveal quiz immediately and check profile in background
      if (!isCancelled) {
        setAuthChecked(true);
        setReady(true);
      }

      try {
        const res = await fetchProfile();
        if (!isCancelled) {
          if (res.profile?.quiz_answers) {
            setInitialAnswers(res.profile.quiz_answers);
          }
          setIsAuthenticated(Boolean(res.authenticated));
        }
      } catch {
        // Guest mode default
      }
    }

    void init();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!isHydrated || !ready) {
    return <ScholarMatchSkeleton />;
  }

  return (
    <ScholarMatchQuiz
      initialAnswers={initialAnswers}
      isAuthenticated={isAuthenticated}
      authChecked={authChecked}
    />
  );
}
