-- 혜로로 커뮤니티 DB
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null unique,
  minerals bigint not null default 1000 check (minerals >= 0),
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price bigint not null check (price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.mineral_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount bigint not null,
  reason text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.shop_items enable row level security;
alter table public.mineral_transactions enable row level security;

create policy "public profiles read" on public.profiles for select to anon, authenticated using (true);
create policy "own profile update" on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "posts public read" on public.posts for select to anon, authenticated using (true);
create policy "users create posts" on public.posts for insert to authenticated with check ((select auth.uid())=user_id);
create policy "own posts update" on public.posts for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "own posts delete" on public.posts for delete to authenticated using ((select auth.uid())=user_id);
create policy "active shop public read" on public.shop_items for select to anon, authenticated using (active=true);
create policy "own transactions read" on public.mineral_transactions for select to authenticated using ((select auth.uid())=user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id,nickname) values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'nickname',''), '회원_'||substr(new.id::text,1,6))
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.shop_items(name,description,price) values
('응원 메시지','혜로로에게 응원 메시지를 남깁니다.',250),
('팬 배지','프로필에 팬 배지를 표시합니다.',800),
('VIP 패스','커뮤니티 VIP 혜택용 샘플 상품입니다.',1800)
on conflict do nothing;

-- 관리자 지정:
-- update public.profiles set role='admin' where id='YOUR_USER_UUID';
