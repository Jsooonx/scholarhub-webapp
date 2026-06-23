    -- Add checklist column to scholarship_applications table
    alter table public.scholarship_applications
    add column if not exists checklist jsonb default '[]'::jsonb;
