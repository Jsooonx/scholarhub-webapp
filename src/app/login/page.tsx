import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/Footer';
import { signInWithEmail } from './actions';
import { BASE_URL } from '@/lib/scholarships';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to ScholarHub to save scholarships to your shortlist.',
  alternates: {
    canonical: `${BASE_URL}/login`,
  },
};

function safeNext(next?: string) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/shortlist';
  return next;
}

const errorCopy: Record<string, string> = {
  email: 'Please enter a valid email address.',
  otp: 'Magic link could not be sent. Please try again.',
  callback: 'Sign in link has expired or is invalid. Please request a new one.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; sent?: string; email?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const error = params.error ? errorCopy[params.error] || 'Something went wrong. Please try again.' : null;

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <main className="flex flex-grow items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-7 sm:p-9 shadow-sm">
          <Link href="/" className="mb-6 inline-flex text-xs font-medium text-brand-muted hover:text-brand-dark transition-colors">
            ← Back to ScholarHub
          </Link>

          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Account Access</span>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-brand-dark">Save your scholarship list</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-brand-muted">
            Enter your email to receive a passwordless magic sign-in link. No password needed!
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 leading-relaxed">
              {error}
            </div>
          )}

          {params.sent === '1' && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 leading-relaxed">
              ✨ Magic link sent to <span className="font-semibold">{params.email || 'your email'}</span>. Check your inbox (and spam folder) to sign in!
            </div>
          )}

          <form action={signInWithEmail} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={next} />
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Email address</span>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-brand-border bg-brand-bg/40 px-4 py-3 pl-10 text-sm text-brand-dark outline-none transition focus:border-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-dark/10"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
              </div>
            </label>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-full border border-brand-dark bg-brand-dark px-5 py-3 text-sm font-semibold text-white hover:bg-brand-cream hover:text-brand-dark hover:border-brand-dark cursor-pointer transition-all duration-200 interactive-press shadow-sm"
            >
              <span>Send magic sign-in link</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-brand-muted">
            We only use your account to sync your saved shortlist and application milestones across devices.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
