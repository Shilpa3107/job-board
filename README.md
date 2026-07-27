# Job Board

A job board built as a technical assessment project. Employers post open
roles; candidates browse, search, and apply. Employers can view and manage
applicants for jobs they've posted.

**Live app:** https://job-board-po7p.vercel.app/
**Repo:** https://github.com/Shilpa3107/job-board/

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **Database:** PostgreSQL (Neon, serverless) via Prisma 7
- **Auth:** Custom implementation — bcrypt password hashing, JWT sessions
  (via `jose`) in an HttpOnly cookie. Not a third-party auth provider.
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **CI:** GitHub Actions (typecheck + build on every push/PR to `main`)

## What's built and verified

- Signup / login / logout / session check, with hashed passwords and
  HttpOnly JWT cookies (7-day expiry)
- Role-based accounts: `EMPLOYER` and `CANDIDATE`
- Employers can post jobs (title, description, location, job type);
  public browse/search by keyword
- Candidates can apply to a job with a resume link and optional note;
  duplicate applications to the same job are blocked at the database level
  (unique constraint on job + candidate)
- Ownership-based authorization: an employer can only view applicants for
  jobs *they* posted — enforced server-side (returns 403 for any other job),
  not just hidden in the UI
- Full frontend: signup/login pages, job browse/search, employer job-post
  form, candidate apply form, employer applicant-list view
- Manually tested end-to-end for both roles: signup → post a job (employer)
  → apply (candidate) → view applicants (employer, ownership-checked)

## What's explicitly NOT built, and why

- **No automated test suite.** Endpoints and flows were verified manually,
  not via committed test code (Vitest/Playwright), due to the assessment's
  time constraint.
- **No OAuth.** Email/password only.
- **No server-side session revocation.** Sessions are stateless JWTs;
  logout clears the cookie client-side, but a copied/stolen token remains
  valid until its natural 7-day expiry.
- **No rate-limiting** on login attempts.
- **No pagination** on the jobs list — fine at demo scale, would need it
  before real production use.

## Deployment

The app is deployed on Vercel. GitHub Actions runs on every push/PR to
`main`: installs dependencies, generates the Prisma client, typechecks
(`tsc --noEmit`), and runs a production build — this gates what reaches
`main`, but the actual deploy to Vercel is triggered by Vercel's native
GitHub integration on push, not by a separate deploy step inside the
Actions workflow itself.

## Running locally

1. `npm install`
2. Create `.env` with:

DATABASE_URL="<your Neon connection string>"
SESSION_SECRET="<any long random string>"

3. `npx prisma generate && npx prisma migrate deploy`
4. `npm run dev`

## Data model

- **User** — `id`, `name`, `email` (unique), `passwordHash`, `role`
  (`EMPLOYER` | `CANDIDATE`)
- **Job** — `id`, `title`, `description`, `location`, `jobType`, `isOpen`,
  `employerId` → User
- **Application** — `id`, `resumeLink`, `note`, `status`, `jobId` → Job,
  `candidateId` → User, unique on `(jobId, candidateId)`

## API endpoints

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me`
- `POST /api/jobs` (employer only), `GET /api/jobs` (public,
  `?keyword=&location=&jobType=`)
- `POST /api/jobs/[jobId]/apply` (candidate only)
- `GET /api/jobs/[jobId]/applicants` (job owner only)
