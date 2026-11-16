# Majesty Academy backend setup

This project uses Supabase Auth, Postgres, private Storage and Edge Functions. The OpenAI API key stays server-side in Supabase secrets.

## 1. Create a Supabase project
Create a project at https://supabase.com/dashboard. In SQL Editor, run `supabase/migrations/202611160001_academy_schema.sql`.

## 2. Configure the website
Edit `supabase-config.js` and replace the two placeholders with the Supabase Project URL and anon/public key from Project Settings → API. The anon key is safe to use in browser code with Row Level Security enabled. Never use the service_role key in the website.

## 3. Configure Edge Function secrets
Set these in Supabase Edge Function secrets:
- `OPENAI_API_KEY`: your server-side OpenAI API key
- `OPENAI_MODEL`: optional; defaults to `gpt-6-luna`
- `ALLOWED_ORIGIN`: your deployed school website origin

Supabase supplies `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Edge Functions.

## 4. Deploy the functions
Install the Supabase CLI, sign in and link your project:

```sh
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy ai-tutor
supabase functions deploy review-submission
```

## 5. Enable authentication
In Supabase Authentication, enable email/password sign-in and configure the deployed site URL and redirect URLs. New registrations receive the student role automatically. Public sign-up cannot select teacher/admin roles. Promote trusted staff manually only after verification.

## Included backend
- Student profiles, roles, course catalogue, enrolments and assignments
- Submissions, quiz attempts, attendance and university defence records
- Row Level Security policies and private student-work storage
- Authenticated AI tutor and provisional AI assignment feedback functions
- Student portal account creation/sign-in and live AI tutor invocation after configuration

## Not yet deployed
The source code is committed to GitHub, but no Supabase project has been created, linked or deployed from this repository. The website therefore cannot sign students in or call live AI until the project owner completes the steps above. The assignment form and academic activity list still have browser-local demo behaviour; production assignment workflows must be connected to the database and private storage. AI feedback is provisional and must never be treated as a final grade or disciplinary decision without qualified human review.

Before enrolling real students, configure safeguarding, privacy and retention rules, staff verification, rate limits, monitoring and backups.
