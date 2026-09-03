'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
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
  target_deadline: string | null;
  is_deadline_verified: boolean;
  announcement_date: string | null;
  is_announcement_verified: boolean;
  created_at: string;
  updated_at: string;
  scholarship: Scholarship | null;
}

export async function getShortlistSlugs(): Promise<{
  authenticated: boolean;
  slugs: string[];
  email?: string;
  error?: string;
}> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/shortlist', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        return {
          authenticated: Boolean(data.authenticated),
          slugs: data.slugs || [],
          email: data.email,
        };
      }
    } catch (err) {
      console.error('Fetch shortlist slugs error:', err);
    }
  }

  try {
    const { authenticated, user, email } = await getCurrentUser();

    if (!authenticated || !user) {
      return { authenticated: false, slugs: [] };
    }

    const db = getDb();
    const rows = await db
      .prepare('SELECT scholarship_slug FROM scholarship_applications WHERE user_id = ? ORDER BY created_at DESC')
      .bind(user.id)
      .all<{ scholarship_slug: string }>();

    return {
      authenticated: true,
      slugs: (rows.results || []).map((r) => r.scholarship_slug),
      email,
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

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) return { ok: true };
      const data = await res.json().catch(() => ({}));
      return { ok: false, status: res.status as any, error: data.error || 'Failed to add' };
    } catch (err) {
      return { ok: false, status: 500, error: 'Network error' };
    }
  }

  try {
    const { authenticated, user } = await getCurrentUser();

    if (!authenticated || !user) {
      return { ok: false, status: 401, error: 'Sign in to save scholarships.' };
    }

    const db = getDb();
    const id = crypto.randomUUID();
    const nowIso = new Date().toISOString();

    await db
      .prepare(`
        INSERT INTO scholarship_applications (id, user_id, scholarship_slug, status, created_at, updated_at)
        VALUES (?, ?, ?, 'shortlisted', ?, ?)
        ON CONFLICT(user_id, scholarship_slug) DO UPDATE SET
          status = 'shortlisted',
          updated_at = excluded.updated_at
      `)
      .bind(id, user.id, slug, nowIso, nowIso)
      .run();

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
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/shortlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) return { ok: true };
      const data = await res.json().catch(() => ({}));
      return { ok: false, status: res.status as any, error: data.error || 'Failed to remove' };
    } catch (err) {
      return { ok: false, status: 500, error: 'Network error' };
    }
  }

  try {
    const { authenticated, user } = await getCurrentUser();

    if (!authenticated || !user) {
      return { ok: false, status: 401, error: 'Sign in to manage your shortlist.' };
    }

    const db = getDb();
    await db
      .prepare('DELETE FROM scholarship_applications WHERE user_id = ? AND scholarship_slug = ?')
      .bind(user.id, slug)
      .run();

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

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/shortlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', slug, status }),
      });
      if (res.ok) return { ok: true };
    } catch (err) {
      console.error('Update status error:', err);
    }
  }

  try {
    const { authenticated, user } = await getCurrentUser();

    if (!authenticated || !user) {
      return { ok: false, status: 401, error: 'Sign in to update application status.' };
    }

    const db = getDb();
    const nowIso = new Date().toISOString();

    await db
      .prepare('UPDATE scholarship_applications SET status = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
      .bind(status, nowIso, user.id, slug)
      .run();

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
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/shortlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'notes', slug, notes }),
      });
      if (res.ok) return { ok: true };
    } catch (err) {
      console.error('Update notes error:', err);
    }
  }

  try {
    const { authenticated, user } = await getCurrentUser();

    if (!authenticated || !user) {
      return { ok: false, status: 401, error: 'Sign in to update notes.' };
    }

    const db = getDb();
    const nowIso = new Date().toISOString();

    await db
      .prepare('UPDATE scholarship_applications SET notes = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
      .bind(notes || null, nowIso, user.id, slug)
      .run();

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
  if (typeof window !== 'undefined') {
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
          applications,
          email: data.email,
        };
      }
    } catch (err) {
      console.error('Fetch applications error:', err);
    }
  }

  try {
    const { authenticated, user, email } = await getCurrentUser();

    if (!authenticated || !user) {
      return { authenticated: false, applications: [] };
    }

    const db = getDb();
    const res = await db
      .prepare('SELECT * FROM scholarship_applications WHERE user_id = ? ORDER BY updated_at DESC')
      .bind(user.id)
      .all<any>();

    const rows = res.results || [];
    const applications: ScholarshipApplication[] = rows.map((row) => {
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
      authenticated: true,
      applications,
      email,
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
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/shortlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checklist', slug, checklist }),
      });
      if (res.ok) return { ok: true };
    } catch (err) {
      console.error('Update checklist error:', err);
    }
  }

  try {
    const { authenticated, user } = await getCurrentUser();

    if (!authenticated || !user) {
      return { ok: false, status: 401, error: 'Sign in to update checklist.' };
    }

    const db = getDb();
    const nowIso = new Date().toISOString();
    const jsonStr = JSON.stringify(checklist);

    await db
      .prepare('UPDATE scholarship_applications SET checklist = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
      .bind(jsonStr, nowIso, user.id, slug)
      .run();

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

export async function updateApplicationDeadline(
  slug: string,
  targetDeadline: string | null,
  isVerified: boolean
): Promise<ShortlistResult> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/shortlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deadline', slug, target_deadline: targetDeadline, is_verified: isVerified }),
      });
      if (res.ok) return { ok: true };
    } catch (err) {
      console.error('Update deadline error:', err);
    }
  }

  try {
    const { authenticated, user } = await getCurrentUser();

    if (!authenticated || !user) {
      return { ok: false, status: 401, error: 'Sign in to update deadline.' };
    }

    const db = getDb();
    const nowIso = new Date().toISOString();

    await db
      .prepare('UPDATE scholarship_applications SET target_deadline = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
      .bind(targetDeadline || null, nowIso, user.id, slug)
      .run();

    revalidatePath('/shortlist');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unable to update deadline.',
    };
  }
}

export async function updateApplicationAnnouncement(
  slug: string,
  announcementDate: string | null,
  isVerified: boolean
): Promise<ShortlistResult> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/shortlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'announcement', slug, announcement_date: announcementDate, is_verified: isVerified }),
      });
      if (res.ok) return { ok: true };
    } catch (err) {
      console.error('Update announcement error:', err);
    }
  }

  try {
    const { authenticated, user } = await getCurrentUser();

    if (!authenticated || !user) {
      return { ok: false, status: 401, error: 'Sign in to update announcement date.' };
    }

    const db = getDb();
    const nowIso = new Date().toISOString();

    await db
      .prepare('UPDATE scholarship_applications SET announcement_date = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
      .bind(announcementDate || null, nowIso, user.id, slug)
      .run();

    revalidatePath('/shortlist');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unable to update announcement date.',
    };
  }
}
