-- Majesty International Academy: initial secure database schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  level text check (level is null or level in ('JSS 1','JSS 2','JSS 3','SS 1','SS 2','SS 3','100 Level','200 Level','300 Level','400 Level')),
  role text not null default 'student' check (role in ('student','teacher','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  code text,
  title text not null,
  level text not null,
  faculty text,
  department text,
  semester text check (semester is null or semester in ('First','Second','Full Year')),
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique(student_id,course_id)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  instructions text not null,
  due_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  answer text not null,
  attachment_path text,
  ai_feedback text,
  ai_suggested_score numeric(5,2),
  score numeric(5,2),
  status text not null default 'submitted' check (status in ('submitted','ai_reviewed','teacher_reviewed','returned')),
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id) on delete set null,
  unique(assignment_id,student_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  quiz_title text not null,
  score numeric(5,2) not null,
  total numeric(5,2) not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  attendance_date date not null default current_date,
  status text not null check (status in ('present','late','absent','excused')),
  recorded_by uuid references public.profiles(id) on delete set null,
  unique(student_id,course_id,attendance_date)
);

create table if not exists public.defences (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  scheduled_at timestamptz,
  questions jsonb not null default '[]'::jsonb,
  report text,
  score numeric(5,2),
  status text not null default 'scheduled' check (status in ('scheduled','in_progress','completed','reviewed')),
  examiner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('teacher','admin')); $$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id,full_name,level)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),new.raw_user_meta_data->>'level')
  on conflict(id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.attendance enable row level security;
alter table public.defences enable row level security;

create policy "Profiles view own or staff" on public.profiles for select to authenticated using (id = auth.uid() or public.is_staff());
create policy "Students update own basic profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.prevent_role_escalation()
returns trigger language plpgsql security definer set search_path = public
as $role_guard$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an administrator may change account roles';
  end if;
  return new;
end;
$role_guard$;
drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role before update on public.profiles
for each row execute procedure public.prevent_role_escalation();
create policy "Admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Authenticated users view active courses" on public.courses for select to authenticated using (active or public.is_staff());
create policy "Staff manage courses" on public.courses for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "Students view own enrollments" on public.enrollments for select to authenticated using (student_id = auth.uid() or public.is_staff());
create policy "Staff manage enrollments" on public.enrollments for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "Students and staff view assignments" on public.assignments for select to authenticated using (public.is_staff() or exists(select 1 from public.enrollments e where e.course_id = assignments.course_id and e.student_id = auth.uid()));
create policy "Staff manage assignments" on public.assignments for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "Students view own submissions and staff view all" on public.submissions for select to authenticated using (student_id = auth.uid() or public.is_staff());
create policy "Students submit own work" on public.submissions for insert to authenticated with check (student_id = auth.uid());
create policy "Students edit own unreviewed submission" on public.submissions for update to authenticated using (student_id = auth.uid() and status = 'submitted') with check (student_id = auth.uid() and status = 'submitted');
create policy "Staff review submissions" on public.submissions for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "Students view own quiz attempts" on public.quiz_attempts for select to authenticated using (student_id = auth.uid() or public.is_staff());
create policy "Students save own quiz attempts" on public.quiz_attempts for insert to authenticated with check (student_id = auth.uid());

create policy "Students view own attendance" on public.attendance for select to authenticated using (student_id = auth.uid() or public.is_staff());
create policy "Staff manage attendance" on public.attendance for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "Students view own defences" on public.defences for select to authenticated using (student_id = auth.uid() or public.is_staff());
create policy "Staff manage defences" on public.defences for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Private bucket for assignment evidence and student uploads.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('student-work','student-work',false,10485760,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do nothing;

create policy "Students upload into own folder" on storage.objects for insert to authenticated
with check (bucket_id = 'student-work' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Students read own files and staff read all" on storage.objects for select to authenticated
using (bucket_id = 'student-work' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff()));
create policy "Students delete own files" on storage.objects for delete to authenticated
using (bucket_id = 'student-work' and (storage.foldername(name))[1] = auth.uid()::text);
