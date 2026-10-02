-- Run before uploading the accompanying app update. Does not remove gifts/users.
begin;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wiveli-avatars', 'wiveli-avatars', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = excluded.allowed_mime_types;
-- Uploads go through the authenticated server route. No client write policy.

create table if not exists public.wiveli_telegram_link_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text unique not null,
  expires_at timestamptz not null
);
alter table public.wiveli_telegram_link_codes enable row level security;
revoke all on public.wiveli_telegram_link_codes from anon, authenticated;
grant select, insert, update, delete on public.wiveli_telegram_link_codes to service_role;

create or replace function public.wiveli_connect_telegram(p_code text, p_chat_id bigint, p_telegram_user_id bigint, p_username text)
returns boolean language plpgsql security invoker set search_path = public as $$
declare linked_user uuid;
begin
  select user_id into linked_user from public.wiveli_telegram_link_codes
  where code = p_code and expires_at > now() for update;
  if linked_user is null then return false; end if;
  -- Serialize attempts using the same Telegram chat across different accounts.
  perform pg_advisory_xact_lock(p_chat_id);
  if exists(select 1 from public.telegram_connections where telegram_chat_id = p_chat_id and connected = true and user_id <> linked_user) then return false; end if;
  update public.telegram_connections set telegram_chat_id = p_chat_id,
    telegram_user_id = p_telegram_user_id, telegram_username = p_username,
    connected = true, connected_at = now(), connect_code = null
  where user_id = linked_user;
  if not found then
    insert into public.telegram_connections(user_id,telegram_chat_id,telegram_user_id,telegram_username,connected,connected_at,connect_code)
    values(linked_user,p_chat_id,p_telegram_user_id,p_username,true,now(),null);
  end if;
  delete from public.wiveli_telegram_link_codes where user_id = linked_user;
  return true;
end;
$$;
revoke all on function public.wiveli_connect_telegram(text,bigint,bigint,text) from public,anon,authenticated;
grant execute on function public.wiveli_connect_telegram(text,bigint,bigint,text) to service_role;

create table if not exists public.wiveli_account_events (
  event_key text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  gift_id uuid not null references public.gifts(id) on delete cascade,
  kind text not null check(kind in ('opened','redeemed')),
  coupon_id text,
  occurred_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists wiveli_account_events_user_time on public.wiveli_account_events(user_id,occurred_at desc);
alter table public.wiveli_account_events enable row level security;
revoke all on public.wiveli_account_events from anon,authenticated;
grant select,insert,update on public.wiveli_account_events to service_role;

-- Save coupon and Inbox notification in the SAME transaction.
create or replace function public.wiveli_save_redemption(p_gift_id uuid,p_expected jsonb,p_updated jsonb)
returns setof public.gifts language sql security invoker set search_path = public as $$
  with changed as (
    update public.gifts set gift_data = p_updated
    where id = p_gift_id and gift_type = 'love-coupons' and gift_data::jsonb = p_expected
    returning *
  ), recorded as (
    insert into public.wiveli_account_events(event_key,user_id,gift_id,kind,coupon_id)
    select 'redeemed:' || changed.id::text || ':' || (r->>'couponId'), p.user_id, changed.id, 'redeemed', r->>'couponId'
    from changed join public.gift_participants p on p.gift_id = changed.id and p.role = 'sender'
    cross join lateral jsonb_array_elements(case when jsonb_typeof(p_updated->'redemptions') = 'array' then p_updated->'redemptions' else '[]'::jsonb end) r
    where p.user_id is not null and r->>'couponId' is not null
      and not exists(select 1 from jsonb_array_elements(case when jsonb_typeof(p_expected->'redemptions') = 'array' then p_expected->'redemptions' else '[]'::jsonb end) old where old->>'couponId' = r->>'couponId')
    on conflict(event_key) do nothing returning event_key
  ) select changed.* from changed;
$$;
revoke all on function public.wiveli_save_redemption(uuid,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.wiveli_save_redemption(uuid,jsonb,jsonb) to service_role;
commit;
notify pgrst, 'reload schema';
