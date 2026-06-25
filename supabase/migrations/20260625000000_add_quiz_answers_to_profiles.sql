alter table public.profiles
add column if not exists quiz_answers jsonb;
