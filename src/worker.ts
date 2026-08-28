interface Env {
  ASSETS: {
    fetch: (request: Request | string, init?: RequestInit) => Promise<Response>;
  };
  DB: any;
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
  NOTIFY_SECRET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  [key: string]: any;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Attach DB and env globally for Server Actions and helper libraries
    (globalThis as any).DB = env.DB;
    (globalThis as any).env = env;

    // ── API ROUTES ──

    // 1. /auth/callback - Magic Link validation & session creation
    if (pathname === '/auth/callback') {
      const token = url.searchParams.get('token');
      const next = url.searchParams.get('next') || '/shortlist';

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

        const destPath = magicLink.next_path || next;
        const redirectUrl = new URL(destPath, url.origin);

        const isSecure = url.protocol === 'https:';
        const cookieHeader = `scholarhub_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isSecure ? '; Secure' : ''}`;

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

    // 2. /api/subscribe - Newsletter subscription via Resend
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
        res = await env.ASSETS.fetch(new Request(htmlUrl, request));
        if (res.status === 200) {
          const headers = new Headers(res.headers);
          headers.set('Content-Type', 'text/html; charset=utf-8');
          return new Response(res.body, { status: 200, headers });
        }

        const indexUrl = new URL(`${cleanPath}/index.html`, url.origin);
        res = await env.ASSETS.fetch(new Request(indexUrl, request));
        if (res.status === 200) {
          const headers = new Headers(res.headers);
          headers.set('Content-Type', 'text/html; charset=utf-8');
          return new Response(res.body, { status: 200, headers });
        }
      }

      // 3. Fallback to 404.html
      const notFoundUrl = new URL('/404.html', url.origin);
      const notFoundRes = await env.ASSETS.fetch(new Request(notFoundUrl, request));
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
