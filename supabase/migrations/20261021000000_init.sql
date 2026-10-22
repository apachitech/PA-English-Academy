-- =====================================================================
-- SpeakUp Congo — initial schema
-- Conventions:
--   * All learner-owned writes (attempts, progress, XP, certificates) are
--     performed server-side (service role) after the server re-validates and
--     re-scores. Learners can only SELECT their own rows via RLS.
--   * Content is readable by everyone when status = 'published'; staff
--     (teacher/admin) can read/write everything.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------------------------------------------------
create type public.user_role       as enum ('learner', 'teacher', 'admin');
create type public.content_status  as enum ('draft', 'published', 'archived');
create type public.cefr_level      as enum ('A1', 'A2', 'B1', 'B2');
create type public.skill           as enum ('vocabulary', 'grammar', 'reading', 'listening', 'speaking');
create type public.exercise_type   as enum (
  'multiple_choice', 'fill_blank', 'matching', 'word_order', 'listen_choose', 'speaking'
);
create type public.progress_status as enum ('in_progress', 'completed');
create type public.exam_kind       as enum ('unit', 'level');
create type public.video_provider  as enum ('youtube', 'mp4', 'hls', 'bunny', 'cloudflare');
create type public.attempt_status  as enum ('in_progress', 'completed', 'abandoned');
create type public.payment_status  as enum ('pending', 'succeeded', 'failed', 'refunded', 'cancelled');
create type public.payment_method  as enum ('mpesa', 'airtel_money', 'orange_money', 'card', 'mock');
create type public.subscription_status as enum ('active', 'past_due', 'cancelled', 'expired');

-- ---------- Utility --------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- Profiles -------------------------------------------------
create table public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  full_name           text not null default '',
  role                public.user_role not null default 'learner',
  city                text,
  locale              text not null default 'fr',
  current_level       public.cefr_level,
  onboarding_done     boolean not null default false,
  daily_goal_minutes  smallint not null default 10 check (daily_goal_minutes in (5, 10, 15, 20)),
  data_saver          boolean not null default false,
  leaderboard_opt_in  boolean not null default true,
  total_xp            integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Role helpers (security definer so they can be used inside RLS policies
-- without recursive policy evaluation).
create or replace function public.current_role_name()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('teacher', 'admin') from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false)
$$;

-- Prevent privilege escalation: only admins (or the service role) may change
-- role / total_xp.
create or replace function public.guard_profile_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.role() = 'service_role' or public.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role or new.total_xp is distinct from old.total_xp then
    raise exception 'Not allowed to modify protected profile fields';
  end if;
  return new;
end $$;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

-- Auto-create profile on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  );
  insert into public.streaks (user_id) values (new.id);
  return new;
end $$;

