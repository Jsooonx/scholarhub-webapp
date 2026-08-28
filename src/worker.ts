interface Env {
  ASSETS: {
    fetch: (request: Request | string, init?: RequestInit) => Promise<Response>;
  };
  DB: any;
  [key: string]: any;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    try {
      // 1. Direct fetch from ASSETS (handles index.html, /images/..., /_next/static/...)
      let res = await env.ASSETS.fetch(request);
      if (res.status !== 404) {
        return res;
      }

      // 2. Try HTML extensions for clean paths (e.g. /about -> /about.html or /about/index.html)
      const pathname = url.pathname.replace(/\/$/, '');
      if (pathname) {
        const htmlUrl = new URL(`${pathname}.html`, url.origin);
        res = await env.ASSETS.fetch(new Request(htmlUrl, request));
        if (res.status === 200) {
          const headers = new Headers(res.headers);
          headers.set('Content-Type', 'text/html; charset=utf-8');
          return new Response(res.body, { status: 200, headers });
        }

        const indexUrl = new URL(`${pathname}/index.html`, url.origin);
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
      console.error('Worker asset routing error:', e);
    }

    return new Response('ScholarHub - Page Not Found', { status: 404 });
  },
};
