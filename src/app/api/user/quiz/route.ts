import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  const { authenticated, user } = await getCurrentUser();
  if (!authenticated || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const jsonStr = JSON.stringify(body?.answers ?? {});
    const nowIso = new Date().toISOString();
    const db = getDb();

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

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Error saving quiz' }, { status: 500 });
  }
}
