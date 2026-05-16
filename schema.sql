-- ─── PROFILES ────────────────────────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text not null unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: public read"
  on public.profiles for select using (true);

create policy "profiles: own insert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: own update"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── FOOD TAGS ────────────────────────────────────────────────────────────────
create table public.food_tags (
  id   serial primary key,
  name text not null unique
);

alter table public.food_tags enable row level security;

create policy "food_tags: public read"
  on public.food_tags for select using (true);

insert into public.food_tags (name) values
  ('américain'), ('burger'), ('chinois'), ('coréen'), ('espagnol'),
  ('français'), ('fruits de mer'), ('grec'), ('indien'), ('italien'),
  ('japonais'), ('libanais'), ('méditerranéen'), ('mexicain'), ('pizza'),
  ('sushi'), ('thaï'), ('végétarien'), ('vegan');

-- ─── RESTAURANTS ─────────────────────────────────────────────────────────────
create table public.restaurants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  address     text not null,
  lat         double precision not null,
  lng         double precision not null,
  price_level smallint not null check (price_level between 1 and 4),
  created_at  timestamptz not null default now()
);

alter table public.restaurants enable row level security;

create policy "restaurants: public read"
  on public.restaurants for select using (true);

create policy "restaurants: auth insert"
  on public.restaurants for insert
  with check (auth.uid() = user_id);

create policy "restaurants: own update"
  on public.restaurants for update
  using (auth.uid() = user_id);

create policy "restaurants: own delete"
  on public.restaurants for delete
  using (auth.uid() = user_id);

-- ─── RESTAURANT TAGS (junction) ───────────────────────────────────────────────
create table public.restaurant_tags (
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  tag_id        integer references public.food_tags(id) on delete cascade,
  primary key (restaurant_id, tag_id)
);

alter table public.restaurant_tags enable row level security;

create policy "restaurant_tags: public read"
  on public.restaurant_tags for select using (true);

create policy "restaurant_tags: auth insert"
  on public.restaurant_tags for insert
  with check (
    auth.uid() = (select user_id from public.restaurants where id = restaurant_id)
  );

create policy "restaurant_tags: own delete"
  on public.restaurant_tags for delete
  using (
    auth.uid() = (select user_id from public.restaurants where id = restaurant_id)
  );

-- ─── COMMENTS ─────────────────────────────────────────────────────────────────
create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  text          text not null check (char_length(text) between 1 and 1000),
  sentiment     text not null check (sentiment in ('like', 'dislike')),
  created_at    timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "comments: public read"
  on public.comments for select using (true);

create policy "comments: auth insert"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "comments: own delete"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
create index idx_restaurants_lat_lng on public.restaurants (lat, lng);
create index idx_comments_restaurant on public.comments (restaurant_id, created_at desc);
create index idx_restaurant_tags_restaurant on public.restaurant_tags (restaurant_id);
