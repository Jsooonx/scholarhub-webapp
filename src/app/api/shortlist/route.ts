import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const { authenticated, user, email } = await getCurrentUser();
  if (!authenticated || !user) {
    return NextResponse.json({ authenticated: false, slugs: [], applications: [] });
  }

  try {
    const db = getDb();
    const res = await db
      .prepare('SELECT * FROM scholarship_applications WHERE user_id = ? ORDER BY updated_at DESC')
      .bind(user.id)
      .all();

    const rows = res.results || [];
    return NextResponse.json({
      authenticated: true,
      slugs: rows.map((r: any) => r.scholarship_slug),
      applications: rows,
      email: email || user.email,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { authenticated, user } = await getCurrentUser();
  if (!authenticated || !user) {
    return NextResponse.json({ ok: false, status: 401, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const slug = String(body?.slug ?? '').trim();
    if (!slug) {
      return NextResponse.json({ ok: false, error: 'Slug required' }, { status: 400 });
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

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Error saving' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { authenticated, user } = await getCurrentUser();
  if (!authenticated || !user) {
    return NextResponse.json({ ok: false, status: 401, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let slug = request.nextUrl.searchParams.get('slug');
    if (!slug) {
      const body = await request.json().catch(() => ({}));
      slug = body?.slug;
    }
    if (!slug) {
      return NextResponse.json({ ok: false, error: 'Slug required' }, { status: 400 });
    }

    const db = getDb();
    await db
      .prepare('DELETE FROM scholarship_applications WHERE user_id = ? AND scholarship_slug = ?')
      .bind(user.id, slug)
      .run();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Error removing' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { authenticated, user } = await getCurrentUser();
  if (!authenticated || !user) {
    return NextResponse.json({ ok: false, status: 401, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { action, slug, status, notes, checklist, target_deadline, announcement_date, is_verified } = body;
    const nowIso = new Date().toISOString();
    const db = getDb();

    if (action === 'status') {
      await db
        .prepare('UPDATE scholarship_applications SET status = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
        .bind(status, nowIso, user.id, slug)
        .run();
    } else if (action === 'notes') {
      await db
        .prepare('UPDATE scholarship_applications SET notes = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
        .bind(notes || null, nowIso, user.id, slug)
        .run();
    } else if (action === 'checklist') {
      const jsonStr = JSON.stringify(checklist || []);
      await db
        .prepare('UPDATE scholarship_applications SET checklist = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
        .bind(jsonStr, nowIso, user.id, slug)
        .run();
    } else if (action === 'deadline') {
      await db
        .prepare('UPDATE scholarship_applications SET target_deadline = ?, is_deadline_verified = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
        .bind(target_deadline || null, is_verified ? 1 : 0, nowIso, user.id, slug)
        .run();
    } else if (action === 'announcement') {
      await db
        .prepare('UPDATE scholarship_applications SET announcement_date = ?, is_announcement_verified = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
        .bind(announcement_date || null, is_verified ? 1 : 0, nowIso, user.id, slug)
        .run();
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Error updating' }, { status: 500 });
  }
}
