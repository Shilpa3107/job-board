# Job Board

A job board API built as a technical assessment project. Employers post jobs; candidates browse, search, and apply.

## Status: Backend complete and tested. UI not built (time constraint — see below).

## Stack
Next.js 16 (App Router, API routes) + TypeScript, PostgreSQL (Neon) via Prisma 7, custom auth (bcrypt + JWT sessions via `jose`), deployed on Vercel.

## What's built and verified
- Signup/login/logout/session-check, with hashed passwords and HttpOnly JWT cookies
- Employer-only job posting; public browse/search/filter (keyword, location, job type)
- Candidate-only job applications, with duplicate-application prevention at the DB level
- Ownership-based authorization: employers can only view applicants for jobs *they* posted
- Every endpoint manually tested for both success and failure paths (auth, role, ownership, validation)

## What's explicitly NOT built, and why
- **No frontend UI.** This was a time-boxed assessment; priority was a correct, secure, well-tested backend over a rushed, unverified UI. All functionality is reachable and testable via the API.
- **No automated test suite** (Vitest/Playwright) — endpoints were verified manually via curl, not via committed test code, due to time.
- **No OAuth** — email/password only.
- **No server-side session revocation** — sessions are stateless JWTs; logout clears the cookie but a stolen token remains valid until natural expiry (7 days).
- **No rate-limiting** on login attempts.

## Running locally
1. `npm install`
2. Set `DATABASE_URL` and `SESSION_SECRET` in `.env`
3. `npx prisma generate && npx prisma migrate deploy`
4. `npm run dev`

## API endpoints
- `POST /api/auth/signup`, `/login`, `/logout`, `GET /api/auth/me`
- `POST /api/jobs` (employer only), `GET /api/jobs` (public, supports `?keyword=&location=&jobType=`)
- `POST /api/jobs/[jobId]/apply` (candidate only), `GET /api/jobs/[jobId]/applicants` (job owner only)
