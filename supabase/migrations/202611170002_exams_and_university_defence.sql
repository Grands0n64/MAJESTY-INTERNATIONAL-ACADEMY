-- Examination preparation and university defence workflows
create table if not exists public.exam_practice_attempts (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.profiles(id) on delete cascade,
 exam_type text not null check(exam_type in ('WAEC','NECO','JAMB','COMMON_ENTRANCE','UNIVERSITY')),
 subject text not null,
 level text not null,
 paper text not null,
 answers text,
 ai_feedback text,
 score numeric(5,2),
 started_at timestamptz not null default now(),
 submitted_at timestamptz
);
create table if not exists public.university_defences (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.profiles(id) on delete cascade,
 level text not null check(level in ('200 Level','300 Level','400 Level')),
 department text not null,
 project_title text not null,
 scheduled_at timestamptz,
 status text not null default 'scheduled' check(status in ('scheduled','in_progress','completed','rescheduled')),
 examiner_notes text,
 created_at timestamptz not null default now()
);
create table if not exists public.defence_sessions (
 id uuid primary key default gen_random_uuid(),
 defence_id uuid not null references public.university_defences(id) on delete cascade,
 student_id uuid not null references public.profiles(id) on delete cascade,
 questions jsonb not null default '[]'::jsonb,
 responses jsonb not null default '[]'::jsonb,
 ai_assessment text,
 provisional_score numeric(5,2),
 report text,
 completed_at timestamptz,
 created_at timestamptz not null default now()
);
alter table public.exam_practice_attempts enable row level security;
alter table public.university_defences enable row level security;
alter table public.defence_sessions enable row level security;
drop policy if exists "Students manage own exam practice" on public.exam_practice_attempts;
create policy "Students manage own exam practice" on public.exam_practice_attempts for all to authenticated using(student_id=auth.uid() or public.is_staff()) with check(student_id=auth.uid() or public.is_staff());
drop policy if exists "Students view own defences and staff manage all" on public.university_defences;
create policy "Students view own defences and staff manage all" on public.university_defences for select to authenticated using(student_id=auth.uid() or public.is_staff());
drop policy if exists "Staff schedule university defences" on public.university_defences;
create policy "Staff schedule university defences" on public.university_defences for all to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists "Students view own defence sessions and staff manage all" on public.defence_sessions;
create policy "Students view own defence sessions and staff manage all" on public.defence_sessions for select to authenticated using(student_id=auth.uid() or public.is_staff());
drop policy if exists "Students create own defence sessions" on public.defence_sessions;
create policy "Students create own defence sessions" on public.defence_sessions for insert to authenticated with check(student_id=auth.uid() and exists(select 1 from public.university_defences d where d.id=defence_id and d.student_id=auth.uid()));
drop policy if exists "Students update own defence sessions" on public.defence_sessions;
create policy "Students update own defence sessions" on public.defence_sessions for update to authenticated using(student_id=auth.uid() or public.is_staff()) with check(student_id=auth.uid() or public.is_staff());
\n-- Permit students to submit their own project for staff scheduling.\ndrop policy if exists "Students register own project defence" on public.university_defences;\ncreate policy "Students register own project defence" on public.university_defences for insert to authenticated with check(student_id=auth.uid());\n