-- ---------- Content: levels / units / lessons ------------------------
create table public.levels (
  id              uuid primary key default gen_random_uuid(),
  code            public.cefr_level not null unique,
  title_fr        text not null,
  description_fr  text not null default '',
  position        smallint not null,
  is_free         boolean not null default false,
  price_usd_cents integer not null default 0,
  status          public.content_status not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger levels_updated_at before update on public.levels
  for each row execute function public.set_updated_at();

create table public.units (
  id              uuid primary key default gen_random_uuid(),
  level_id        uuid not null references public.levels (id) on delete cascade,
  title_fr        text not null,
  description_fr  text not null default '',
  icon            text not null default 'book',
  position        smallint not null,
  status          public.content_status not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (level_id, position) deferrable initially deferred
);
create index units_level_idx on public.units (level_id, position);
create trigger units_updated_at before update on public.units
  for each row execute function public.set_updated_at();

create table public.lessons (
  id              uuid primary key default gen_random_uuid(),
  unit_id         uuid not null references public.units (id) on delete cascade,
  slug            text not null unique,
  title_fr        text not null,
  title_en        text not null default '',
  objective_fr    text not null default '',
  explanation_fr  text not null default '',  -- markdown grammar/usage notes in French
  position        smallint not null,
  xp_reward       smallint not null default 20,
  est_minutes     smallint not null default 10,
  pass_mark       smallint not null default 70 check (pass_mark between 0 and 100),
  status          public.content_status not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (unit_id, position) deferrable initially deferred
);
create index lessons_unit_idx on public.lessons (unit_id, position);
create trigger lessons_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();

create table public.lesson_videos (
  id              uuid primary key default gen_random_uuid(),
  lesson_id       uuid not null references public.lessons (id) on delete cascade,
  provider        public.video_provider not null,
  url             text not null,           -- standard quality / YouTube id or URL
  low_url         text,                    -- low-data rendition (e.g. 240p MP4)
  audio_url       text,                    -- audio-only rendition
  poster_url      text,
  duration_s      integer not null default 0,
  -- [{ "lang": "en", "label": "English", "url": "/captions/x.en.vtt" }, ...]
  captions        jsonb not null default '[]'::jsonb,
  transcript_fr   text,
  position        smallint not null default 1,
  created_at      timestamptz not null default now()
);
create index lesson_videos_lesson_idx on public.lesson_videos (lesson_id, position);

create table public.vocabulary (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references public.lessons (id) on delete cascade,
  term_en     text not null,
  term_fr     text not null,
  example_en  text,
  example_fr  text,
  audio_url   text,   -- if null, client falls back to speechSynthesis
  position    smallint not null default 0
);
create index vocabulary_lesson_idx on public.vocabulary (lesson_id, position);

-- ---------- Exams ----------------------------------------------------
create table public.exams (
  id              uuid primary key default gen_random_uuid(),
  kind            public.exam_kind not null,
  level_id        uuid not null references public.levels (id) on delete cascade,
  unit_id         uuid references public.units (id) on delete cascade,
  title_fr        text not null,
  pass_mark       smallint not null default 75 check (pass_mark between 0 and 100),
  time_limit_min  smallint,
  status          public.content_status not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check ((kind = 'unit' and unit_id is not null) or (kind = 'level' and unit_id is null))
);
create unique index exams_unit_unique on public.exams (unit_id) where kind = 'unit';
create unique index exams_level_unique on public.exams (level_id) where kind = 'level';
create trigger exams_updated_at before update on public.exams
  for each row execute function public.set_updated_at();

-- ---------- Exercises (lesson practice OR exam question) -------------
-- payload shapes (validated by Zod in the app):
--  multiple_choice / listen_choose : { "audio_text"?: string }
--  fill_blank : { "sentence": "My name ___ Patrick.", "answers": ["is"], "hint_fr"?: string }
--  word_order : { "tokens": ["I","am","from","Goma"], "answer": "I am from Goma" }
--  matching   : {} (pairs are exercise_options with pair_key)
--  speaking   : { "target_en": "Good morning, Mama Nsimba!", "tip_fr": "..." }
create table public.exercises (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid references public.lessons (id) on delete cascade,
  exam_id     uuid references public.exams (id) on delete cascade,
  type        public.exercise_type not null,
  skill       public.skill not null,
  prompt_fr   text not null,
  prompt_en   text,
  payload     jsonb not null default '{}'::jsonb,
  audio_url   text,
  explanation_fr text,
  position    smallint not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check ((lesson_id is not null)::int + (exam_id is not null)::int = 1)
);
create index exercises_lesson_idx on public.exercises (lesson_id, position);
create index exercises_exam_idx on public.exercises (exam_id, position);
create trigger exercises_updated_at before update on public.exercises
  for each row execute function public.set_updated_at();

create table public.exercise_options (
  id          uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  label       text not null,
  is_correct  boolean not null default false,
  pair_key    text,   -- matching: options sharing pair_key belong together
  side        text check (side in ('left', 'right')),
  position    smallint not null default 0
);
create index exercise_options_ex_idx on public.exercise_options (exercise_id, position);

-- ---------- Placement test -------------------------------------------
create table public.placement_questions (
  id            uuid primary key default gen_random_uuid(),
  level         public.cefr_level not null,
  skill         public.skill not null,
  type          public.exercise_type not null default 'multiple_choice',
  prompt_fr     text not null,               -- instruction in French
  stem          text not null,               -- English content
  passage       text,                        -- reading passage
  audio_text    text,                        -- listening (TTS fallback)
  audio_url     text,
  options       jsonb not null,              -- ["is","are","am","be"]
  correct_index smallint not null,
  status        public.content_status not null default 'published',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index placement_questions_level_idx on public.placement_questions (level, skill) where status = 'published';
create trigger placement_questions_updated_at before update on public.placement_questions
  for each row execute function public.set_updated_at();

create table public.placement_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  status        public.attempt_status not null default 'in_progress',
  -- [{ question_id, level, skill, chosen_index, correct, answered_at }]
  answers       jsonb not null default '[]'::jsonb,
  current_question_id uuid references public.placement_questions (id),
  result_level  public.cefr_level,
  skill_scores  jsonb,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz
);
create index placement_attempts_user_idx on public.placement_attempts (user_id, started_at desc);

-- ---------- Progress & attempts --------------------------------------
create table public.user_progress (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  lesson_id     uuid not null references public.lessons (id) on delete cascade,
  status        public.progress_status not null default 'in_progress',
  best_score    smallint not null default 0,
  attempts      integer not null default 0,
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.lesson_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  lesson_id   uuid not null references public.lessons (id) on delete cascade,
  score       smallint not null check (score between 0 and 100),
  passed      boolean not null,
  answers     jsonb not null default '[]'::jsonb,
  skill_scores jsonb,
  duration_s  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index lesson_attempts_user_idx on public.lesson_attempts (user_id, created_at desc);
create index lesson_attempts_lesson_idx on public.lesson_attempts (lesson_id);

create table public.exam_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  exam_id     uuid not null references public.exams (id) on delete cascade,
  score       smallint not null check (score between 0 and 100),
  passed      boolean not null,
  answers     jsonb not null default '[]'::jsonb,
  duration_s  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index exam_attempts_user_idx on public.exam_attempts (user_id, created_at desc);

-- ---------- Certificates ---------------------------------------------
create table public.certificates (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique,        -- public id, e.g. SUC-A2-7KQ9-X3PD
  user_id         uuid not null references public.profiles (id) on delete cascade,
  level_id        uuid not null references public.levels (id),
  exam_attempt_id uuid references public.exam_attempts (id),
  learner_name    text not null,
  level_code      public.cefr_level not null,
  score           smallint not null,
  issued_at       timestamptz not null default now(),
  revoked_at      timestamptz,
  unique (user_id, level_id)
);

-- Public verification: exposes only safe fields, callable by anon.
create or replace function public.verify_certificate(p_code text)
returns table (code text, learner_name text, level_code public.cefr_level, score smallint,
               issued_at timestamptz, revoked boolean)
language sql stable security definer set search_path = public as $$
  select c.code, c.learner_name, c.level_code, c.score, c.issued_at, c.revoked_at is not null
  from public.certificates c
  where c.code = upper(trim(p_code))
$$;

-- ---------- Gamification ---------------------------------------------
create table public.streaks (
  user_id           uuid primary key references public.profiles (id) on delete cascade,
  current_streak    integer not null default 0,
  longest_streak    integer not null default 0,
  last_active_date  date,
  freezes           smallint not null default 0,
  updated_at        timestamptz not null default now()
);

create table public.xp_events (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  amount      integer not null,
  source      text not null,   -- 'lesson', 'exam', 'placement', 'streak_bonus', 'badge'
  ref_id      uuid,
  created_at  timestamptz not null default now()
);
create index xp_events_user_time_idx on public.xp_events (user_id, created_at desc);
create index xp_events_time_idx on public.xp_events (created_at);

-- Minutes studied per local day (Africa/Kinshasa or Africa/Lubumbashi).
create table public.daily_activity (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  day         date not null,
  seconds     integer not null default 0,
  xp          integer not null default 0,
  lessons     integer not null default 0,
  primary key (user_id, day)
);

create table public.badges (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  title_fr    text not null,
  description_fr text not null,
  icon        text not null default 'award',
  -- e.g. { "type": "streak", "value": 7 } | { "type": "lessons", "value": 10 }
  criteria    jsonb not null,
  position    smallint not null default 0
);

create table public.user_badges (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  badge_id    uuid not null references public.badges (id) on delete cascade,
  earned_at   timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- Weekly leaderboard (Monday-start week, Kinshasa time). Only opted-in users.
create or replace function public.weekly_leaderboard(p_limit int default 20)
returns table (user_id uuid, full_name text, city text, xp bigint)
language sql stable security definer set search_path = public as $$
  select p.id, split_part(p.full_name, ' ', 1) || coalesce(' ' || left(split_part(p.full_name, ' ', 2), 1) || '.', ''),
         p.city, sum(e.amount)::bigint as xp
  from public.xp_events e
  join public.profiles p on p.id = e.user_id
  where p.leaderboard_opt_in
    and e.created_at >= date_trunc('week', now() at time zone 'Africa/Kinshasa') at time zone 'Africa/Kinshasa'
  group by p.id
  order by xp desc
  limit least(greatest(p_limit, 1), 100)
$$;

-- ---------- Monetisation ---------------------------------------------
create table public.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles (id) on delete cascade,
  plan                text not null,           -- 'monthly' | 'yearly'
  status              public.subscription_status not null default 'active',
  provider            text not null default 'mock',
  provider_ref        text,
  current_period_end  timestamptz not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index subscriptions_user_idx on public.subscriptions (user_id);

-- An entitlement grants access to one level (level_id) or all (level_id null).
create table public.entitlements (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  level_id    uuid references public.levels (id) on delete cascade,
  source      text not null,   -- 'purchase' | 'subscription' | 'grant' | 'promo'
  source_ref  uuid,
  valid_until timestamptz,     -- null = lifetime
  created_at  timestamptz not null default now()
);
create index entitlements_user_idx on public.entitlements (user_id);

create table public.payments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  provider      text not null,            -- 'mock' | 'flutterwave' | 'cinetpay'
  method        public.payment_method not null,
  product       text not null,            -- 'level:A2' | 'sub:monthly'
  amount_cents  integer not null,
  currency      text not null default 'USD',
  status        public.payment_status not null default 'pending',
  provider_ref  text unique,
  phone         text,
  raw           jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index payments_user_idx on public.payments (user_id, created_at desc);

-- Signup trigger (defined after streaks exists)
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles            enable row level security;
alter table public.levels              enable row level security;
alter table public.units               enable row level security;
alter table public.lessons             enable row level security;
alter table public.lesson_videos       enable row level security;
alter table public.vocabulary          enable row level security;
alter table public.exams               enable row level security;
alter table public.exercises           enable row level security;
alter table public.exercise_options    enable row level security;
alter table public.placement_questions enable row level security;
alter table public.placement_attempts  enable row level security;
alter table public.user_progress       enable row level security;
alter table public.lesson_attempts     enable row level security;
alter table public.exam_attempts       enable row level security;
alter table public.certificates        enable row level security;
alter table public.streaks             enable row level security;
alter table public.xp_events           enable row level security;
alter table public.daily_activity      enable row level security;
alter table public.badges              enable row level security;
alter table public.user_badges         enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.entitlements        enable row level security;
alter table public.payments            enable row level security;

-- Profiles
create policy "profiles: read own or staff" on public.profiles
  for select using (id = auth.uid() or public.is_staff());
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles: admin all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- Published content readable by everyone (anon included, so the landing
-- page and offline cache can show the course map); staff manage all.
create policy "levels: read published" on public.levels
  for select using (status = 'published' or public.is_staff());
create policy "levels: staff write" on public.levels
  for all using (public.is_staff()) with check (public.is_staff());

create policy "units: read published" on public.units
  for select using (status = 'published' or public.is_staff());
create policy "units: staff write" on public.units
  for all using (public.is_staff()) with check (public.is_staff());

create policy "lessons: read published" on public.lessons
  for select using (status = 'published' or public.is_staff());
create policy "lessons: staff write" on public.lessons
  for all using (public.is_staff()) with check (public.is_staff());

create policy "lesson_videos: read with lesson" on public.lesson_videos
  for select using (
    public.is_staff() or exists (
      select 1 from public.lessons l where l.id = lesson_id and l.status = 'published'));
create policy "lesson_videos: staff write" on public.lesson_videos
  for all using (public.is_staff()) with check (public.is_staff());

create policy "vocabulary: read with lesson" on public.vocabulary
  for select using (
    public.is_staff() or exists (
      select 1 from public.lessons l where l.id = lesson_id and l.status = 'published'));
create policy "vocabulary: staff write" on public.vocabulary
  for all using (public.is_staff()) with check (public.is_staff());

create policy "exams: read published" on public.exams
  for select using (status = 'published' or public.is_staff());
create policy "exams: staff write" on public.exams
  for all using (public.is_staff()) with check (public.is_staff());

-- Practice exercises (with answer keys) are readable for instant, offline
-- feedback. EXAM questions are NOT readable by learners; the server serves
-- them without answers and scores them.
create policy "exercises: read lesson practice" on public.exercises
  for select using (
    public.is_staff() or (lesson_id is not null and exists (
      select 1 from public.lessons l where l.id = lesson_id and l.status = 'published')));
create policy "exercises: staff write" on public.exercises
  for all using (public.is_staff()) with check (public.is_staff());

create policy "exercise_options: read lesson practice" on public.exercise_options
  for select using (
    public.is_staff() or exists (
      select 1 from public.exercises e join public.lessons l on l.id = e.lesson_id
      where e.id = exercise_id and l.status = 'published'));
create policy "exercise_options: staff write" on public.exercise_options
  for all using (public.is_staff()) with check (public.is_staff());

-- Placement bank: staff only (served by server without answers).
create policy "placement_questions: staff" on public.placement_questions
  for all using (public.is_staff()) with check (public.is_staff());

-- Learner-owned data: read own; staff read all; writes via service role.
create policy "placement_attempts: read own" on public.placement_attempts
  for select using (user_id = auth.uid() or public.is_staff());
create policy "user_progress: read own" on public.user_progress
  for select using (user_id = auth.uid() or public.is_staff());
create policy "lesson_attempts: read own" on public.lesson_attempts
  for select using (user_id = auth.uid() or public.is_staff());
create policy "exam_attempts: read own" on public.exam_attempts
  for select using (user_id = auth.uid() or public.is_staff());
create policy "certificates: read own" on public.certificates
  for select using (user_id = auth.uid() or public.is_staff());
create policy "certificates: admin write" on public.certificates
  for all using (public.is_admin()) with check (public.is_admin());
create policy "streaks: read own" on public.streaks
  for select using (user_id = auth.uid() or public.is_staff());
create policy "xp_events: read own" on public.xp_events
  for select using (user_id = auth.uid() or public.is_staff());
create policy "daily_activity: read own" on public.daily_activity
  for select using (user_id = auth.uid() or public.is_staff());
create policy "badges: read all" on public.badges
  for select using (true);
create policy "badges: staff write" on public.badges
  for all using (public.is_staff()) with check (public.is_staff());
create policy "user_badges: read own" on public.user_badges
  for select using (user_id = auth.uid() or public.is_staff());
create policy "subscriptions: read own" on public.subscriptions
  for select using (user_id = auth.uid() or public.is_admin());
create policy "entitlements: read own" on public.entitlements
  for select using (user_id = auth.uid() or public.is_admin());
create policy "entitlements: admin write" on public.entitlements
  for all using (public.is_admin()) with check (public.is_admin());
create policy "payments: read own" on public.payments
  for select using (user_id = auth.uid() or public.is_admin());

-- Function grants
revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
revoke all on function public.weekly_leaderboard(int) from public;
grant execute on function public.weekly_leaderboard(int) to authenticated;
