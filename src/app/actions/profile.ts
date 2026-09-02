'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

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
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        let parsedQuizAnswers = null;
        if (typeof data.profile?.quiz_answers === 'string') {
          try {
            parsedQuizAnswers = JSON.parse(data.profile.quiz_answers);
          } catch {
            parsedQuizAnswers = null;
          }
        } else if (data.profile?.quiz_answers) {
          parsedQuizAnswers = data.profile.quiz_answers;
        }

        return {
          authenticated: Boolean(data.authenticated),
          email: data.email,
          profile: data.profile
            ? {
                user_id: data.profile.user_id,
                display_name: data.profile.display_name,
                username: data.profile.username,
                bio: data.profile.bio,
                location: data.profile.location,
                website_url: data.profile.website_url,
                avatar_url: data.profile.avatar_url,
                quiz_answers: parsedQuizAnswers,
                created_at: data.profile.created_at,
                updated_at: data.profile.updated_at,
              }
            : null,
        };
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    }
  }

  try {
    const { authenticated, user, email } = await getCurrentUser();

    if (!authenticated || !user) {
      return { authenticated: false, profile: null };
    }

    const db = getDb();
    const row = await db
      .prepare('SELECT * FROM profiles WHERE user_id = ? LIMIT 1')
      .bind(user.id)
      .first<any>();

    if (!row) {
      return {
        authenticated: true,
        email,
        profile: null,
      };
    }

    let parsedQuizAnswers = null;
    if (typeof row.quiz_answers === 'string') {
      try {
        parsedQuizAnswers = JSON.parse(row.quiz_answers);
      } catch {
        parsedQuizAnswers = null;
      }
    } else if (row.quiz_answers) {
      parsedQuizAnswers = row.quiz_answers;
    }

    const profile: Profile = {
      user_id: row.user_id,
      display_name: row.display_name,
      username: row.username,
      bio: row.bio,
      location: row.location,
      website_url: row.website_url,
      avatar_url: row.avatar_url,
      quiz_answers: parsedQuizAnswers,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    return {
      authenticated: true,
      email,
      profile,
    };
  } catch (error) {
    return {
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unable to load profile.',
    };
  }
}

export async function updateProfileAction(formData: FormData) {
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

  const { authenticated, user } = await getCurrentUser();
  if (!authenticated || !user) {
    redirect('/login?next=/profile');
  }

  const db = getDb();
  try {
    // Check if username is taken by another user
    if (payload.username) {
      const existing = await db
        .prepare('SELECT user_id FROM profiles WHERE username = ? AND user_id != ?')
        .bind(payload.username, user.id)
        .first();

      if (existing) {
        redirect('/profile?error=' + encodeURIComponent('That username is already taken.'));
      }
    }

    await db
      .prepare(`
        INSERT INTO profiles (user_id, display_name, username, bio, location, website_url, avatar_url, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          display_name = excluded.display_name,
          username = excluded.username,
          bio = excluded.bio,
          location = excluded.location,
          website_url = excluded.website_url,
          avatar_url = excluded.avatar_url,
          updated_at = excluded.updated_at
      `)
      .bind(
        user.id,
        payload.display_name,
        payload.username,
        payload.bio,
        payload.location,
        payload.website_url,
        payload.avatar_url,
        payload.updated_at
      )
      .run();
  } catch (err: any) {
    if (err.message && err.message.includes('UNIQUE')) {
      redirect('/profile?error=' + encodeURIComponent('That username is already taken.'));
    }
    throw err;
  }

  revalidatePath('/profile');
  redirect('/profile?saved=1');
}

export async function updateProfileQuizAnswers(answers: any): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/user/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) return { success: true };
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Failed to update quiz answers' };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }

  try {
    const { authenticated, user } = await getCurrentUser();

    if (!authenticated || !user) {
      return { success: false, error: 'Unauthorized.' };
    }

    const db = getDb();
    const nowIso = new Date().toISOString();
    const jsonStr = JSON.stringify(answers);

    await db
      .prepare(`
        INSERT INTO profiles (user_id, quiz_answers, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          quiz_answers = excluded.quiz_answers,
          updated_at = excluded.updated_at
      `)
      .bind(user.id, jsonStr, nowIso)
      .run();

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
