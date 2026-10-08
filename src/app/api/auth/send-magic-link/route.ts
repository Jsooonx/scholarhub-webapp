import { NextResponse, type NextRequest } from 'next/server';
import { sendMagicLink } from '@/lib/auth';
import { safeInternalPath } from '@/lib/security';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    let email = '';
    let nextPath = '/shortlist';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => ({}));
      email = String(body?.email ?? '').trim().toLowerCase();
      nextPath = String(body?.next ?? '/shortlist');
    } else {
      const formData = await request.formData();
      email = String(formData.get('email') ?? '').trim().toLowerCase();
      nextPath = String(formData.get('next') ?? '/shortlist');
    }

    const safeNext = safeInternalPath(nextPath);

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const result = await sendMagicLink(email, safeNext);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Magic link could not be sent.' }, { status: 500 });
    }

    // In development mode, provide the direct callback link so the user can test login immediately
    let devMagicLink: string | undefined;
    if (process.env.NODE_ENV !== 'production') {
      try {
        const db = getDb();
        const row = await db
          .prepare('SELECT token FROM magic_links WHERE email = ? ORDER BY created_at DESC LIMIT 1')
          .bind(email)
          .first<{ token: string }>();
        if (row?.token) {
          const origin = request.nextUrl.origin || 'http://localhost:3000';
          devMagicLink = `${origin}/auth/callback?token=${row.token}&next=${encodeURIComponent(safeNext)}`;
        }
      } catch {}
    }

    return NextResponse.json({
      success: true,
      email,
      devMagicLink,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
