'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getScholarshipBySlug } from '@/lib/scholarships';

type ShortlistResult =
  | { ok: true }
  | { ok: false; status: 401 | 404 | 500; error: string };

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export async function getShortlistSlugs(): Promise<{
  authenticated: boolean;
  slugs: string[];
  email?: string;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      authenticated: false,
      slugs: [],
      error: 'Supabase is not configured.',
    };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { authenticated: false, slugs: [] };
    }

    const { data, error } = await supabase
      .from('shortlists')
      .select('scholarship_slug')
      .order('created_at', { ascending: false });

    if (error) {
      return {
        authenticated: true,
        slugs: [],
        email: user.email ?? undefined,
        error: error.message,
      };
    }

    return {
      authenticated: true,
      slugs: (data ?? []).map((row) => row.scholarship_slug),
      email: user.email ?? undefined,
    };
  } catch (error) {
    return {
      authenticated: false,
      slugs: [],
      error: error instanceof Error ? error.message : 'Unable to load shortlist.',
    };
  }
}

export async function addToShortlist(slug: string): Promise<ShortlistResult> {
  if (!getScholarshipBySlug(slug)) {
    return { ok: false, status: 404, error: 'Scholarship not found.' };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, status: 500, error: 'Supabase is not configured.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { ok: false, status: 401, error: 'Sign in to save scholarships.' };
    }

    const { error } = await supabase
      .from('shortlists')
      .upsert(
        { user_id: user.id, scholarship_slug: slug },
        { onConflict: 'user_id,scholarship_slug' }
      );

    if (error) {
      return { ok: false, status: 500, error: error.message };
    }

    revalidatePath('/shortlist');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unable to save scholarship.',
    };
  }
}

export async function removeFromShortlist(slug: string): Promise<ShortlistResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, status: 500, error: 'Supabase is not configured.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { ok: false, status: 401, error: 'Sign in to manage your shortlist.' };
    }

    const { error } = await supabase
      .from('shortlists')
      .delete()
      .eq('user_id', user.id)
      .eq('scholarship_slug', slug);

    if (error) {
      return { ok: false, status: 500, error: error.message };
    }

    revalidatePath('/shortlist');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unable to remove scholarship.',
    };
  }
}
