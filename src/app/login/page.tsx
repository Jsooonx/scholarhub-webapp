import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/Footer';
import { signInWithEmail, signInWithGoogle } from './actions';
import { BASE_URL } from '@/lib/scholarships';

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
  config: 'Supabase is not configured yet. Add the Supabase env variables before using accounts.',
  email: 'Enter a valid email address.',
  oauth: 'Google sign in could not be started. Please try again.',
  otp: 'Magic link could not be sent. Please try again.',
  callback: 'Sign in could not be completed. Please try again.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; sent?: string; email?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const error = params.error ? errorCopy[params.error] : null;

  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">

      <main className="flex flex-grow items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-brand-border bg-white p-7 shadow-sm">
          <Link href="/" className="mb-6 inline-flex text-xs font-medium text-brand-muted hover:text-brand-dark">
            Back to ScholarHub
          </Link>

          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted">Account</p>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-brand-dark">Save your scholarship list</h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted">
            Sign in to save scholarships and reopen your shortlist from any device.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {params.sent === '1' && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
              Magic link sent{params.email ? ` to ${params.email}` : ''}. Check your inbox to finish signing in.
            </div>
          )}

          <form action={signInWithGoogle} className="mt-6">
            <input type="hidden" name="next" value={next} />
            <button
              type="submit"
              className="w-full rounded-full border border-brand-dark bg-brand-dark px-5 py-3 text-sm font-semibold text-white hover:bg-white hover:text-brand-dark cursor-pointer interactive-press"
            >
              Continue with Google
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-brand-border" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">or</span>
            <div className="h-px flex-1 bg-brand-border" />
          </div>

          <form action={signInWithEmail} className="space-y-3">
            <input type="hidden" name="next" value={next} />
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Email address</span>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition focus:ring-2 focus:ring-brand-dark/20"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full border border-brand-border bg-brand-cream px-5 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-dark hover:text-white hover:border-brand-dark cursor-pointer interactive-press"
            >
              Send magic link
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-brand-muted">
            We only use your account to sync your shortlist.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
