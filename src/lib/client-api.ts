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
import type { QuizAnswers } from '@/lib/matching';

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

const SHORTLIST_CACHE_KEY = 'scholarhub_shortlist_cache';
const PROFILE_CACHE_KEY = 'scholarhub_profile_cache';

let memoryShortlistCache: ShortlistApiResult | null = null;
let memoryProfileCache: ProfileApiResult | null = null;

export function getCachedShortlist(): ShortlistApiResult | null {
  if (memoryShortlistCache) return memoryShortlistCache;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(SHORTLIST_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.applications)) {
          parsed.applications.forEach((app: ScholarshipApplication) => {
            if (!app.scholarship && app.scholarship_slug) {
              app.scholarship = getScholarshipBySlug(app.scholarship_slug) || null;
            }
          });
        }
        memoryShortlistCache = parsed;
        return parsed;
      }
    } catch {}
  }
  return null;
}

export function setCachedShortlist(data: ShortlistApiResult): void {
  memoryShortlistCache = data;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SHORTLIST_CACHE_KEY, JSON.stringify(data));
    } catch {}
  }
}

export function getCachedProfile(): ProfileApiResult | null {
  if (memoryProfileCache) return memoryProfileCache;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(PROFILE_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        memoryProfileCache = parsed;
        return parsed;
      }
    } catch {}
  }
  return null;
}

export function setCachedProfile(data: ProfileApiResult): void {
  memoryProfileCache = data;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('scholarhub_profile_updated', { detail: data }));
    } catch {}
  }
}

export function clearClientCache(): void {
  memoryShortlistCache = null;
  memoryProfileCache = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(SHORTLIST_CACHE_KEY);
      localStorage.removeItem(PROFILE_CACHE_KEY);
      window.dispatchEvent(new CustomEvent('scholarhub_profile_updated', { detail: null }));
    } catch {}
  }
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
      const applications: ScholarshipApplication[] = rows.map((row: Record<string, unknown>) => {
        let parsedChecklist: ChecklistItem[] | null = null;
        if (typeof row.checklist === 'string') {
          try {
            parsedChecklist = JSON.parse(row.checklist);
          } catch {
            parsedChecklist = null;
          }
        } else if (Array.isArray(row.checklist)) {
          parsedChecklist = row.checklist as ChecklistItem[];
        }

        const validStatuses = ['shortlisted', 'preparing', 'applied', 'interviewing', 'accepted', 'rejected'];
        const appStatus = typeof row.status === 'string' && validStatuses.includes(row.status) ? row.status : 'shortlisted';

        return {
          id: String(row.id || ''),
          user_id: String(row.user_id || ''),
          scholarship_slug: String(row.scholarship_slug || ''),
          status: appStatus as ScholarshipApplication['status'],
          notes: (row.notes as string | null) ?? null,
          checklist: parsedChecklist,
          target_deadline: (row.target_deadline as string | null) ?? null,
          is_deadline_verified: Boolean(row.is_deadline_verified),
          announcement_date: (row.announcement_date as string | null) ?? null,
          is_announcement_verified: Boolean(row.is_announcement_verified),
          created_at: String(row.created_at || ''),
          updated_at: String(row.updated_at || ''),
          scholarship: getScholarshipBySlug(String(row.scholarship_slug || '')) || null,
        };
      });

      const result: ShortlistApiResult = {
        authenticated: Boolean(data.authenticated),
        slugs: data.slugs || [],
        applications,
        email: data.email,
      };

      setCachedShortlist(result);
      return result;
    }
  } catch (err) {
    console.error('Fetch shortlist error:', err);
  }

  const cached = getCachedShortlist();
  if (cached) return cached;
  return { authenticated: false, slugs: [], applications: [] };
}

export async function addShortlistApi(slug: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  // Optimistically update cache
  const cached = getCachedShortlist();
  if (cached && !cached.slugs.includes(slug)) {
    cached.slugs = [...cached.slugs, slug];
    setCachedShortlist(cached);
  }

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
  // Optimistically update cache
  const cached = getCachedShortlist();
  if (cached) {
    cached.slugs = cached.slugs.filter((s) => s !== slug);
    cached.applications = cached.applications.filter((a) => a.scholarship_slug !== slug);
    setCachedShortlist(cached);
  }

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

export async function patchShortlistApi(payload: Record<string, unknown>): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const res = await fetch('/api/shortlist', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      // Optimistically sync cached application if applicable
      const cached = getCachedShortlist();
      if (cached && payload.slug) {
        const app = cached.applications.find((a) => a.scholarship_slug === payload.slug);
        if (app) {
          if (payload.action === 'status' && payload.status) app.status = payload.status as ScholarshipApplication['status'];
          if (payload.action === 'notes') app.notes = (payload.notes as string | null) ?? null;
          if (payload.action === 'checklist') app.checklist = payload.checklist as ChecklistItem[];
          if (payload.action === 'deadline') {
            app.target_deadline = (payload.target_deadline as string | null) ?? null;
            app.is_deadline_verified = Boolean(payload.is_verified);
          }
          if (payload.action === 'announcement') {
            app.announcement_date = (payload.announcement_date as string | null) ?? null;
            app.is_announcement_verified = Boolean(payload.is_verified);
          }
          setCachedShortlist(cached);
        }
      }
      return { ok: true };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: false, status: res.status, error: data.error || 'Failed to update' };
  } catch {
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

      const result: ProfileApiResult = {
        authenticated: Boolean(data.authenticated),
        email: data.email,
        profile: data.profile ? { ...data.profile, quiz_answers: parsedQuizAnswers } : null,
      };

      setCachedProfile(result);
      return result;
    }
  } catch (err) {
    console.error('Fetch profile error:', err);
  }

  const cached = getCachedProfile();
  if (cached) return cached;
  return { authenticated: false, profile: null };
}

export async function saveProfileQuizApi(answers: QuizAnswers | Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/user/quiz', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      // Optimistically update cached profile quiz answers
      const cached = getCachedProfile() || { authenticated: true, profile: null };
      if (cached.profile) {
        cached.profile.quiz_answers = answers;
      } else {
        cached.profile = {
          user_id: '',
          display_name: null,
          username: null,
          bio: null,
          location: null,
          website_url: null,
          avatar_url: null,
          quiz_answers: answers,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      cached.authenticated = true;
      setCachedProfile(cached);
    }
    return data;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function signOutApi(): Promise<{ ok: boolean }> {
  clearClientCache();
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
