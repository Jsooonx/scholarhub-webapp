import { cookies, headers } from 'next/headers';
import { getDb } from '@/lib/db';
import { safeInternalPath } from '@/lib/security';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export const SESSION_COOKIE_NAME = 'scholarhub_session';
const SESSION_EXPIRY_DAYS = 30;
const MAGIC_LINK_EXPIRY_MINUTES = 15;

async function getBaseUrl(): Promise<string> {
  try {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
    if (host) {
      return `${proto}://${host}`;
    }
  } catch {
    // fallback if outside request context
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

/**
 * Retrieves the currently logged-in user from the session cookie and D1 database.
 */
export async function getCurrentUser(): Promise<{
  authenticated: boolean;
  user: User | null;
  email?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return { authenticated: false, user: null };
    }

    const db = getDb();
    const nowIso = new Date().toISOString();

    const result = await db
      .prepare(`
        SELECT u.id, u.email, u.created_at
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ? AND s.expires_at > ?
        LIMIT 1
      `)
      .bind(sessionToken, nowIso)
      .first<{ id: string; email: string; created_at: string }>();

    if (!result) {
      return { authenticated: false, user: null };
    }

    return {
      authenticated: true,
      user: {
        id: result.id,
        email: result.email,
        created_at: result.created_at,
      },
      email: result.email,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return { authenticated: false, user: null };
  }
}

/**
 * Creates a new user session in D1 and attaches the session cookie.
 */
export async function createSession(userId: string): Promise<string> {
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const db = getDb();
  await db
    .prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(sessionToken, userId, expiresAt)
    .run();

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  });

  return sessionToken;
}

/**
 * Destroys the active user session and clears the cookie.
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      const db = getDb();
      await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionToken).run();
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error('Error destroying session:', error);
  }
}

/**
 * Generates a magic link token, records it in D1, and sends an email via Resend.
 */
export async function sendMagicLink(
  email: string,
  nextPath: string = '/shortlist'
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const safeNextPath = safeInternalPath(nextPath);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000).toISOString();

  const db = getDb();
  await db
    .prepare('INSERT INTO magic_links (token, email, next_path, expires_at) VALUES (?, ?, ?, ?)')
    .bind(token, cleanEmail, safeNextPath, expiresAt)
    .run();

  const baseUrl = await getBaseUrl();
  const magicLinkUrl = `${baseUrl}/auth/callback?token=${token}&next=${encodeURIComponent(safeNextPath)}`;

  if (process.env.NODE_ENV !== 'production') {
    console.log('\n🔗 [DEV MAGIC LINK]:', magicLinkUrl, '\n');
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; color: #1e293b; background: #faf9f6; border-radius: 24px; border: 1px solid #e2e8f0;">
          <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #0f172a;">Sign in to ScholarHub</h1>
          <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 24px;">Click the button below to sign in to your ScholarHub account and access your shortlisted scholarships.</p>
          <a href="${magicLinkUrl}" style="display: inline-block; padding: 12px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 9999px; font-size: 14px; font-weight: 600; text-align: center;">Sign In to ScholarHub</a>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">This link will expire in 15 minutes. If you did not request this link, you can safely ignore this email.</p>
        </div>
      `;

      const fromEmail = process.env.RESEND_FROM_EMAIL || 'ScholarHub <onboarding@resend.dev>';

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [cleanEmail],
          subject: 'Sign in to ScholarHub',
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        const errJson = await response.text();
        console.warn('Resend email delivery notice:', errJson);
      }
    } catch (emailErr) {
      console.warn('Could not send email via Resend:', emailErr);
    }
  }

  return { success: true };
}

/**
 * Verifies a magic link token and establishes a new user session.
 */
export async function verifyMagicLink(token: string): Promise<{
  success: boolean;
  nextPath: string;
  sessionToken?: string;
  error?: string;
}> {
  const db = getDb();
  const nowIso = new Date().toISOString();

  const magicLink = await db
    .prepare('SELECT token, email, next_path, expires_at FROM magic_links WHERE token = ? AND expires_at > ?')
    .bind(token, nowIso)
    .first<{ token: string; email: string; next_path: string; expires_at: string }>();

  if (!magicLink) {
    return { success: false, nextPath: '/shortlist', error: 'Invalid or expired magic link.' };
  }

  // 1. Find or create user
  let user = await db
    .prepare('SELECT id, email, created_at FROM users WHERE email = ?')
    .bind(magicLink.email)
    .first<User>();

  if (!user) {
    const newUserId = crypto.randomUUID();
    await db
      .prepare('INSERT INTO users (id, email) VALUES (?, ?)')
      .bind(newUserId, magicLink.email)
      .run();

    await db
      .prepare('INSERT INTO profiles (user_id, display_name) VALUES (?, ?)')
      .bind(newUserId, magicLink.email.split('@')[0])
      .run();

    user = {
      id: newUserId,
      email: magicLink.email,
      created_at: new Date().toISOString(),
    };
  }

  // 2. Create session
  const sessionToken = await createSession(user.id);

  // 3. Delete used magic link
  await db.prepare('DELETE FROM magic_links WHERE token = ?').bind(token).run();

  return {
    success: true,
    nextPath: safeInternalPath(magicLink.next_path),
    sessionToken,
  };
}
