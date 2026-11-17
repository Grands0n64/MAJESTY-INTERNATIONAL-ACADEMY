-- Majesty International Academy: structured exam practice and university defence records
create table if not exists public.exam_practice_attempts (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.profiles(id) on delete cascade,
 exam_type text not null check (exam_type in ('School practice','WAEC','NECO','JAMB','Common Entrance')),
 subject text not null,
 level text not null,
 paper text not null,
 answers text,
 feedback text,
 status text not null default 'in_progress' check(status in ('in_progress','reviewed','submitted')),
 created_at timestamptz not null default now(),
 completed_at timestamptz
);
create table if not exists public.university_defences (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.profiles(id) on delete cascade,
 level text not null check(level in ('200 Level','300 Level','400 Level')),
 defence_type text not null check(defence_type in ('oral','written','proposal')),
 course text not null,
 project_title text not null,
 transcript jsonb not null default '[]'::jsonb,
 report text,
 status text not null default 'in_progress' check(status in ('in_progress','completed','reviewed')),
 created_at timestamptz not null default now(),
 completed_at timestamptz
);
alter table public.exam_practice_attempts enable row level security;
alter table public.university_defences enable row level security;
drop policy if exists "Students create own exam practice attempts" on public.exam_practice_attempts;
create policy "Students create own exam practice attempts" on public.exam_practice_attempts for insert to authenticated with check(student_id=auth.uid());
drop policy if exists "Students view own exam practice attempts and staff view all" on public.exam_practice_attempts;
create policy "Students view own exam practice attempts and staff view all" on public.exam_practice_attempts for select to authenticated using(student_id=auth.uid() or public.is_staff());
drop policy if exists "Students update own exam practice attempts" on public.exam_practice_attempts;
create policy "Students update own exam practice attempts" on public.exam_practice_attempts for update to authenticated using(student_id=auth.uid()) with check(student_id=auth.uid());
drop policy if exists "Students create own university defences" on public.university_defences;
create policy "Students create own university defences" on public.university_defences for insert to authenticated with check(student_id=auth.uid());
drop policy if exists "Students view own university defences and staff view all" on public.university_defences;
create policy "Students view own university defences and staff view all" on public.university_defences for select to authenticated using(student_id=auth.uid() or public.is_staff());
drop policy if exists "Students update own university defences" on public.university_defences;
create policy "Students update own university defences" on public.university_defences for update to authenticated using(student_id=auth.uid()) with check(student_id=auth.uid());
