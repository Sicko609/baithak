-- Run this in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to rerun: drops any existing Baithak objects first, then recreates everything clean.
-- (This resets Baithak's own tables/data — it does NOT touch Supabase's built-in auth.users.)

-- ─────────────────────────────────────────────
-- Clean slate
-- ─────────────────────────────────────────────
drop table if exists adda_sessions cascade;
drop table if exists reviews cascade;
drop table if exists restaurants cascade;
drop table if exists profiles cascade;
drop function if exists public.handle_new_user() cascade;

-- ─────────────────────────────────────────────
-- Profiles (extends Supabase auth.users)
-- ─────────────────────────────────────────────
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  badges text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Auto-create a profile row whenever someone signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- Restaurants
-- ─────────────────────────────────────────────
create table restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text,
  category text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- Reviews (the "deshi rating system")
-- ─────────────────────────────────────────────
create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  taste_score int check (taste_score between 1 and 10),
  vibe_score int check (vibe_score between 1 and 10),
  price_tier text check (price_tier in ('Sosta', 'Motamuti', 'Dam')),
  notes text,
  created_at timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- Adda sessions (the hangout scheduler)
-- ─────────────────────────────────────────────
create table adda_sessions (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references profiles(id) not null,
  restaurant_id uuid references restaurants(id) not null,
  meetup_time timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table profiles enable row level security;
alter table restaurants enable row level security;
alter table reviews enable row level security;
alter table adda_sessions enable row level security;

-- Profiles: everyone can read, only the owner can update
create policy "Profiles are viewable by everyone" on profiles
  for select using (true);
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Restaurants: everyone can read, logged-in users can add
create policy "Restaurants are viewable by everyone" on restaurants
  for select using (true);
create policy "Authenticated users can add restaurants" on restaurants
  for insert with check (auth.uid() is not null);

-- Reviews: everyone can read, logged-in users can add/edit/delete their own
create policy "Reviews are viewable by everyone" on reviews
  for select using (true);
create policy "Authenticated users can add reviews" on reviews
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own reviews" on reviews
  for update using (auth.uid() = user_id);
create policy "Users can delete their own reviews" on reviews
  for delete using (auth.uid() = user_id);

-- Adda sessions: everyone can read, logged-in users can organize
create policy "Adda sessions are viewable by everyone" on adda_sessions
  for select using (true);
create policy "Authenticated users can create adda sessions" on adda_sessions
  for insert with check (auth.uid() = organizer_id);
