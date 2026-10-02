-- Run once in Supabase SQL Editor before deploying the Telegram changes.
-- This table records delivery state only; bot tokens and gift links are not stored.
create table if not exists public.wiveli_telegram_messages (
  message_key text primary key,
  gift_id uuid not null references public.gifts(id) on delete cascade,
  target_user_id uuid references auth.users(id),
  target_chat_id bigint,
  delivery_origin text,
  status text not null check (status in ('sending', 'sent', 'failed', 'unknown')),
  telegram_message_id bigint,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
alter table public.wiveli_telegram_messages enable row level security;
-- Also upgrade installations of the preceding account-only version.
alter table public.wiveli_telegram_messages alter column target_user_id drop not null;
alter table public.wiveli_telegram_messages add column if not exists target_chat_id bigint;
alter table public.wiveli_telegram_messages add column if not exists delivery_origin text;
revoke all on public.wiveli_telegram_messages from anon, authenticated;
grant select, insert, update on public.wiveli_telegram_messages to service_role;

-- Bot contacts do not require an auth.users / WIVELI account.
create table if not exists public.wiveli_telegram_contacts (
  telegram_chat_id bigint primary key,
  telegram_user_id bigint,
  telegram_username text,
  updated_at timestamptz not null default now()
);
alter table public.wiveli_telegram_contacts enable row level security;
revoke all on public.wiveli_telegram_contacts from anon, authenticated;
grant select, insert, update on public.wiveli_telegram_contacts to service_role;

-- Preserve already-known bot chats. Other users need to press Start once
-- after deployment so the existing webhook can record their chat.
insert into public.wiveli_telegram_contacts
  (telegram_chat_id, telegram_user_id, telegram_username)
select distinct on (telegram_chat_id)
  telegram_chat_id, telegram_user_id, telegram_username
from public.telegram_connections
where connected = true and telegram_chat_id is not null
order by telegram_chat_id
on conflict (telegram_chat_id) do nothing;

create table if not exists public.wiveli_gift_invitations (
  gift_id uuid primary key references public.gifts(id) on delete cascade,
  origin text not null
);
alter table public.wiveli_gift_invitations enable row level security;
revoke all on public.wiveli_gift_invitations from anon, authenticated;
grant select, insert, update on public.wiveli_gift_invitations to service_role;
-- Atomic save: two simultaneous requests cannot overwrite each other's coupons.
create or replace function public.wiveli_save_redemption(
  p_gift_id uuid, p_expected jsonb, p_updated jsonb
) returns setof public.gifts
language sql
security invoker
set search_path = public
as $$
  update public.gifts
  set gift_data = p_updated
  where id = p_gift_id
    and gift_type = 'love-coupons'
    and gift_data::jsonb = p_expected
  returning *;
$$;
revoke all on function public.wiveli_save_redemption(uuid, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.wiveli_save_redemption(uuid, jsonb, jsonb) to service_role;
notify pgrst, 'reload schema';
