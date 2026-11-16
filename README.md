# Majesty International Academy

**Excellence Without Limits.**

A responsive front-end foundation and backend scaffold for a digital academy serving:
- Junior Secondary: JSS 1–3
- Senior Secondary: SS 1–3
- University: 100–400 Level

## Website
- `index.html`: public homepage
- `portal.html`: student learning portal
- `curriculum.js`: secondary curriculum starter and sample university course catalogue
- `portal.js` / `portal-auth.js`: student portal interactions and Supabase authentication / AI tutor integration
- `styles.css` / `portal.css`: responsive styling

## Backend
Supabase schema, row-level security, private student uploads and Edge Functions are in `supabase/`. Read [backend setup instructions](backend/README.md) before configuring the project.

## Important status
The repository contains source code, not a live configured school service. A Supabase project, database migration, Edge Function deployment and API secrets are still required to activate accounts and live AI. Assignment and academic record screens still include local demo behaviour. Do not use real student data until privacy, safeguarding, security, backups and staff access are configured.

The AI assignment feedback endpoint is provisional; teachers must approve official grades.
