-- ==============================================================================
-- Migration: 002_contact_submissions.sql
-- Project: IELTS Ultimate
-- Description: Dedicated migration for contact_submissions table,
--              indexes, and Row Level Security (RLS) policies.
-- ==============================================================================

-- 1. Helper Security Function: Check if caller is Admin (if not already defined)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- 2. Create or extend contact_submissions table
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  service text,
  company text,
  status text default 'new' not null check (status in ('new', 'read', 'in_progress', 'resolved', 'archived')),
  source_page text default '/contact' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Ensure all columns exist if table was previously created with fewer columns
alter table public.contact_submissions add column if not exists phone text;
alter table public.contact_submissions add column if not exists service text;
alter table public.contact_submissions add column if not exists company text;
alter table public.contact_submissions add column if not exists status text default 'new' not null;
alter table public.contact_submissions add column if not exists source_page text default '/contact' not null;
alter table public.contact_submissions add column if not exists updated_at timestamptz default now() not null;

-- 3. Indexes for rapid lookups and admin filtering
create index if not exists idx_contact_submissions_email on public.contact_submissions(email);
create index if not exists idx_contact_submissions_status on public.contact_submissions(status);
create index if not exists idx_contact_submissions_created_at on public.contact_submissions(created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.contact_submissions enable row level security;

-- 5. RLS Policies
-- Policy 1: Allow public visitors (both anonymous and authenticated) to submit inquiries
drop policy if exists "Allow public visitors to insert contact submissions" on public.contact_submissions;
create policy "Allow public visitors to insert contact submissions"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (
    length(trim(name)) > 0
    and length(trim(email)) > 3
    and length(trim(message)) >= 10
  );

-- Policy 2: Restrict read access — Only designated administrators can read contact submissions
drop policy if exists "Only administrators can read contact submissions" on public.contact_submissions;
create policy "Only administrators can read contact submissions"
  on public.contact_submissions
  for select
  to authenticated
  using (public.is_admin() = true);

-- Policy 3: Restrict update access — Only administrators can update submission records
drop policy if exists "Only administrators can update contact submissions" on public.contact_submissions;
create policy "Only administrators can update contact submissions"
  on public.contact_submissions
  for update
  to authenticated
  using (public.is_admin() = true)
  with check (public.is_admin() = true);

-- Policy 4: Restrict delete access — Only administrators can delete submissions
drop policy if exists "Only administrators can delete contact submissions" on public.contact_submissions;
create policy "Only administrators can delete contact submissions"
  on public.contact_submissions
  for delete
  to authenticated
  using (public.is_admin() = true);

