import { NextResponse } from 'next/server';
import { verifyMagicLink } from '@/lib/auth';
import { safeInternalPath } from '@/lib/security';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token');
  const next = safeInternalPath(requestUrl.searchParams.get('next'));

  if (token) {
    const result = await verifyMagicLink(token);

    if (result.success) {
      const destination = safeInternalPath(result.nextPath, next);
      const response = NextResponse.redirect(new URL(destination, requestUrl.origin));
      if (result.sessionToken) {
        response.cookies.set({
          name: 'scholarhub_session',
          value: result.sessionToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        });
      }
      return response;
    }
  }

  return NextResponse.redirect(
    new URL(`/login?next=${encodeURIComponent(next)}&error=callback`, requestUrl.origin)
  );
}
