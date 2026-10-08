import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const { authenticated, user, email } = await getCurrentUser();
  if (!authenticated || !user) {
    return NextResponse.json({ authenticated: false, profile: null });
  }

  try {
    const db = getDb();
    const profile = await db
      .prepare('SELECT * FROM profiles WHERE user_id = ? LIMIT 1')
      .bind(user.id)
      .first();

    return NextResponse.json({
      authenticated: true,
      email: email || user.email,
      profile: profile || null,
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
    const { display_name, username, bio, location, website_url, avatar_url } = body;
    const nowIso = new Date().toISOString();
    const db = getDb();

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
      .bind(user.id, display_name || null, username || null, bio || null, location || null, website_url || null, avatar_url || null, nowIso)
      .run();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Error updating profile' }, { status: 500 });
  }
}
