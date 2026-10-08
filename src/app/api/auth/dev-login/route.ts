import { NextResponse, type NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { safeInternalPath } from '@/lib/security';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Dev login not allowed in production' }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const email = (searchParams.get('email') || 'john@test.com').trim().toLowerCase();
  const next = safeInternalPath(searchParams.get('next'), '/shortlist');

  const db = getDb();
  let user = await db
    .prepare('SELECT id, email FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: string; email: string }>();

  if (!user) {
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').bind(id, email).run();
    await db.prepare('INSERT INTO profiles (user_id, display_name) VALUES (?, ?)').bind(id, email.split('@')[0]).run();
    user = { id, email };
  }

  await createSession(user.id);
  return NextResponse.redirect(new URL(next, request.url));
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Dev login not allowed in production' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const email = (body?.email || 'john@test.com').trim().toLowerCase();
  const next = safeInternalPath(body?.next, '/shortlist');

  const db = getDb();
  let user = await db
    .prepare('SELECT id, email FROM users WHERE email = ?')
    .bind(email)
    .first<{ id: string; email: string }>();

  if (!user) {
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO users (id, email) VALUES (?, ?)').bind(id, email).run();
    await db.prepare('INSERT INTO profiles (user_id, display_name) VALUES (?, ?)').bind(id, email.split('@')[0]).run();
    user = { id, email };
  }

  await createSession(user.id);
  return NextResponse.json({ success: true, redirectUrl: next });
}
