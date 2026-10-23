-- ============================================================================
-- Every Other Saturday — push notifications (nudges)
-- Paste this whole file into Supabase (project "The Goodacres") > SQL Editor >
-- New query, then Run. Run it once, after eos_001. Safe to run again.
--
-- What it adds
--   * Two yes/no facts per synced fixture, so the server knows when to nudge:
--       has_prediction — a pre-match score call has been entered
--       post_done      — "After the whistle" has been written
--     (Only the yes/no travels. The prediction and the write-up stay on the phone.)
--   * eos_push_subscriptions — which phones to buzz.
--   * eos_notify_prefs       — the on/off switches from EOS Settings.
--   * eos_nudges_sent        — so each nudge only ever goes once.
--   * eos_take_due_nudges()  — what the scheduled job calls every 5 minutes.
--
-- Everything starts with eos_; nothing belonging to The Nest or The Roost changes.
-- The Roost's contract on eos_fixtures (user_id, id, date, kickoff, opposition,
-- venue, competition, attending) is untouched — columns are only added.
-- ============================================================================

alter table public.eos_fixtures add column if not exists has_prediction boolean not null default false;
alter table public.eos_fixtures add column if not exists post_done      boolean not null default false;

create table if not exists public.eos_push_subscriptions (
  endpoint   text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);
create index if not exists eos_push_subscriptions_user_idx on public.eos_push_subscriptions (user_id);

create table if not exists public.eos_notify_prefs (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  prediction    boolean not null default true,   -- 2 hours before kick-off, no call yet
  after_whistle boolean not null default true,   -- 24 hours after a game you were at, nothing written
  updated_at    timestamptz not null default now()
);

create table if not exists public.eos_nudges_sent (
  user_id    uuid not null references auth.users(id) on delete cascade,
  fixture_id text not null,
  kind       text not null,                       -- 'prediction' | 'after_whistle'
  sent_at    timestamptz not null default now(),
  primary key (user_id, fixture_id, kind)
);

alter table public.eos_push_subscriptions enable row level security;
alter table public.eos_notify_prefs       enable row level security;
alter table public.eos_nudges_sent        enable row level security;
-- No policies on purpose: the app only reaches these through the functions below.

-- ---------------------------------------------------------------------------
-- Sync: same as eos_001, now also taking hasPrediction / postDone.
-- ---------------------------------------------------------------------------
create or replace function public.eos_sync_fixtures(p_rows jsonb) returns integer
language plpgsql security definer set search_path = public as $$
declare
  n integer;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if not public.eos_is_aal2() then raise exception 'mfa_required'; end if;
  if jsonb_typeof(p_rows) <> 'array' then raise exception 'bad_payload'; end if;

  delete from public.eos_fixtures f
   where f.user_id = auth.uid()
     and not exists (select 1 from jsonb_array_elements(p_rows) r where r ->> 'id' = f.id);

  insert into public.eos_fixtures as f (user_id, id, season, date, kickoff, opposition, venue, competition, attending, date_confirmed, has_prediction, post_done, updated_at)
  select auth.uid(),
         r ->> 'id',
         coalesce(r ->> 'season', ''),
         nullif(r ->> 'date', '')::date,
         nullif(r ->> 'kickoff', ''),
         coalesce(r ->> 'opposition', ''),
         nullif(r ->> 'venue', ''),
         nullif(r ->> 'competition', ''),
         coalesce(r ->> 'attending', 'none'),
         coalesce((r ->> 'dateConfirmed')::boolean, false),
         coalesce((r ->> 'hasPrediction')::boolean, false),
         coalesce((r ->> 'postDone')::boolean, false),
         now()
    from jsonb_array_elements(p_rows) r
   where coalesce(r ->> 'id', '') <> ''
  on conflict (user_id, id) do update set
         season = excluded.season, date = excluded.date, kickoff = excluded.kickoff,
         opposition = excluded.opposition, venue = excluded.venue, competition = excluded.competition,
         attending = excluded.attending, date_confirmed = excluded.date_confirmed,
         has_prediction = excluded.has_prediction, post_done = excluded.post_done, updated_at = now()
   where (f.season, f.date, f.kickoff, f.opposition, f.venue, f.competition, f.attending, f.date_confirmed, f.has_prediction, f.post_done)
         is distinct from
         (excluded.season, excluded.date, excluded.kickoff, excluded.opposition, excluded.venue, excluded.competition, excluded.attending, excluded.date_confirmed, excluded.has_prediction, excluded.post_done);

  select count(*) into n from public.eos_fixtures where user_id = auth.uid();
  return n;
end $$;

