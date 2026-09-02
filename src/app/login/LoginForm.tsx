'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { safeInternalPath } from '@/lib/security';
import { Button } from '@/components/ui/button';

const errorCopy: Record<string, string> = {
  email: 'Please enter a valid email address.',
  otp: 'Magic link could not be sent. Please try again.',
  callback: 'Sign in link has expired or is invalid. Please request a new one.',
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = safeInternalPath(searchParams.get('next'));
  const errorParam = searchParams.get('error');
  const urlSent = searchParams.get('sent');
  const urlEmail = searchParams.get('email');

  const [inputEmail, setInputEmail] = useState(urlEmail || '');
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(urlSent === '1' ? (urlEmail || 'your email') : null);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || (errorParam ? errorCopy[errorParam] || 'Something went wrong. Please try again.' : null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    const cleanEmail = inputEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, next }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLocalError(data?.error || 'Magic link could not be sent. Please try again.');
      } else {
        setSentEmail(cleanEmail);
      }
    } catch (err: any) {
      setLocalError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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

      {displayError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 leading-relaxed">
          {displayError}
        </div>
      )}

      {sentEmail && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 leading-relaxed">
          ✨ Magic link sent to <span className="font-semibold">{sentEmail}</span>. Check your inbox (and spam folder) to sign in!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        action="/api/auth/send-magic-link"
        method="POST"
        className="mt-6 space-y-4"
      >
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-brand-dark">Email address</span>
          <div className="relative">
            <input
              name="email"
              type="email"
              required
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-brand-border bg-brand-bg/40 px-4 py-3 pl-10 text-sm text-brand-dark outline-none transition focus:border-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-dark/10"
            />
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
          </div>
        </label>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
          className="group w-full [&>span.relative]:flex-row-reverse"
        >
          {loading ? 'Sending magic link...' : 'Send magic sign-in link'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-brand-muted">
        We only use your account to sync your saved shortlist and application milestones across devices.
      </p>
    </div>
  );
}
