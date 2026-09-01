'use server';

import { redirect } from 'next/navigation';
import { sendMagicLink } from '@/lib/auth';
import { safeInternalPath } from '@/lib/security';

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const next = safeInternalPath(formData.get('next'));

  if (!email || !email.includes('@')) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=email`);
  }

  const result = await sendMagicLink(email, next);

  if (!result.success) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=otp`);
  }

  redirect(`/login?next=${encodeURIComponent(next)}&sent=1&email=${encodeURIComponent(email)}`);
}
