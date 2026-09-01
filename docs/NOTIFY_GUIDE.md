# ScholarHub - Notify Guide

> Also referenced in [SETUP_GUIDE.md](./SETUP_GUIDE.md) → Section 9 (Sending Notifications).

Complete guide for sending email notifications to all ScholarHub subscribers.

---

## How It Works

1. User subscribes on the homepage → email is saved to **Resend Audiences**
2. You trigger the `/api/notify` endpoint from your terminal → the system fetches all subscribers → sends email to each one via Resend

---

## Prerequisites

Make sure the following environment variables are set in both `.env` (local) and Vercel dashboard (production):

```
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
NOTIFY_SECRET=
```

> Keep the secret out of version control. Never commit `.env` to the repo.

---

## Sending a Notification

### Via `curl` (from terminal)

```bash
curl -X POST https://scholarhub.jsooonx.my.id/api/notify \
  -H "Content-Type: application/json" \
  -H "x-notify-secret: YOUR_NOTIFY_SECRET" \
  -d '{
    "subject": "Email subject line here",
    "note": "Optional intro paragraph.",
    "updates": [
      "First update item",
      "Second update item",
      "Third update item"
    ]
  }'
```

### Via PowerShell (Windows)

```powershell
$body = @{
    subject = "Email subject line here"
    note    = "Optional intro paragraph."
    updates = @(
        "First update item",
        "Second update item",
        "Third update item"
    )
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri "https://scholarhub.jsooonx.my.id/api/notify" `
  -Method POST `
  -Headers @{
      "Content-Type"    = "application/json"
      "x-notify-secret" = "YOUR_NOTIFY_SECRET"
  } `
  -Body $body
```

---

## Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | string | Yes | Email subject line shown in the inbox |
| `updates` | string[] | Yes | List of changes or new scholarships added |
| `note` | string | No | Optional intro paragraph shown above the updates list |
| `from` | string | No | Sender display name. Default: `ScholarHub <onboarding@resend.dev>` |

---

## Example Payloads

### 1 - New scholarships added

```json
{
  "subject": "5 New Scholarships Added",
  "note": "We just added several new programs from Singapore and Canada.",
  "updates": [
    "NUS International Undergraduate Scholarship (Singapore)",
    "Dr Goh Keng Swee Scholarship (Singapore)",
    "Lester B. Pearson Scholarship - University of Toronto (Canada)",
    "ENS Lyon Ampere Excellence Scholarship (France)",
    "Paris-Saclay International Masters Scholarship (France)"
  ]
}
```

### 2 - Annual deadline update

```json
{
  "subject": "Scholarship Deadline Updates for 2027 Cycle",
  "note": "Several scholarship deadlines for the 2027 intake cycle have been updated.",
  "updates": [
    "MEXT Gakubu 2027 - applications open 1 April 2027",
    "Chevening 2027 - applications open 5 August 2026",
    "Australia Awards - deadline 30 April 2027",
    "GKS Graduate - applications open February 2027"
  ]
}
```

### 3 - Short notification without note

```json
{
  "subject": "Chevening 2027 Applications Now Open",
  "updates": [
    "Chevening Scholarship (Indonesia) - deadline 7 October 2026",
    "Chevening ASEAN Scholarship - deadline 7 October 2026"
  ]
}
```

---

## Response Format

### Success

```json
{
  "success": true,
  "total": 42,
  "sent": 42,
  "failed": 0
}
```

### Partial failure

```json
{
  "success": true,
  "total": 42,
  "sent": 40,
  "failed": 2,
  "errors": [
    "Failed to send to example@email.com: ..."
  ]
}
```

### No subscribers yet

```json
{
  "success": true,
  "sent": 0,
  "message": "No subscribers yet."
}
```

### Unauthorized

```json
{
  "error": "Unauthorized."
}
```

---

## Viewing Subscribers

Open [resend.com](https://resend.com) → **Audience** → **Contacts** tab.

Or via API:

```bash
curl https://api.resend.com/audiences/AUDIENCE_ID/contacts \
  -H "Authorization: Bearer RESEND_API_KEY"
```

---

## Important Notes

- **Resend free tier rate limit**: 100 emails/day, 3,000/month. Only send notifications for significant updates.
- **Delay between emails**: The script includes a 300ms delay per email to stay within rate limits.
- **Unsubscribe**: There is no automatic unsubscribe link. Subscribers who want to opt out should reply to the email — remove them manually from the Resend dashboard.
- **From address**: Domain is verified. Use `no-reply@send.scholarhub.jsooonx.my.id` as the sender, or pass a custom `from` field in the request body.

---

## Domain Verification (Optional but Recommended)

To avoid spam filters and use your own sender address:

1. Resend dashboard → **Domains** → **Add Domain**
2. Enter domain: `scholarhub.jsooonx.my.id`
3. Add the provided DNS records to your domain provider
4. Wait for verification (usually 15-60 minutes)
5. Once verified, update `from` in your requests to `ScholarHub <no-reply@scholarhub.jsooonx.my.id>`

---

*Last updated: June 2026*
