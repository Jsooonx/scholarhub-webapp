'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function safeNext(value: FormDataEntryValue | string | null): string {
  const raw = typeof value === 'string' ? value : '';
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/shortlist';
  return raw;
}

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(formData.get('next'));

  if (!isSupabaseConfigured()) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=config`);
  }

  const origin = (await headers()).get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=oauth`);
  }

  redirect(data.url);
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const next = safeNext(formData.get('next'));

  if (!email || !email.includes('@')) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=email`);
  }

  if (!isSupabaseConfigured()) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=config`);
  }

  const origin = (await headers()).get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=otp`);
  }

  redirect(`/login?next=${encodeURIComponent(next)}&sent=1&email=${encodeURIComponent(email)}`);
}
