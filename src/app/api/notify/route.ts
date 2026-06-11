import { NextRequest, NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scholarhub.jsooonx.my.id';

// ── Email HTML template ───────────────────────────────────────────────────────

function buildEmailHtml({
  subject,
  updates,
  note,
}: {
  subject: string;
  updates: string[];
  note?: string;
}) {
  const updatesHtml = updates
    .map(
      (u) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8;">
          <span style="font-size: 13px; color: #1a1a2e;">- ${u}</span>
        </td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background:#f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; border: 1px solid #e8e4dd;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e; padding: 28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:20px; font-weight:700; color:#ffffff; font-family: Georgia, serif; letter-spacing: -0.5px;">
                      Scholar<span style="color:#818cf8;">Hub</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:1px;">Update</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 32px 24px;">
              <p style="margin:0 0 8px; font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#9b8f7e; font-weight:600;">Scholarship Update</p>
              <h1 style="margin:0 0 20px; font-size:22px; font-weight:700; color:#1a1a2e; font-family: Georgia, serif; line-height:1.3;">
                ${subject}
              </h1>

              ${
                note
                  ? `<p style="margin:0 0 20px; font-size:14px; color:#5c5346; line-height:1.6;">${note}</p>`
                  : ''
              }

              <p style="margin:0 0 12px; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:#9b8f7e;">What's new</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #f0ede8;">
                ${updatesHtml}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <a href="${SITE_URL}/scholarships"
                style="display:inline-block; padding:12px 24px; background:#1a1a2e; color:#ffffff; text-decoration:none; border-radius:100px; font-size:13px; font-weight:600;">
                Browse all scholarships →
              </a>
            </td>
          </tr>

          <!-- Disclaimer -->
          <tr>
            <td style="padding: 20px 32px; background:#f7f5f0; border-top: 1px solid #e8e4dd;">
              <p style="margin:0 0 6px; font-size:11px; color:#9b8f7e; line-height:1.6;">
                All data is manually curated from official provider websites. Always verify deadlines and requirements on the official site before applying.
              </p>
              <p style="margin:0; font-size:11px; color:#b8ad9e;">
                You received this because you subscribed at <a href="${SITE_URL}" style="color:#818cf8; text-decoration:none;">${SITE_URL.replace('https://', '')}</a>.
                To unsubscribe, reply with "unsubscribe" — we'll remove you manually.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Fetch all subscribers from Resend Audience ────────────────────────────────

async function getSubscribers(apiKey: string, audienceId: string): Promise<string[]> {
  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to fetch subscribers: ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  // Filter only subscribed contacts
  return (data.data ?? [])
    .filter((c: { unsubscribed: boolean }) => !c.unsubscribed)
    .map((c: { email: string }) => c.email);
}

// ── Send one email via Resend ─────────────────────────────────────────────────

async function sendEmail({
  apiKey,
  to,
  subject,
  html,
  from,
}: {
  apiKey: string;
  to: string;
  subject: string;
  html: string;
  from: string;
}) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to send to ${to}: ${JSON.stringify(err)}`);
  }

  return res.json();
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth check
  const secret = req.headers.get('x-notify-secret');
  if (!secret || secret !== process.env.NOTIFY_SECRET) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  let subject: string;
  let updates: string[];
  let note: string | undefined;
  let from: string;

  try {
    const body = await req.json();
    subject = body.subject;
    updates = body.updates;
    note = body.note;
    from = body.from ?? `ScholarHub <onboarding@resend.dev>`;

    if (!subject || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Required fields: subject (string), updates (string[]).' },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Fetch subscribers
  let subscribers: string[];
  try {
    subscribers = await getSubscribers(apiKey, audienceId);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  if (subscribers.length === 0) {
    return NextResponse.json({ success: true, sent: 0, message: 'No subscribers yet.' });
  }

  // Build HTML once
  const html = buildEmailHtml({ subject, updates, note });

  // Send to each subscriber
  const results = { sent: 0, failed: 0, errors: [] as string[] };

  for (const email of subscribers) {
    try {
      await sendEmail({ apiKey, to: email, subject, html, from });
      results.sent++;
      // Small delay to stay within rate limits
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      results.failed++;
      results.errors.push(String(err));
    }
  }

  return NextResponse.json({
    success: true,
    total: subscribers.length,
    sent: results.sent,
    failed: results.failed,
    ...(results.errors.length > 0 && { errors: results.errors }),
  });
}
