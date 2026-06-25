'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface Profile {
  user_id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  location: string | null;
  website_url: string | null;
  avatar_url: string | null;
  quiz_answers: any | null;
  created_at: string;
  updated_at: string;
}

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

function cleanOptional(value: FormDataEntryValue | null, maxLength: number) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  return text.slice(0, maxLength);
}

function cleanUsername(value: FormDataEntryValue | null) {
  const username = String(value ?? '').trim().toLowerCase();
  if (!username) return null;
  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    throw new Error('Username must be 3-30 characters and use only lowercase letters, numbers, or underscores.');
  }
  return username;
}

function cleanUrl(value: FormDataEntryValue | null, fieldName: string) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error();
    }
    return url.toString().slice(0, 300);
  } catch {
    throw new Error(`${fieldName} must be a valid http(s) URL.`);
  }
}

export async function getCurrentProfile(): Promise<{
  authenticated: boolean;
  email?: string;
  profile?: Profile | null;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { authenticated: false, error: 'Supabase is not configured.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { authenticated: false };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      return {
        authenticated: true,
        email: user.email ?? undefined,
        profile: null,
        error: error.message,
      };
    }

    return {
      authenticated: true,
      email: user.email ?? undefined,
      profile: data,
    };
  } catch (error) {
    return {
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unable to load profile.',
    };
  }
}

export async function updateProfileAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect('/profile?error=config');
  }

  let payload: {
    display_name: string | null;
    username: string | null;
    bio: string | null;
    location: string | null;
    website_url: string | null;
    avatar_url: string | null;
    updated_at: string;
  };

  try {
    payload = {
      display_name: cleanOptional(formData.get('display_name'), 80),
      username: cleanUsername(formData.get('username')),
      bio: cleanOptional(formData.get('bio'), 280),
      location: cleanOptional(formData.get('location'), 80),
      website_url: cleanUrl(formData.get('website_url'), 'Website'),
      avatar_url: cleanUrl(formData.get('avatar_url'), 'Avatar URL'),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    redirect(`/profile?error=${encodeURIComponent(error instanceof Error ? error.message : 'Invalid profile data.')}`);
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login?next=/profile');
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        user_id: user.id,
        ...payload,
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    const message = error.code === '23505'
      ? 'That username is already taken.'
      : error.message;
    redirect(`/profile?error=${encodeURIComponent(message)}`);
  }

  revalidatePath('/profile');
  redirect('/profile?saved=1');
}

export async function updateProfileQuizAnswers(answers: any): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          quiz_answers: answers,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath('/shortlist');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to save quiz answers.',
    };
  }
}
