create table if not exists public.scholarship_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scholarship_slug text not null,
  status text not null default 'shortlisted',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, scholarship_slug),
  constraint scholarship_applications_status_check check (
    status in ('shortlisted', 'preparing', 'applied', 'interviewing', 'accepted', 'rejected')
  )
);

-- Enable RLS
alter table public.scholarship_applications enable row level security;

-- Policies
create policy "Users can read their own applications"
  on public.scholarship_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on public.scholarship_applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on public.scholarship_applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own applications"
  on public.scholarship_applications for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists scholarship_applications_user_status_idx
  on public.scholarship_applications (user_id, status);

-- Migrate existing shortlists data
insert into public.scholarship_applications (user_id, scholarship_slug, status)
select user_id, scholarship_slug, 'shortlisted'
from public.shortlists
on conflict (user_id, scholarship_slug) do nothing;
