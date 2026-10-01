-- Run once in Supabase SQL Editor before deploying the Telegram changes.
-- This table records delivery state only; bot tokens and gift links are not stored.
create table if not exists public.wiveli_telegram_messages (
  message_key text primary key,
  gift_id uuid not null references public.gifts(id) on delete cascade,
  target_user_id uuid not null references auth.users(id),
  status text not null check (status in ('sending', 'sent', 'failed', 'unknown')),
  telegram_message_id bigint,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
alter table public.wiveli_telegram_messages enable row level security;
revoke all on public.wiveli_telegram_messages from anon, authenticated;
grant select, insert, update on public.wiveli_telegram_messages to service_role;
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
