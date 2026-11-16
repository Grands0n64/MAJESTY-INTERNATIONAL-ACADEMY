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

## Supabase deployment
The repository is connected to Supabase with the `main` branch configured for production deployment. Pushes to `main` deploy declared database migrations and Edge Functions from `supabase/config.toml`.

## Important status
The repository contains source code, not a live configured school service. Confirm the Supabase production deployment succeeds, verify the database migration and Edge Functions in the Dashboard, and configure the website's Supabase URL and publishable key before using student accounts. Assignment and academic record screens still include local demo behaviour. Do not use real student data until privacy, safeguarding, security, backups and staff access are configured.

The AI assignment feedback endpoint is provisional; teachers must approve official grades.
