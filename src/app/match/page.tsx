import type { Metadata } from 'next';
import ScholarMatchQuiz from '@/components/ScholarMatchQuiz';
import { getCurrentProfile } from '@/app/actions/profile';
import { BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'ScholarMatch Quiz',
  description: 'Find scholarships matching your profile and academic goals.',
  alternates: {
    canonical: `${BASE_URL}/match`,
  },
};

export const dynamic = 'force-dynamic';

export default async function MatchPage() {
  const res = await getCurrentProfile();
  const initialAnswers = res.profile?.quiz_answers ?? null;
  const isAuthenticated = res.authenticated;

  return (
    <ScholarMatchQuiz
      initialAnswers={initialAnswers}
      isAuthenticated={isAuthenticated}
    />
  );
}
