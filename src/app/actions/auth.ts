'use server';

import { destroySession } from '@/lib/auth';

export async function signOutAction(): Promise<{ ok: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/auth/signout', { method: 'POST' });
      if (res.ok) return { ok: true };
    } catch (err) {
      console.error('Sign out fetch error:', err);
    }
  }

  try {
    await destroySession();
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to sign out.',
    };
  }
}
