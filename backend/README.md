# Majesty Academy backend setup

The public website is hosted separately from the private backend. This backend uses Supabase (Auth, Postgres, private Storage, Edge Functions) and the OpenAI Responses API. The AI key is kept only in Supabase secrets; never put it in browser JavaScript or commit it to GitHub.

## 1. Create the Supabase project
Create a project at https://supabase.com/dashboard. In SQL Editor, run the complete migration at `supabase/migrations/202611160001_academy_schema.sql`.

## 2. Configure the backend secrets
In the Supabase project settings / Edge Function secrets, set:
- `OPENAI_API_KEY`: your server-side OpenAI API key
- `OPENAI_MODEL`: optional; defaults to `gpt-6-luna`
- `ALLOWED_ORIGIN`: your deployed school website origin (for example, your GitHub Pages origin)

Supabase supplies `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Edge Functions. Do not expose a service-role key in the website.

## 3. Deploy the functions
Install the Supabase CLI, sign in, link your project, then run:

```sh
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy ai-tutor
supabase functions deploy review-submission
```

## 4. Enable accounts
In Supabase Authentication, configure email sign-in and your allowed redirect URLs. New users get a student profile by default. Do not allow public sign-up to select the teacher/admin role. Promote trusted staff manually from the Supabase dashboard after verifying their identity.

## 5. What is included
- Auth-linked student profiles with role-based access
- Course catalogue, enrolments, assignments, submissions, quiz attempts, attendance and university defence records
- Row Level Security policies for student-owned records and staff access
- Private student-work bucket with per-student folders
- Authenticated AI tutor function
- Authenticated AI assignment feedback function; its score is explicitly provisional and requires teacher review

## Important safeguards
This is a backend implementation scaffold, not a deployed/connected service. A Supabase project and valid OpenAI API key are required before it can run. The current static student portal still uses local browser storage; the next frontend integration step must connect Supabase Auth and replace local-only saves with authenticated database calls. Configure school privacy, child safeguarding, retention, staff verification, rate limits and backups before enrolling real students. AI must not make final high-stakes grading or disciplinary decisions without qualified human review.
