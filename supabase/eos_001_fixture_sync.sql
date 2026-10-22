-- ============================================================================
-- Every Other Saturday — fixture sync for The Roost
-- Paste this whole file into Supabase (project "The Goodacres") > SQL Editor >
-- New query, then Run. Run it once.
--
-- Safe alongside The Nest and The Roost: everything here starts with eos_, and
-- nothing belonging to another app is touched.
--
-- What it does
--   * eos_fixtures: a copy of Dom's upcoming EOS fixtures (date, kick-off,
--     opponent, venue, competition, attending status). EOS on his phone is still
--     the master copy; this is only ever overwritten from there.
--   * eos_sync_fixtures(rows): EOS sends its whole upcoming list; this replaces
--     the signed-in user's rows in one go (adds, updates, and removes deleted ones).
--   * eos_partner_fixtures(): what The Roost calls. Returns the Going and Want to go
--     fixtures for you and your Roost partner — nothing else.
-- Both sides need the authenticator-code sign-in (aal2), same as The Roost.
-- ============================================================================

create table if not exists public.eos_fixtures (
  user_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id             text not null,          -- the fixture's id inside EOS
  season         text not null,
  date           date,                   -- null while the date is TBC
  kickoff        text,                   -- "15:00", or null
  opposition     text not null default '',
  venue          text,                   -- H / A / N, or null
  competition    text,
  attending      text not null,          -- none | going | went | sourced | cant
  date_confirmed boolean not null default false,
  updated_at     timestamptz not null default now(),
  primary key (user_id, id)
);
create index if not exists eos_fixtures_user_date_idx on public.eos_fixtures (user_id, date);

create or replace function public.eos_is_aal2() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
$$;

alter table public.eos_fixtures enable row level security;

drop policy if exists "eos fixtures: own rows read" on public.eos_fixtures;
create policy "eos fixtures: own rows read" on public.eos_fixtures
  for select to authenticated
  using (public.eos_is_aal2() and user_id = auth.uid());

-- Writes only go through eos_sync_fixtures below, so no insert/update/delete policies.

-- EOS hands over its full upcoming list as a JSON array; this makes the table match it.
create or replace function public.eos_sync_fixtures(p_rows jsonb) returns integer
language plpgsql security definer set search_path = public as $$
declare
  n integer;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if not public.eos_is_aal2() then raise exception 'mfa_required'; end if;
  if jsonb_typeof(p_rows) <> 'array' then raise exception 'bad_payload'; end if;

  -- anything EOS no longer lists as upcoming (deleted, or the game's been played) goes
  delete from public.eos_fixtures f
   where f.user_id = auth.uid()
     and not exists (select 1 from jsonb_array_elements(p_rows) r where r ->> 'id' = f.id);

  insert into public.eos_fixtures as f (user_id, id, season, date, kickoff, opposition, venue, competition, attending, date_confirmed, updated_at)
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
         now()
    from jsonb_array_elements(p_rows) r
   where coalesce(r ->> 'id', '') <> ''
  on conflict (user_id, id) do update set
         season = excluded.season, date = excluded.date, kickoff = excluded.kickoff,
         opposition = excluded.opposition, venue = excluded.venue, competition = excluded.competition,
         attending = excluded.attending, date_confirmed = excluded.date_confirmed, updated_at = now()
   where (f.season, f.date, f.kickoff, f.opposition, f.venue, f.competition, f.attending, f.date_confirmed)
         is distinct from
         (excluded.season, excluded.date, excluded.kickoff, excluded.opposition, excluded.venue, excluded.competition, excluded.attending, excluded.date_confirmed);

  select count(*) into n from public.eos_fixtures where user_id = auth.uid();
  return n;
end $$;

-- For The Roost calendar: Going (firm) and Want to go (provisional), for you and your partner.
-- 'none' on a game that hasn't happened yet is EOS's "Want to go".
create or replace function public.eos_partner_fixtures()
returns table (
  owner_id uuid, id text, season text, date date, kickoff text, opposition text,
  venue text, competition text, date_confirmed boolean, status text, updated_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select f.user_id, f.id, f.season, f.date, f.kickoff, f.opposition, f.venue, f.competition,
         f.date_confirmed,
         case f.attending when 'going' then 'going' else 'want_to_go' end,
         f.updated_at
    from public.eos_fixtures f
   where public.eos_is_aal2()
     and f.user_id in (auth.uid(), public.roost_partner_id())
     and f.attending in ('going', 'none')
     and (f.date is null or f.date >= current_date)
   order by f.date nulls last, f.kickoff nulls last
$$;

revoke all on public.eos_fixtures from anon;
revoke all on function public.eos_sync_fixtures(jsonb) from public, anon;
revoke all on function public.eos_partner_fixtures() from public, anon;
grant usage on schema public to authenticated;
grant select on public.eos_fixtures to authenticated;
grant all on public.eos_fixtures to service_role;
grant execute on function public.eos_is_aal2() to authenticated;
grant execute on function public.eos_sync_fixtures(jsonb) to authenticated;
grant execute on function public.eos_partner_fixtures() to authenticated;

notify pgrst, 'reload schema';
