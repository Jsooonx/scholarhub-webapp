import { NextResponse } from 'next/server';
import { verifyMagicLink } from '@/lib/auth';

function safeNext(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/shortlist';
  return value;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token');
  const next = safeNext(requestUrl.searchParams.get('next'));

  if (token) {
    const result = await verifyMagicLink(token);

    if (result.success) {
      const destination = result.nextPath || next;
      return NextResponse.redirect(new URL(destination, requestUrl.origin));
    }
  }

  return NextResponse.redirect(
    new URL(`/login?next=${encodeURIComponent(next)}&error=callback`, requestUrl.origin)
  );
}
