import { getScholarshipBySlug, type Scholarship } from '@/lib/scholarships';

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
  target_deadline: string | null;
  is_deadline_verified: boolean;
  announcement_date: string | null;
  is_announcement_verified: boolean;
  created_at: string;
  updated_at: string;
  scholarship: Scholarship | null;
}

import type { Profile } from '@/app/actions/profile';

export interface ShortlistApiResult {
  authenticated: boolean;
  slugs: string[];
  applications: ScholarshipApplication[];
  email?: string;
  error?: string;
}

export interface ProfileApiResult {
  authenticated: boolean;
  email?: string;
  profile: Profile | null;
  error?: string;
}

export async function fetchSession(): Promise<{
  authenticated: boolean;
  user: { id: string; email: string } | null;
  email?: string;
}> {
  try {
    const res = await fetch('/api/user/session', {
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Fetch session error:', err);
  }
  return { authenticated: false, user: null };
}

export async function fetchShortlist(): Promise<ShortlistApiResult> {
  try {
    const res = await fetch('/api/shortlist', {
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const rows = data.applications || [];
      const applications: ScholarshipApplication[] = rows.map((row: any) => {
        let parsedChecklist: ChecklistItem[] | null = null;
        if (typeof row.checklist === 'string') {
          try {
            parsedChecklist = JSON.parse(row.checklist);
          } catch {
            parsedChecklist = null;
          }
        } else if (Array.isArray(row.checklist)) {
          parsedChecklist = row.checklist;
        }

        return {
          id: row.id,
          user_id: row.user_id,
          scholarship_slug: row.scholarship_slug,
          status: row.status,
          notes: row.notes,
          checklist: parsedChecklist,
          target_deadline: row.target_deadline,
          is_deadline_verified: Boolean(row.is_deadline_verified),
          announcement_date: row.announcement_date,
          is_announcement_verified: Boolean(row.is_announcement_verified),
          created_at: row.created_at,
          updated_at: row.updated_at,
          scholarship: getScholarshipBySlug(row.scholarship_slug) || null,
        };
      });

      return {
        authenticated: Boolean(data.authenticated),
        slugs: data.slugs || [],
        applications,
        email: data.email,
      };
    }
  } catch (err) {
    console.error('Fetch shortlist error:', err);
  }
  return { authenticated: false, slugs: [], applications: [] };
}

export async function addShortlistApi(slug: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch('/api/shortlist', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, status: res.status, error: data.error || 'Failed to save scholarship' };
  } catch (err) {
    return { ok: false, status: 500, error: 'Network error' };
  }
}

export async function removeShortlistApi(slug: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch('/api/shortlist', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, status: res.status, error: data.error || 'Failed to remove' };
  } catch (err) {
    return { ok: false, status: 500, error: 'Network error' };
  }
}

export async function patchShortlistApi(payload: any): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch('/api/shortlist', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, status: res.status, error: data.error || 'Failed to update' };
  } catch (err) {
    return { ok: false, status: 500, error: 'Network error' };
  }
}

export async function updateApplicationStatusApi(
  slug: string,
  status: ScholarshipApplication['status']
): Promise<{ ok: boolean; status?: number; error?: string }> {
  return patchShortlistApi({ action: 'status', slug, status });
}

export async function updateApplicationNotesApi(
  slug: string,
  notes: string | null
): Promise<{ ok: boolean; status?: number; error?: string }> {
  return patchShortlistApi({ action: 'notes', slug, notes });
}

export async function updateApplicationChecklistApi(
  slug: string,
  checklist: ChecklistItem[]
): Promise<{ ok: boolean; status?: number; error?: string }> {
  return patchShortlistApi({ action: 'checklist', slug, checklist });
}

export async function updateApplicationDeadlineApi(
  slug: string,
  targetDeadline: string | null,
  isVerified: boolean
): Promise<{ ok: boolean; status?: number; error?: string }> {
  return patchShortlistApi({ action: 'deadline', slug, target_deadline: targetDeadline, is_verified: isVerified });
}

export async function updateApplicationAnnouncementApi(
  slug: string,
  announcementDate: string | null,
  isVerified: boolean
): Promise<{ ok: boolean; status?: number; error?: string }> {
  return patchShortlistApi({ action: 'announcement', slug, announcement_date: announcementDate, is_verified: isVerified });
}

export async function fetchProfile(): Promise<ProfileApiResult> {
  try {
    const res = await fetch('/api/user/profile', {
      credentials: 'include',
      cache: 'no-store',
    });
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
        profile: data.profile ? { ...data.profile, quiz_answers: parsedQuizAnswers } : null,
      };
    }
  } catch (err) {
    console.error('Fetch profile error:', err);
  }
  return { authenticated: false, profile: null };
}

export async function saveProfileQuizApi(answers: any): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/user/quiz', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

export async function signOutApi(): Promise<{ ok: boolean }> {
  try {
    const res = await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
