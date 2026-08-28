import type { Metadata } from 'next';
import ScholarMatchQuizClient from './ScholarMatchQuizClient';
import { BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'ScholarMatch Quiz',
  description: 'Find scholarships matching your profile and academic goals.',
  alternates: {
    canonical: `${BASE_URL}/match`,
  },
};

export default function MatchPage() {
  return <ScholarMatchQuizClient />;
}
