'use client';

import { useState, useEffect } from 'react';
import ScholarMatchQuiz from '@/components/ScholarMatchQuiz';
import { getCurrentProfile } from '@/app/actions/profile';
import { type QuizAnswers } from '@/lib/matching';

export default function ScholarMatchQuizClient() {
  const [initialAnswers, setInitialAnswers] = useState<QuizAnswers | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getCurrentProfile();
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
