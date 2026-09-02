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

        if (apiKey) {
          try {
            const emailHtml = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; color: #1e293b; background: #faf9f6; border-radius: 24px; border: 1px solid #e2e8f0;">
                <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #0f172a;">Sign in to ScholarHub</h1>
                <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">Click the button below to sign in to your ScholarHub account and access your shortlisted scholarships.</p>
                <a href="${magicLinkUrl}" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 14px; font-weight: 600; text-align: center;">Sign In to ScholarHub</a>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">This link will expire in 15 minutes. If you did not request this link, you can safely ignore this email.</p>
              </div>
            `;

            await fetch('https://api.resend.com/emails', {
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
          } catch (emailErr) {
            console.warn('Could not send email via Resend:', emailErr);
          }
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

    // 5. /api/subscribe - Newsletter subscription via Resend
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
