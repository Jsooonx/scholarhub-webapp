import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from './LoginForm';
import Footer from '@/components/Footer';
import { BASE_URL } from '@/lib/scholarships';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to ScholarHub to save scholarships to your shortlist.',
  alternates: {
    canonical: `${BASE_URL}/login`,
  },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main className="flex flex-grow items-center justify-center px-4 py-16">
        <Suspense fallback={<div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-7 sm:p-9 shadow-sm animate-pulse min-h-[300px]" />}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
