-- STEP 1 of 2: Run this in Supabase > SQL Editor.
-- It creates the 2 tables the portfolio uses.

-- ===== Projects shown on the Works page =====
create table if not exists public.projects (
  slug              text primary key,          -- short id used in links, like "ecolink"
  title             text not null,
  category          text not null check (category in ('backend', 'frontend')),
  sort_order        int  not null default 0,
  chips             text[] not null default '{}',
  year              text not null,
  role              text not null,
  card_summary      text not null,
  card_tags         text[] not null default '{}',
  card_image        text not null,
  card_phone_image  text,
  overview          text not null,
  features          text[] not null default '{}',
  decisions         jsonb,                     -- list of { q, a } or null
  highlight         jsonb,                     -- { big, sub, text } or null
  tech              text[] not null default '{}',
  live_url          text,
  live_label        text not null default 'LIVE SITE',
  note              text,
  gallery           jsonb not null             -- { images: [...] } or { tabs: [...] }
);

-- ===== Messages from the Contact form =====
create table if not exists public.messages (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) <= 200),
  company     text check (char_length(company) <= 100),
  message     text not null check (char_length(message) between 10 and 3000),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Makes the "max 3 messages per email every 10 minutes" check fast
create index if not exists messages_email_created_idx on public.messages (email, created_at desc);

-- ===== Security =====
-- Row Level Security is ON and there are NO public policies.
-- That means nobody can read or write these tables from the browser.
-- Only the Node.js API (using the secret service role key) can reach them.
alter table public.projects enable row level security;
alter table public.messages enable row level security;

-- ===== Permissions =====
-- The browser roles (anon, authenticated) get nothing.
-- The backend role (service_role) gets only what the API needs:
--   read projects, and read + add messages.
revoke all on public.projects, public.messages from anon, authenticated;
grant usage on schema public to service_role;
grant select on public.projects to service_role;
grant select, insert on public.messages to service_role;
