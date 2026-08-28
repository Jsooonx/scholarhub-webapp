'use server';

import { redirect } from 'next/navigation';
import { sendMagicLink } from '@/lib/auth';

function safeNext(value: FormDataEntryValue | string | null): string {
  const raw = typeof value === 'string' ? value : '';
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/shortlist';
  return raw;
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const next = safeNext(formData.get('next'));

  if (!email || !email.includes('@')) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=email`);
  }

  const result = await sendMagicLink(email, next);

  if (!result.success) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=otp`);
  }

  redirect(`/login?next=${encodeURIComponent(next)}&sent=1&email=${encodeURIComponent(email)}`);
}
