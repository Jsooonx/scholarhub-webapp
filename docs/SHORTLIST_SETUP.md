# ScholarHub Shortlist Accounts Setup

The shortlist feature uses Supabase Auth and a Postgres table protected by Row Level Security.

## Environment variables

Add these values to your deployment environment and local `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-or-anon-key"
```

## Database migration

Run the SQL migration in:

```text
supabase/migrations/20260622000000_create_shortlists.sql
```

It creates the `public.shortlists` table with:

- `id`
- `user_id`
- `scholarship_slug`
- `created_at`
- unique `(user_id, scholarship_slug)`
- RLS policies for owner-only select, insert, and delete

## Auth providers

Enable these providers in Supabase Auth:

- Email OTP / magic link
- Google OAuth

Add this redirect URL in Supabase Auth settings:

```text
https://your-domain.com/auth/callback
```

For local development, also add:

```text
http://localhost:3000/auth/callback
```
