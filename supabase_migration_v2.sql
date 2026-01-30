-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  role text default 'user' check (role in ('user', 'admin')),
  is_invited boolean default false,
  vocabulary_count int default 0,
  last_active_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup (Optional, but recommended)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, is_invited)
  values (new.id, 'user', false); -- Default to false, require invite
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Invitation Codes
create table public.invitation_codes (
  code text primary key,
  created_by uuid references public.profiles(id),
  used_by uuid references public.profiles(id),
  status text default 'active' check (status in ('active', 'used', 'banned')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  used_at timestamp with time zone
);

alter table public.invitation_codes enable row level security;

-- Only admins can view/create codes (Simplified policy, backend usually handles this via service role)
create policy "Admins can do everything with codes" on public.invitation_codes
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 3. Vocabulary Items
create table public.vocab_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  definition text,
  type text default 'word' check (type in ('word', 'phrase', 'sentence', 'pattern')),
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.vocab_items enable row level security;

create policy "Users can CRUD their own vocab" on public.vocab_items
  for all using (auth.uid() = user_id);

-- 4. Study Reviews (SRS)
create table public.study_reviews (
  id uuid default uuid_generate_v4() primary key,
  vocab_id uuid references public.vocab_items(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  next_review_at timestamp with time zone default timezone('utc'::text, now()),
  stage int default 0, -- Ebbinghaus stage
  last_reviewed_at timestamp with time zone,
  unique(vocab_id, user_id)
);

alter table public.study_reviews enable row level security;

create policy "Users can CRUD their own reviews" on public.study_reviews
  for all using (auth.uid() = user_id);

-- 5. API Usage Logs
create table public.api_usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  tokens_used int default 0,
  endpoint text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.api_usage_logs enable row level security;

-- Admin view usage
create policy "Admins view logs" on public.api_usage_logs
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- MIGRATION HELPER: Set existing users to invited
insert into public.profiles (id, role, is_invited)
select id, 'user', true
from auth.users
on conflict (id) do update set is_invited = true;
