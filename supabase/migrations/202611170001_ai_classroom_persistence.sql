-- Durable AI classroom activity: generated assignments, submissions and exam integrity events.
create table if not exists public.ai_assignments (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.profiles(id) on delete cascade,
 subject text not null,
 level text not null,
 topic text not null,
 title text not null,
 instructions text not null,
 due_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.ai_assignment_submissions (
 id uuid primary key default gen_random_uuid(),
 assignment_id uuid not null references public.ai_assignments(id) on delete cascade,
 student_id uuid not null references public.profiles(id) on delete cascade,
 answer text not null,
 ai_feedback text,
 ai_suggested_score numeric(5,2),
 status text not null default 'submitted' check(status in ('submitted','ai_reviewed','teacher_reviewed')),
 submitted_at timestamptz not null default now(),
 unique(assignment_id,student_id)
);
create table if not exists public.exam_activity_events (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.profiles(id) on delete cascade,
 exam_name text not null,
 subject text,
 event_type text not null,
 event_detail text,
 occurred_at timestamptz not null default now()
);
alter table public.ai_assignments enable row level security;
alter table public.ai_assignment_submissions enable row level security;
alter table public.exam_activity_events enable row level security;
drop policy if exists "Students create own AI assignments" on public.ai_assignments;
create policy "Students create own AI assignments" on public.ai_assignments for insert to authenticated with check(student_id=auth.uid());
drop policy if exists "Students view own AI assignments and staff view all" on public.ai_assignments;
create policy "Students view own AI assignments and staff view all" on public.ai_assignments for select to authenticated using(student_id=auth.uid() or public.is_staff());
drop policy if exists "Students submit own AI assignment" on public.ai_assignment_submissions;
create policy "Students submit own AI assignment" on public.ai_assignment_submissions for insert to authenticated with check(student_id=auth.uid() and exists(select 1 from public.ai_assignments a where a.id=assignment_id and a.student_id=auth.uid()));
drop policy if exists "Students view own AI submissions and staff view all" on public.ai_assignment_submissions;
create policy "Students view own AI submissions and staff view all" on public.ai_assignment_submissions for select to authenticated using(student_id=auth.uid() or public.is_staff());
drop policy if exists "Staff review AI submissions" on public.ai_assignment_submissions;
create policy "Staff review AI submissions" on public.ai_assignment_submissions for update to authenticated using(public.is_staff()) with check(public.is_staff());
drop policy if exists "Students record own exam activity" on public.exam_activity_events;
create policy "Students record own exam activity" on public.exam_activity_events for insert to authenticated with check(student_id=auth.uid());
drop policy if exists "Students and staff view exam activity" on public.exam_activity_events;
create policy "Students and staff view exam activity" on public.exam_activity_events for select to authenticated using(student_id=auth.uid() or public.is_staff());
