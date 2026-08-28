'use server';

import { destroySession } from '@/lib/auth';

export async function signOutAction(): Promise<{ ok: boolean; error?: string }> {
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
