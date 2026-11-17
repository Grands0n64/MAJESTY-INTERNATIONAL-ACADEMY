-- Fix student profile permissions for authenticated accounts.
-- Students can read and update only their own profile.
grant select, insert, update on table public.profiles to authenticated;

drop policy if exists "Students create own profile" on public.profiles;
create policy "Students create own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() and role = 'student');

drop policy if exists "Profiles view own or staff" on public.profiles;
create policy "Profiles view own or staff"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_staff());

drop policy if exists "Students update own basic profile" on public.profiles;
create policy "Students update own basic profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Prevent a student from changing their role; existing trigger
-- prevent_role_escalation() remains the final safeguard.
