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

function LoginSkeleton() {
  return (
    <div className="w-full max-w-md rounded-xl border border-brand-border bg-white p-7 sm:p-9 shadow-xs space-y-5">
      <div className="space-y-2">
        <div className="h-6 w-32 rounded-lg bg-brand-border/70 animate-pulse" />
        <div className="h-3.5 w-56 rounded-full bg-brand-border/60 animate-pulse" />
      </div>
      <div className="space-y-3 pt-2">
        <div className="h-3 w-20 rounded-full bg-brand-border/60 animate-pulse" />
        <div className="h-10 w-full rounded-xl bg-brand-border/50 animate-pulse" />
      </div>
      <div className="h-10 w-full rounded-lg bg-brand-border/70 animate-pulse" />
      <div className="h-3 w-40 rounded-full bg-brand-border/50 animate-pulse mx-auto" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main className="flex flex-grow items-center justify-center px-4 py-16">
        <Suspense fallback={<LoginSkeleton />}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
