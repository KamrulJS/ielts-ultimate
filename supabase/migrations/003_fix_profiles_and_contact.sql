-- ==============================================================================
-- Migration: 003_fix_profiles_and_contact.sql
-- Project: IELTS Ultimate
-- Description: Comprehensive, safe, idempotent setup and fix for:
--              1. public.profiles (table, columns, trigger sync from auth.users, backfill, RLS)
--              2. public.contact_submissions (table, extended columns, status constraint, RLS)
--              3. PostgREST schema cache notification
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Security Function: Check if caller has 'admin' in app_metadata
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 2. User Profiles Table (public.profiles)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text default 'user' not null check (role in ('user', 'admin')),
  target_band numeric(2, 1) default 7.5,
  track text default 'Academic',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Ensure all columns exist if table was partially created previously
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists role text default 'user' not null;
alter table public.profiles add column if not exists target_band numeric(2, 1) default 7.5;
alter table public.profiles add column if not exists track text default 'Academic';
alter table public.profiles add column if not exists created_at timestamptz default now() not null;
alter table public.profiles add column if not exists updated_at timestamptz default now() not null;

-- Indexes for rapid lookup
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Profiles RLS Policies:
-- 1. Users can view their own profile
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- 2. Users can update permitted fields of their own profile
drop policy if exists "Users can update permitted fields of their own profile" on public.profiles;
create policy "Users can update permitted fields of their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Administrators can view all profiles
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin() = true);

-- 4. Administrators can update any profile
drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Admins can update all profiles"
  on public.profiles
  for update
  to authenticated
  using (public.is_admin() = true)
  with check (public.is_admin() = true);

-- ------------------------------------------------------------------------------
-- 3. Automatic Profile Creation Trigger on auth.users (Email & Google OAuth)
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role text;
  display_name text;
  profile_avatar text;
begin
  assigned_role := coalesce(new.raw_app_meta_data->>'role', 'user');

  display_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1),
    'Student'
  );

  profile_avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    null
  );

  insert into public.profiles (
    id,
    full_name,
    email,
    avatar_url,
    role,
    target_band,
    track,
    created_at,
    updated_at
  )
  values (
    new.id,
    display_name,
    new.email,
    profile_avatar,
    assigned_role,
    coalesce((new.raw_user_meta_data->>'target_band')::numeric, 7.5),
    coalesce(new.raw_user_meta_data->>'track', 'Academic'),
    coalesce(new.created_at, now()),
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. Prevent Normal Users From Escalating Roles on Update
-- ------------------------------------------------------------------------------
create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Unauthorized: Only designated administrators can modify user roles.';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists on_profile_update on public.profiles;
create trigger on_profile_update
  before update on public.profiles
  for each row execute function public.prevent_profile_role_escalation();

-- ------------------------------------------------------------------------------
-- 5. Safe Backfill: Sync existing auth.users into public.profiles
-- ------------------------------------------------------------------------------
insert into public.profiles (
  id,
  full_name,
  email,
  avatar_url,
  role,
  target_band,
  track,
  created_at,
  updated_at
)
select
  u.id,
  coalesce(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1),
    'Student'
  ) as full_name,
  u.email,
  coalesce(
    u.raw_user_meta_data->>'avatar_url',
    u.raw_user_meta_data->>'picture',
    null
  ) as avatar_url,
  coalesce(u.raw_app_meta_data->>'role', 'user') as role,
  coalesce((u.raw_user_meta_data->>'target_band')::numeric, 7.5) as target_band,
  coalesce(u.raw_user_meta_data->>'track', 'Academic') as track,
  coalesce(u.created_at, now()) as created_at,
  now() as updated_at
from auth.users u
on conflict (id) do update
set
  email = excluded.email,
  full_name = coalesce(public.profiles.full_name, excluded.full_name),
  avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
  updated_at = now();

-- ------------------------------------------------------------------------------
-- 6. Contact Form Submissions Table (public.contact_submissions)
-- ------------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  service text,
  company text,
  status text default 'new' not null,
  source_page text default '/contact' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Ensure all extended columns exist if table was created with an earlier minimal schema
alter table public.contact_submissions add column if not exists phone text;
alter table public.contact_submissions add column if not exists subject text;
alter table public.contact_submissions add column if not exists service text;
alter table public.contact_submissions add column if not exists company text;
alter table public.contact_submissions add column if not exists status text default 'new' not null;
alter table public.contact_submissions add column if not exists source_page text default '/contact' not null;
alter table public.contact_submissions add column if not exists updated_at timestamptz default now() not null;

-- Safely ensure the status check constraint includes all permitted values:
-- ('new', 'read', 'in_progress', 'resolved', 'archived')
do $$
begin
  alter table public.contact_submissions drop constraint if exists contact_submissions_status_check;
  alter table public.contact_submissions add constraint contact_submissions_status_check
    check (status in ('new', 'read', 'in_progress', 'resolved', 'archived'));
exception
  when others then null;
end $$;

-- Indexes for rapid admin filtering
create index if not exists idx_contact_submissions_email on public.contact_submissions(email);
create index if not exists idx_contact_submissions_status on public.contact_submissions(status);
create index if not exists idx_contact_submissions_created_at on public.contact_submissions(created_at desc);

-- Enable Row Level Security (RLS)
alter table public.contact_submissions enable row level security;

-- Contact Submissions RLS Policies:
-- 1. Public visitors (anonymous and authenticated) can insert valid contact inquiries
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

-- 2. Restrict read access — Only designated administrators can read contact submissions
drop policy if exists "Only administrators can read contact submissions" on public.contact_submissions;
create policy "Only administrators can read contact submissions"
  on public.contact_submissions
  for select
  to authenticated
  using (public.is_admin() = true);

-- 3. Restrict update access — Only administrators can update submission records
drop policy if exists "Only administrators can update contact submissions" on public.contact_submissions;
create policy "Only administrators can update contact submissions"
  on public.contact_submissions
  for update
  to authenticated
  using (public.is_admin() = true)
  with check (public.is_admin() = true);

-- 4. Restrict delete access — Only administrators can delete submissions
drop policy if exists "Only administrators can delete contact submissions" on public.contact_submissions;
create policy "Only administrators can delete contact submissions"
  on public.contact_submissions
  for delete
  to authenticated
  using (public.is_admin() = true);

-- ------------------------------------------------------------------------------
-- 7. Notify PostgREST to immediately refresh its schema cache
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

