'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getScholarshipBySlug, type Scholarship } from '@/lib/scholarships';

type ShortlistResult =
  | { ok: true }
  | { ok: false; status: 401 | 404 | 500; error: string };

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ScholarshipApplication {
  id: string;
  user_id: string;
  scholarship_slug: string;
  status: 'shortlisted' | 'preparing' | 'applied' | 'interviewing' | 'accepted' | 'rejected';
  notes: string | null;
  checklist: ChecklistItem[] | null;
  created_at: string;
  updated_at: string;
  scholarship: Scholarship | null;
}

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
      .from('scholarship_applications')
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
      .from('scholarship_applications')
      .upsert(
        { user_id: user.id, scholarship_slug: slug, status: 'shortlisted' },
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
      .from('scholarship_applications')
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

export async function updateApplicationStatus(
  slug: string,
  status: ScholarshipApplication['status']
): Promise<ShortlistResult> {
  const validStatuses = ['shortlisted', 'preparing', 'applied', 'interviewing', 'accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    return { ok: false, status: 500, error: 'Invalid application status.' };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, status: 500, error: 'Supabase is not configured.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { ok: false, status: 401, error: 'Sign in to update application status.' };
    }

    const { error } = await supabase
      .from('scholarship_applications')
      .update({ status, updated_at: new Date().toISOString() })
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
      error: error instanceof Error ? error.message : 'Unable to update status.',
    };
  }
}

export async function updateApplicationNotes(
  slug: string,
  notes: string | null
): Promise<ShortlistResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, status: 500, error: 'Supabase is not configured.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { ok: false, status: 401, error: 'Sign in to update notes.' };
    }

    const { error } = await supabase
      .from('scholarship_applications')
      .update({ notes: notes || null, updated_at: new Date().toISOString() })
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
      error: error instanceof Error ? error.message : 'Unable to update notes.',
    };
  }
}

export async function getApplicationsWithDetails(): Promise<{
  authenticated: boolean;
  applications: ScholarshipApplication[];
  email?: string;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      authenticated: false,
      applications: [],
      error: 'Supabase is not configured.',
    };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { authenticated: false, applications: [] };
    }

    const { data, error } = await supabase
      .from('scholarship_applications')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      return {
        authenticated: true,
        applications: [],
        email: user.email ?? undefined,
        error: error.message,
      };
    }

    const applications: ScholarshipApplication[] = (data ?? []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      scholarship_slug: row.scholarship_slug,
      status: row.status,
      notes: row.notes,
      checklist: row.checklist ?? null,
      created_at: row.created_at,
      updated_at: row.updated_at,
      scholarship: getScholarshipBySlug(row.scholarship_slug) || null,
    }));

    return {
      authenticated: true,
      applications,
      email: user.email ?? undefined,
    };
  } catch (error) {
    return {
      authenticated: false,
      applications: [],
      error: error instanceof Error ? error.message : 'Unable to load applications.',
    };
  }
}

export async function updateApplicationChecklist(
  slug: string,
  checklist: ChecklistItem[]
): Promise<ShortlistResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, status: 500, error: 'Supabase is not configured.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { ok: false, status: 401, error: 'Sign in to update checklist.' };
    }

    const { error } = await supabase
      .from('scholarship_applications')
      .update({ checklist, updated_at: new Date().toISOString() })
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
      error: error instanceof Error ? error.message : 'Unable to update checklist.',
    };
  }
}
