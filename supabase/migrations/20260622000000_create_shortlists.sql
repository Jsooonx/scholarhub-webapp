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
