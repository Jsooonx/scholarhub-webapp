# ScholarHub Accounts Setup

> ⚠️ **This guide is deprecated.** See [SETUP_GUIDE.md](./SETUP_GUIDE.md) → Section 7 (Auth & Database) for the complete, up-to-date setup including all 8 migrations, environment variables, and feature documentation.

The account features use Supabase Auth and Postgres tables protected by Row Level Security.

## Environment variables

Add these values to your deployment environment and local `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-or-anon-key"
```

## Database migration

Run the SQL migrations in:

```text
supabase/migrations/20260622000000_create_shortlists.sql
supabase/migrations/20260622001000_create_profiles.sql
```

The shortlist migration creates the `public.shortlists` table with:

- `id`
- `user_id`
- `scholarship_slug`
- `created_at`
- unique `(user_id, scholarship_slug)`
- RLS policies for owner-only select, insert, and delete

The profile migration creates the `public.profiles` table with:

- `user_id`
- `display_name`
- `username`
- `bio`
- `location`
- `website_url`
- `avatar_url`
- `created_at`
- `updated_at`
- public read policy for future community member cards
- owner-only insert/update policies

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
