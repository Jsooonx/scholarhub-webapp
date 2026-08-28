-- ==============================================================================
-- ScholarHub Consolidated Supabase Database Schema
-- Run this complete script in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Shortlists Table
create table if not exists public.shortlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scholarship_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, scholarship_slug)
);

alter table public.shortlists enable row level security;

drop policy if exists "Users can read their own shortlist" on public.shortlists;
create policy "Users can read their own shortlist"
  on public.shortlists for select
  using (auth.uid() = user_id);

drop policy if exists "Users can add to their own shortlist" on public.shortlists;
create policy "Users can add to their own shortlist"
  on public.shortlists for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove from their own shortlist" on public.shortlists;
create policy "Users can remove from their own shortlist"
  on public.shortlists for delete
  using (auth.uid() = user_id);

create index if not exists shortlists_user_created_at_idx
  on public.shortlists (user_id, created_at desc);


-- 2. Profiles Table
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  username text unique,
  bio text,
  location text,
  website_url text,
  avatar_url text,
  quiz_answers jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (
    username is null or username ~ '^[a-z0-9_]{3,30}$'
  )
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists profiles_username_idx
  on public.profiles (username);


-- 3. Scholarship Applications & Tracker Table
create table if not exists public.scholarship_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scholarship_slug text not null,
  status text not null default 'shortlisted',
  notes text,
  checklist jsonb default '[]'::jsonb,
  target_deadline timestamptz,
  announcement_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, scholarship_slug),
  constraint scholarship_applications_status_check check (
    status in ('shortlisted', 'preparing', 'applied', 'interviewing', 'accepted', 'rejected')
  )
);

alter table public.scholarship_applications enable row level security;

drop policy if exists "Users can read their own applications" on public.scholarship_applications;
create policy "Users can read their own applications"
  on public.scholarship_applications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own applications" on public.scholarship_applications;
create policy "Users can insert their own applications"
  on public.scholarship_applications for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own applications" on public.scholarship_applications;
create policy "Users can update their own applications"
  on public.scholarship_applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own applications" on public.scholarship_applications;
create policy "Users can delete their own applications"
  on public.scholarship_applications for delete
  using (auth.uid() = user_id);

create index if not exists scholarship_applications_user_status_idx
  on public.scholarship_applications (user_id, status);

-- Sync any existing shortlists to applications if not already present
insert into public.scholarship_applications (user_id, scholarship_slug, status)
select user_id, scholarship_slug, 'shortlisted'
from public.shortlists
on conflict (user_id, scholarship_slug) do nothing;
