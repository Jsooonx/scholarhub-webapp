import { safeInternalPath } from './lib/security';

interface Env {
  ASSETS: {
    fetch: (request: Request | string, init?: RequestInit) => Promise<Response>;
  };
  DB: any;
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
  RESEND_FROM_EMAIL?: string;
  NOTIFY_SECRET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  [key: string]: any;
}

const SESSION_COOKIE_NAME = 'scholarhub_session';

function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(/scholarhub_session=([^;]+)/);
  return match ? match[1].trim() : null;
}

async function getAuthUser(request: Request, env: Env): Promise<{ id: string; email: string } | null> {
  const token = getSessionToken(request);
  if (!token || !env.DB) return null;
  const nowIso = new Date().toISOString();
  try {
    const row = await env.DB
      .prepare(`
        SELECT u.id, u.email 
        FROM sessions s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.id = ? AND s.expires_at > ?
        LIMIT 1
      `)
      .bind(token, nowIso)
      .first();
    return row ? { id: row.id, email: row.email } : null;
  } catch (err) {
    console.error('Error in getAuthUser:', err);
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Attach DB and env globally
    (globalThis as any).DB = env.DB;
    (globalThis as any).env = env;

    // ── API & AUTH ROUTES ──

    // 1. /api/auth/send-magic-link & POST /login - Send Magic Link
    if (
      (pathname === '/api/auth/send-magic-link' && request.method === 'POST') ||
      (pathname === '/login' && request.method === 'POST')
    ) {
      try {
        let email = '';
        let nextPath = '/shortlist';
        const contentType = request.headers.get('Content-Type') || '';
        const isJson = contentType.includes('application/json');

        if (isJson) {
          const body: any = await request.json();
          email = String(body?.email ?? '').trim().toLowerCase();
          nextPath = String(body?.next ?? '/shortlist');
        } else {
          const formData = await request.formData();
          email = String(formData.get('email') ?? '').trim().toLowerCase();
          nextPath = String(formData.get('next') ?? '/shortlist');
        }

        const safeNext = safeInternalPath(nextPath);

        if (!email || !email.includes('@')) {
          if (isJson) {
            return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
          }
          return Response.redirect(new URL(`/login?next=${encodeURIComponent(safeNext)}&error=email`, url.origin), 302);
        }

        if (!env.DB) {
          if (isJson) {
            return Response.json({ error: 'Database not available.' }, { status: 500 });
          }
          return Response.redirect(new URL(`/login?next=${encodeURIComponent(safeNext)}&error=otp`, url.origin), 302);
        }

        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        await env.DB
          .prepare('INSERT INTO magic_links (token, email, next_path, expires_at) VALUES (?, ?, ?, ?)')
          .bind(token, email, safeNext, expiresAt)
          .run();

        const baseUrl = env.NEXT_PUBLIC_SITE_URL || url.origin;
        const magicLinkUrl = `${baseUrl.replace(/\/$/, '')}/auth/callback?token=${token}&next=${encodeURIComponent(safeNext)}`;

        const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
        const fromEmail = env.RESEND_FROM_EMAIL || 'ScholarHub <auth@scholarhubs.my.id>';

        if (!apiKey) {
          console.error('RESEND_API_KEY is not configured in Cloudflare environment');
          if (isJson) {
            return Response.json(
              {
                success: false,
                error: 'Email service is not configured (RESEND_API_KEY missing in Cloudflare secrets).',
              },
              { status: 500 }
            );
          }
          return Response.redirect(new URL(`/login?next=${encodeURIComponent(safeNext)}&error=otp`, url.origin), 302);
        }

        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; color: #1e293b; background: #faf9f6; border-radius: 24px; border: 1px solid #e2e8f0;">
            <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #0f172a;">Sign in to ScholarHub</h1>
            <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">Click the button below to sign in to your ScholarHub account and access your shortlisted scholarships.</p>
            <a href="${magicLinkUrl}" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 14px; font-weight: 600; text-align: center;">Sign In to ScholarHub</a>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">This link will expire in 15 minutes. If you did not request this link, you can safely ignore this email.</p>
          </div>
        `;

        let resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: 'Sign in to ScholarHub',
            html: emailHtml,
          }),
        });

        let resendData: any = await resendRes.json().catch(() => ({}));

        // If custom domain is not verified in Resend, retry with onboarding@resend.dev
        if (!resendRes.ok && fromEmail !== 'ScholarHub <onboarding@resend.dev>') {
          console.warn('From email failed, retrying with onboarding@resend.dev:', resendData);
          resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'ScholarHub <onboarding@resend.dev>',
              to: [email],
              subject: 'Sign in to ScholarHub',
              html: emailHtml,
            }),
          });
          resendData = await resendRes.json().catch(() => ({}));
        }

        if (!resendRes.ok) {
          const errMsg = resendData?.message || resendData?.error || 'Failed to send email via Resend.';
          console.error('Resend delivery error:', resendData);
          if (isJson) {
            return Response.json({ success: false, error: `Email delivery error: ${errMsg}` }, { status: 500 });
          }
          return Response.redirect(new URL(`/login?next=${encodeURIComponent(safeNext)}&error=otp`, url.origin), 302);
        }

        if (isJson) {
          return Response.json({ success: true, email });
        }
        return Response.redirect(
          new URL(`/login?next=${encodeURIComponent(safeNext)}&sent=1&email=${encodeURIComponent(email)}`, url.origin),
          302
        );
      } catch (err: any) {
        console.error('Magic link send error:', err);
        return Response.json({ error: err.message || 'Error processing request' }, { status: 500 });
      }
    }

    // 2. /auth/callback - Magic Link validation & session creation
    if (pathname === '/auth/callback') {
      const token = url.searchParams.get('token');
      const next = safeInternalPath(url.searchParams.get('next'));

      if (!token || !env.DB) {
        return Response.redirect(new URL('/login?error=callback', url.origin), 302);
      }

      try {
        const nowIso = new Date().toISOString();
        const magicLink = await env.DB
          .prepare('SELECT token, email, next_path, expires_at FROM magic_links WHERE token = ? AND expires_at > ?')
          .bind(token, nowIso)
          .first();

        if (!magicLink) {
          return Response.redirect(new URL('/login?error=callback', url.origin), 302);
        }

        // Find or create user
        let user = await env.DB
          .prepare('SELECT id, email FROM users WHERE email = ?')
          .bind(magicLink.email)
          .first();

        let userId = user?.id;
        if (!userId) {
          userId = crypto.randomUUID();
          await env.DB
            .prepare('INSERT INTO users (id, email) VALUES (?, ?)')
            .bind(userId, magicLink.email)
            .run();

          await env.DB
            .prepare('INSERT INTO profiles (user_id, display_name) VALUES (?, ?)')
            .bind(userId, magicLink.email.split('@')[0])
            .run();
        }

        // Create session
        const sessionToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await env.DB
          .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
          .bind(sessionToken, userId, expiresAt)
          .run();

        // Delete used magic link
        await env.DB.prepare('DELETE FROM magic_links WHERE token = ?').bind(token).run();

        const destPath = safeInternalPath(magicLink.next_path, next);
        const redirectUrl = new URL(destPath, url.origin);

        const isSecure = url.protocol === 'https:';
        const cookieHeader = `${SESSION_COOKIE_NAME}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isSecure ? '; Secure' : ''}`;

        return new Response(null, {
          status: 302,
          headers: {
            Location: redirectUrl.toString(),
            'Set-Cookie': cookieHeader,
          },
        });
      } catch (err) {
        console.error('Callback error:', err);
        return Response.redirect(new URL('/login?error=callback', url.origin), 302);
      }
    }

    // 3. /api/auth/signout - Session sign out
    if (pathname === '/api/auth/signout' && request.method === 'POST') {
      const token = getSessionToken(request);
      if (token && env.DB) {
        try {
          await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run();
        } catch (e) {
          console.error('Signout error:', e);
        }
      }
      const isSecure = url.protocol === 'https:';
      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isSecure ? '; Secure' : ''}`,
        },
      });
    }

    // 4. /api/user/session or /api/auth/me - Check current user session
    if ((pathname === '/api/user/session' || pathname === '/api/auth/me') && request.method === 'GET') {
      const authUser = await getAuthUser(request, env);
      if (!authUser) {
        return Response.json({ authenticated: false, user: null });
      }
      return Response.json({ authenticated: true, user: authUser, email: authUser.email });
    }

    // 5. /api/shortlist - Get, Add, Remove, and Update Shortlist Applications
    if (pathname === '/api/shortlist') {
      const user = await getAuthUser(request, env);

      if (request.method === 'GET') {
        if (!user) {
          return Response.json({ authenticated: false, slugs: [], applications: [] });
        }
        try {
          const res = await env.DB
            .prepare('SELECT * FROM scholarship_applications WHERE user_id = ? ORDER BY updated_at DESC')
            .bind(user.id)
            .all();
          const rows = res.results || [];
          return Response.json({
            authenticated: true,
            slugs: rows.map((r: any) => r.scholarship_slug),
            applications: rows,
            email: user.email,
          });
        } catch (err: any) {
          return Response.json({ error: err.message || 'Database error' }, { status: 500 });
        }
      }

      if (request.method === 'POST') {
        if (!user) {
          return Response.json({ ok: false, status: 401, error: 'Unauthorized' }, { status: 401 });
        }
        try {
          const body: any = await request.json();
          const slug = String(body?.slug ?? '').trim();
          if (!slug) return Response.json({ ok: false, error: 'Slug required' }, { status: 400 });

          const id = crypto.randomUUID();
          const nowIso = new Date().toISOString();
          await env.DB
            .prepare(`
              INSERT INTO scholarship_applications (id, user_id, scholarship_slug, status, created_at, updated_at)
              VALUES (?, ?, ?, 'shortlisted', ?, ?)
              ON CONFLICT(user_id, scholarship_slug) DO UPDATE SET
                status = 'shortlisted',
                updated_at = excluded.updated_at
            `)
            .bind(id, user.id, slug, nowIso, nowIso)
            .run();
          return Response.json({ ok: true });
        } catch (err: any) {
          return Response.json({ ok: false, error: err.message || 'Error saving' }, { status: 500 });
        }
      }

      if (request.method === 'DELETE') {
        if (!user) {
          return Response.json({ ok: false, status: 401, error: 'Unauthorized' }, { status: 401 });
        }
        try {
          let slug = url.searchParams.get('slug');
          if (!slug) {
            const body: any = await request.json().catch(() => ({}));
            slug = body?.slug;
          }
          if (!slug) return Response.json({ ok: false, error: 'Slug required' }, { status: 400 });

          await env.DB
            .prepare('DELETE FROM scholarship_applications WHERE user_id = ? AND scholarship_slug = ?')
            .bind(user.id, slug)
            .run();
          return Response.json({ ok: true });
        } catch (err: any) {
          return Response.json({ ok: false, error: err.message || 'Error removing' }, { status: 500 });
        }
      }

      if (request.method === 'PATCH') {
        if (!user) {
          return Response.json({ ok: false, status: 401, error: 'Unauthorized' }, { status: 401 });
        }
        try {
          const body: any = await request.json();
          const { action, slug, status, notes, checklist, target_deadline, announcement_date, is_verified } = body;
          const nowIso = new Date().toISOString();

          if (action === 'status') {
            await env.DB
              .prepare('UPDATE scholarship_applications SET status = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
              .bind(status, nowIso, user.id, slug)
              .run();
          } else if (action === 'notes') {
            await env.DB
              .prepare('UPDATE scholarship_applications SET notes = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
              .bind(notes || null, nowIso, user.id, slug)
              .run();
          } else if (action === 'checklist') {
            const jsonStr = JSON.stringify(checklist || []);
            await env.DB
              .prepare('UPDATE scholarship_applications SET checklist = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
              .bind(jsonStr, nowIso, user.id, slug)
              .run();
          } else if (action === 'deadline') {
            await env.DB
              .prepare('UPDATE scholarship_applications SET target_deadline = ?, is_deadline_verified = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
              .bind(target_deadline || null, is_verified ? 1 : 0, nowIso, user.id, slug)
              .run();
          } else if (action === 'announcement') {
            await env.DB
              .prepare('UPDATE scholarship_applications SET announcement_date = ?, is_announcement_verified = ?, updated_at = ? WHERE user_id = ? AND scholarship_slug = ?')
              .bind(announcement_date || null, is_verified ? 1 : 0, nowIso, user.id, slug)
              .run();
          }

          return Response.json({ ok: true });
        } catch (err: any) {
          return Response.json({ ok: false, error: err.message || 'Error updating' }, { status: 500 });
        }
      }
    }

    // 6. /api/user/profile - Get and Update User Profile
    if (pathname === '/api/user/profile') {
      const user = await getAuthUser(request, env);
      if (!user) {
        return Response.json({ authenticated: false, profile: null });
      }

      if (request.method === 'GET') {
        try {
          const profile = await env.DB
            .prepare('SELECT * FROM profiles WHERE user_id = ? LIMIT 1')
            .bind(user.id)
            .first();
          return Response.json({ authenticated: true, email: user.email, profile });
        } catch (err: any) {
          return Response.json({ error: err.message }, { status: 500 });
        }
      }

      if (request.method === 'POST') {
        try {
          const body: any = await request.json();
          const { display_name, username, bio, location, website_url, avatar_url } = body;
          const nowIso = new Date().toISOString();

          await env.DB
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
            .bind(user.id, display_name, username, bio, location, website_url, avatar_url, nowIso)
            .run();
          return Response.json({ ok: true });
        } catch (err: any) {
          return Response.json({ ok: false, error: err.message }, { status: 500 });
        }
      }
    }

    // 7. /api/user/quiz - Update Quiz Answers
    if (pathname === '/api/user/quiz' && request.method === 'POST') {
      const user = await getAuthUser(request, env);
      if (!user) {
        return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      try {
        const body: any = await request.json();
        const jsonStr = JSON.stringify(body?.answers ?? {});
        const nowIso = new Date().toISOString();

        await env.DB
          .prepare(`
            INSERT INTO profiles (user_id, quiz_answers, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
              quiz_answers = excluded.quiz_answers,
              updated_at = excluded.updated_at
          `)
          .bind(user.id, jsonStr, nowIso)
          .run();
        return Response.json({ success: true });
      } catch (err: any) {
        return Response.json({ success: false, error: err.message }, { status: 500 });
      }
    }

    // 8. /api/subscribe - Newsletter subscription via Resend
    if (pathname === '/api/subscribe' && request.method === 'POST') {
      try {
        const body: any = await request.json();
        const email = String(body?.email ?? '').trim().toLowerCase();

        if (!email || !email.includes('@')) {
          return Response.json({ error: 'Invalid email address.' }, { status: 400 });
        }

        const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
        const audienceId = env.RESEND_AUDIENCE_ID || process.env.RESEND_AUDIENCE_ID;

        if (!apiKey || !audienceId) {
          return Response.json({ error: 'Resend API not configured.' }, { status: 500 });
        }

        const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        });

        const data: any = await res.json();
        if (!res.ok) {
          if (data?.name === 'validation_error' && data?.message?.includes('already exists')) {
            return Response.json({ success: true, message: 'Already subscribed.' });
          }
          return Response.json({ error: 'Failed to subscribe.' }, { status: 500 });
        }

        return Response.json({ success: true });
      } catch (err: any) {
        return Response.json({ error: err.message || 'Error subscribing' }, { status: 500 });
      }
    }

    // ── STATIC ASSETS & HTML PAGES ──

    try {
      // 1. Direct fetch from ASSETS (handles static assets: _next, images, css, js)
      let res = await env.ASSETS.fetch(request);
      if (res.status !== 404) {
        return res;
      }

      // 2. Try HTML extensions for clean paths (e.g. /about -> /about.html or /about/index.html)
      const cleanPath = pathname.replace(/\/$/, '');
      if (cleanPath) {
        const htmlUrl = new URL(`${cleanPath}.html`, url.origin);
        res = await env.ASSETS.fetch(new Request(htmlUrl, { method: 'GET' }));
        if (res.status === 200) {
          const headers = new Headers(res.headers);
          headers.set('Content-Type', 'text/html; charset=utf-8');
          return new Response(res.body, { status: 200, headers });
        }

        const indexUrl = new URL(`${cleanPath}/index.html`, url.origin);
        res = await env.ASSETS.fetch(new Request(indexUrl, { method: 'GET' }));
        if (res.status === 200) {
          const headers = new Headers(res.headers);
          headers.set('Content-Type', 'text/html; charset=utf-8');
          return new Response(res.body, { status: 200, headers });
        }
      }

      // 3. Fallback to 404.html
      const notFoundUrl = new URL('/404.html', url.origin);
      const notFoundRes = await env.ASSETS.fetch(new Request(notFoundUrl, { method: 'GET' }));
      if (notFoundRes.status === 200) {
        const headers = new Headers(notFoundRes.headers);
        headers.set('Content-Type', 'text/html; charset=utf-8');
        return new Response(notFoundRes.body, { status: 404, headers });
      }
    } catch (e) {
      console.error('Worker routing error:', e);
    }

    return new Response('ScholarHub - Page Not Found', { status: 404 });
  },
};