-- ---------------------------------------------------------------------------
-- Phone + settings, called from EOS (signed in with the code, like the sync).
-- ---------------------------------------------------------------------------
create or replace function public.eos_save_push_subscription(p_endpoint text, p_p256dh text, p_auth text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if not public.eos_is_aal2() then raise exception 'mfa_required'; end if;
  if coalesce(p_endpoint, '') = '' or coalesce(p_p256dh, '') = '' or coalesce(p_auth, '') = '' then raise exception 'bad_subscription'; end if;
  insert into public.eos_push_subscriptions (endpoint, user_id, p256dh, auth)
  values (p_endpoint, auth.uid(), p_p256dh, p_auth)
  on conflict (endpoint) do update set user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth;
  insert into public.eos_notify_prefs (user_id) values (auth.uid()) on conflict (user_id) do nothing;
end $$;

create or replace function public.eos_delete_push_subscription(p_endpoint text) returns void
language sql security definer set search_path = public as $$
  delete from public.eos_push_subscriptions where endpoint = p_endpoint and user_id = auth.uid()
$$;

create or replace function public.eos_set_notify_prefs(p_prediction boolean, p_after_whistle boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if not public.eos_is_aal2() then raise exception 'mfa_required'; end if;
  insert into public.eos_notify_prefs (user_id, prediction, after_whistle, updated_at)
  values (auth.uid(), coalesce(p_prediction, true), coalesce(p_after_whistle, true), now())
  on conflict (user_id) do update set prediction = excluded.prediction, after_whistle = excluded.after_whistle, updated_at = now();
end $$;

create or replace function public.eos_get_notify_prefs() returns table (prediction boolean, after_whistle boolean, phones integer)
language sql stable security definer set search_path = public as $$
  select coalesce(p.prediction, true), coalesce(p.after_whistle, true),
         (select count(*)::int from public.eos_push_subscriptions s where s.user_id = auth.uid())
    from (select auth.uid() as uid) me
    left join public.eos_notify_prefs p on p.user_id = me.uid
   where public.eos_is_aal2()
$$;

-- ---------------------------------------------------------------------------
-- For the scheduled job (service role only). Works out which nudges are due,
-- marks them as sent in the same step (so two runs can never double up), and
-- returns them with what the message needs.
--   prediction:    kick-off time known, no call entered, not a friendly,
--                  from 2 hours before kick-off until kick-off.
--   after_whistle: marked Going or Was there, nothing written After the whistle,
--                  from 24 hours after kick-off (15:00 if the time's unknown)
--                  for the following two days.
-- Kick-off times are UK local time, so British Summer Time is handled.
-- ---------------------------------------------------------------------------
create or replace function public.eos_take_due_nudges(p_now timestamptz default now())
returns table (user_id uuid, fixture_id text, kind text, opposition text, venue text, competition text, kickoff text, date date)
language sql volatile security definer set search_path = public as $$
  with fx as (
    select f.*,
           case when f.kickoff ~ '^[0-2]?[0-9]:[0-5][0-9]$'
                then ((f.date + f.kickoff::time) at time zone 'Europe/London') end as ko_exact,
           ((f.date + coalesce(case when f.kickoff ~ '^[0-2]?[0-9]:[0-5][0-9]$' then f.kickoff::time end, time '15:00'))
              at time zone 'Europe/London') as ko_any
      from public.eos_fixtures f
     where f.date is not null
       and exists (select 1 from public.eos_push_subscriptions s where s.user_id = f.user_id)
  ),
  due as (
    select fx.user_id, fx.id as fixture_id, 'prediction'::text as kind
      from fx left join public.eos_notify_prefs p on p.user_id = fx.user_id
     where coalesce(p.prediction, true)
       and fx.ko_exact is not null
       and not fx.has_prediction
       and coalesce(fx.competition, '') <> 'Friendly'
       and p_now >= fx.ko_exact - interval '2 hours' and p_now < fx.ko_exact
    union all
    select fx.user_id, fx.id, 'after_whistle'
      from fx left join public.eos_notify_prefs p on p.user_id = fx.user_id
     where coalesce(p.after_whistle, true)
       and fx.attending in ('went', 'going')
       and not fx.post_done
       and p_now >= fx.ko_any + interval '24 hours' and p_now < fx.ko_any + interval '72 hours'
  ),
  claimed as (
    insert into public.eos_nudges_sent (user_id, fixture_id, kind)
    select d.user_id, d.fixture_id, d.kind from due d
    on conflict do nothing
    returning eos_nudges_sent.user_id, eos_nudges_sent.fixture_id, eos_nudges_sent.kind
  )
  select c.user_id, c.fixture_id, c.kind, f.opposition, f.venue, f.competition, f.kickoff, f.date
    from claimed c
    join public.eos_fixtures f on f.user_id = c.user_id and f.id = c.fixture_id
$$;

revoke all on public.eos_push_subscriptions, public.eos_notify_prefs, public.eos_nudges_sent from anon, authenticated;
grant all on public.eos_push_subscriptions, public.eos_notify_prefs, public.eos_nudges_sent to service_role;
revoke all on function public.eos_save_push_subscription(text, text, text) from public, anon;
revoke all on function public.eos_delete_push_subscription(text) from public, anon;
revoke all on function public.eos_set_notify_prefs(boolean, boolean) from public, anon;
revoke all on function public.eos_get_notify_prefs() from public, anon;
revoke all on function public.eos_take_due_nudges(timestamptz) from public, anon, authenticated;
grant execute on function public.eos_save_push_subscription(text, text, text) to authenticated;
grant execute on function public.eos_delete_push_subscription(text) to authenticated;
grant execute on function public.eos_set_notify_prefs(boolean, boolean) to authenticated;
grant execute on function public.eos_get_notify_prefs() to authenticated;
grant execute on function public.eos_take_due_nudges(timestamptz) to service_role;

notify pgrst, 'reload schema';
