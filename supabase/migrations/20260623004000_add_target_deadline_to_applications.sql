-- Add target_deadline and is_deadline_verified to scholarship_applications table
alter table public.scholarship_applications
add column if not exists target_deadline date,
add column if not exists is_deadline_verified boolean not null default false;
