-- Add announcement_date and is_announcement_verified to scholarship_applications table
alter table public.scholarship_applications
add column if not exists announcement_date date,
add column if not exists is_announcement_verified boolean not null default false;
