import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const result = await getCurrentUser();
  if (!result.authenticated || !result.user) {
    return NextResponse.json({ authenticated: false, user: null });
  }
  return NextResponse.json({
    authenticated: true,
    user: result.user,
    email: result.email || result.user.email,
  });
}
