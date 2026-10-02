begin;
-- Private files: uploads and short-lived viewing links are authorized by the app.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('wiveli-coupon-attachments','wiveli-coupon-attachments',false,52428800,
array['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime','application/pdf','audio/mpeg','audio/mp4','audio/wav','audio/ogg','audio/webm'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
-- No anonymous/authenticated write/read policy: the server issues scoped signed URLs.

-- Extend any simple gift-type CHECK while retaining every pre-existing type.
do $$
declare c record; a smallint;
begin
 select attnum into a from pg_attribute where attrelid='public.gifts'::regclass and attname='gift_type';
 for c in select conname,pg_get_expr(conbin,conrelid) expr from pg_constraint where conrelid='public.gifts'::regclass and contype='c' and conkey=array[a] loop
   if position('open-when' in c.expr)=0 then
     execute format('alter table public.gifts drop constraint %I',c.conname);
     execute format('alter table public.gifts add constraint %I check ((%s) or gift_type = ''open-when'')',c.conname,c.expr);
   end if;
 end loop;
end $$;
alter table public.wiveli_account_events drop constraint if exists wiveli_account_events_kind_check;
alter table public.wiveli_account_events add constraint wiveli_account_events_kind_check check(kind in ('opened','redeemed','wish-created','wish-completed','letter-opened','letter-response'));
create or replace function public.wiveli_save_letter_event(p_gift_id uuid,p_expected jsonb,p_updated jsonb,p_event_key text,p_kind text,p_moment_id text)
returns setof public.gifts language sql security invoker set search_path=public as $$
 with changed as (
  update public.gifts set gift_data=p_updated where id=p_gift_id and gift_type='open-when' and gift_data::jsonb=p_expected returning *
 ), recorded as (
  insert into public.wiveli_account_events(event_key,user_id,gift_id,kind,coupon_id)
  select p_event_key,p.user_id,c.id,p_kind,p_moment_id from changed c join public.gift_participants p on p.gift_id=c.id and p.role='sender'
  where p.user_id is not null on conflict(event_key) do nothing returning event_key
 ) select changed.* from changed;
$$;
revoke all on function public.wiveli_save_letter_event(uuid,jsonb,jsonb,text,text,text) from public,anon,authenticated;
grant execute on function public.wiveli_save_letter_event(uuid,jsonb,jsonb,text,text,text) to service_role;
commit;
notify pgrst,'reload schema';
