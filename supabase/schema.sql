-- ==============================================================================
-- IELTS Ultimate — Consolidated Database Schema
-- Tables: public.profiles, public.contact_submissions
-- Security: Row Level Security (RLS) enabled on all tables
-- Triggers: auth.users -> public.profiles synchronization
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Security Function: Check if caller is Admin
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

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles RLS Policies
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update permitted fields of their own profile" on public.profiles;
create policy "Users can update permitted fields of their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin() = true);

drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Admins can update all profiles"
  on public.profiles
  for update
  to authenticated
  using (public.is_admin() = true)
  with check (public.is_admin() = true);

-- Profiles Triggers: Sync from auth.users on insert
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

-- Prevent normal users from escalating roles
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

-- Backfill existing auth.users into profiles
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
-- 3. Contact Form Submissions Table (public.contact_submissions)
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
  status text default 'new' not null check (status in ('new', 'read', 'in_progress', 'resolved', 'archived')),
  source_page text default '/contact' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_contact_submissions_email on public.contact_submissions(email);
create index if not exists idx_contact_submissions_status on public.contact_submissions(status);
create index if not exists idx_contact_submissions_created_at on public.contact_submissions(created_at desc);

-- Enable RLS for contact_submissions
alter table public.contact_submissions enable row level security;

-- Contact Submissions Policies
-- Policy 1: Public visitors (anon) and authenticated users can insert valid contact inquiries
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

-- Policy 2: Public users CANNOT view submissions. Only administrators can read.
drop policy if exists "Only administrators can read contact submissions" on public.contact_submissions;
create policy "Only administrators can read contact submissions"
  on public.contact_submissions
  for select
  to authenticated
  using (public.is_admin() = true);

-- Policy 3: Only administrators can update submission status/records
drop policy if exists "Only administrators can update contact submissions" on public.contact_submissions;
create policy "Only administrators can update contact submissions"
  on public.contact_submissions
  for update
  to authenticated
  using (public.is_admin() = true)
  with check (public.is_admin() = true);

-- Policy 4: Only administrators can delete contact submissions
drop policy if exists "Only administrators can delete contact submissions" on public.contact_submissions;
create policy "Only administrators can delete contact submissions"
  on public.contact_submissions
  for delete
  to authenticated
  using (public.is_admin() = true);

-- ------------------------------------------------------------------------------
-- 4. Notify PostgREST to reload schema
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
