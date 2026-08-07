# ApplyAI Frontend — API Contract

This document captures the **exact** API contract the frontend expects, derived from the
NestJS backend at https://github.com/KomalRakhunde/Job-Application.

## Base URL

All requests go to `NEXT_PUBLIC_API_URL` (default `http://localhost:3000`).
The backend has **no global API prefix** (confirmed in `src/main.ts`).

## Authentication

JWT Bearer token. The login response returns the token as **`accessToken`** (camelCase).
Attach it on every protected route:

```
Authorization: Bearer <accessToken>
```

JWT payload is `{ userId, email }` (from `src/auth/jwt.strategy.ts`).
Token expires in 7d (`src/auth/auth.module.ts`).

---

## ✅ Implemented endpoints (pages 1–3 wired to these)

### Auth — `src/auth/auth.controller.ts`

| Method | Route              | Auth | Body                                   | Response                                                              |
|--------|--------------------|------|----------------------------------------|-----------------------------------------------------------------------|
| POST   | `/auth/register`   | no   | `{ email, password, firstName?, lastName? }` | `{ message: "Registration successful", user: { id, email, firstName, lastName } }` |
| POST   | `/auth/login`      | no   | `{ email, password }`                  | `{ message: "Login successful", accessToken, user: { id, email } }`  |

Errors: `409 Conflict` if email already registered; `401` on bad credentials.

### Users — `src/users/users.controller.ts` (JWT-protected)

| Method | Route           | Body                                   | Response                                                                     |
|--------|-----------------|----------------------------------------|------------------------------------------------------------------------------|
| GET    | `/users/:id`    | —                                      | `{ id, email, firstName, lastName, createdAt, updatedAt }`                   |
| PATCH  | `/users/:id`    | `{ firstName?, lastName? }`            | same as GET                                                                  |

### Profiles — `src/profiles/profiles.controller.ts` (JWT-protected)

| Method | Route               | Body (UpdateProfileDto) | Response                                                                     |
|--------|---------------------|-------------------------|------------------------------------------------------------------------------|
| GET    | `/profiles/:userId` | —                       | Profile row (see below). `404` if no profile yet.                            |
| PATCH  | `/profiles/:userId` | partial Profile fields  | Profile row (upserts — creates if missing).                                  |

**Profile fields** (`UpdateProfileDto`): `phone, location, preferredLocation,
expectedSalary, noticePeriod, linkedinUrl, portfolioUrl, githubUrl` — all optional strings.

Full Profile row: `{ id, userId, phone, location, preferredLocation, expectedSalary,
noticePeriod, linkedinUrl, portfolioUrl, githubUrl, createdAt, updatedAt }`.

### Resumes — `src/resumes/resumes.controller.ts` (JWT-protected)

| Method | Route             | Body                          | Response                          |
|--------|-------------------|-------------------------------|-----------------------------------|
| POST   | `/resumes/:userId`| `{ title, fileUrl?, atsScore? }` | Resume row                       |
| GET    | `/resumes/:userId`| —                             | Resume[]                          |
| PATCH  | `/resumes/:id`    | `{ title?, fileUrl?, atsScore? }` | Resume row                     |
| DELETE | `/resumes/:id`    | —                             | `{ message: "Resume deleted successfully" }` |

### Jobs — `src/jobs/jobs.controller.ts` (JWT-protected)

| Method | Route        | Body (CreateJobDto) | Response |
|--------|--------------|---------------------|----------|
| POST   | `/jobs`      | `{ title, company, location?, description?, salary?, applyUrl? }` | Job row |
| GET    | `/jobs`      | —                   | Job[]    |
| PATCH  | `/jobs/:id`  | partial of above    | Job row  |
| DELETE | `/jobs/:id`  | —                   | `{ message: "Job deleted successfully" }` |

Job row: `{ id, title, company, location, description, salary, applyUrl, createdAt, updatedAt }`.

---

## ❌ Missing endpoints (pages 4–8 are blocked on these)

The following modules in the backend are currently **empty stubs** (`@Module({})` with no
controller/service). The frontend pages 4–8 are designed against the contract below. Once
you implement these endpoints to match, the pages can be wired up with no further changes.

### Page 4 — Resume upload & ATS score

The existing `resumes` controller only stores `fileUrl` as a plain string; there is **no
PDF upload or parsing endpoint** and **no `resume-parser` module**. Needed:

1. **PDF upload** — proposed: `POST /resumes/upload` (multipart `file` field, JWT-protected)
   - Response: `{ id, userId, title, fileUrl, atsScore, createdAt, updatedAt }`
   - The `resume-parser` module the task referenced does not exist; implement upload here
     (or create a `resume-parser` module and tell me the exact route).

2. **ATS score** — proposed: `POST /ai/ats-score` (JWT)
   - Body: `{ resumeId: string, jobDescription: string }`
   - Response: `{ score: number (0-100), keywords: { keyword: string, matched: boolean }[], summary: string }`

3. **Resume analysis** — proposed: `POST /ai/resume-analysis` (JWT)
   - Body: `{ resumeId: string, jobDescription?: string }`
   - Response: `{ strengths: string[], weaknesses: string[], suggestions: string[], overall: string }`

### Page 5 — Job search / listing
`GET /jobs` exists but returns plain rows with **no AI match score**. Needed:
- Either `GET /jobs?match=true&resumeId=:id` returning each job with a `matchScore` field, OR
- `POST /ai/job-match` (JWT) — Body `{ resumeId, jobDescription }` → `{ score: number, reasons: string[] }`

### Page 6 — Cover letter generator — proposed: `POST /ai/cover-letter` (JWT)
- Body: `{ resumeId?: string, jobTitle: string, company: string, jobDescription: string, style: 'professional' | 'friendly' | 'startup' | 'corporate' }`
- Response: `{ content: string, style: string }`

### Page 7 — Application tracker — `applications` module is an empty stub. Needed (JWT):
- `GET    /applications`                → Application[]
- `POST   /applications`                → `{ jobId, status? }` → Application
- `PATCH  /applications/:id`            → `{ status }` → Application
- `DELETE /applications/:id`            → `{ message }`
- **Status enum**: `APPLIED | INTERVIEW | ASSESSMENT | REJECTED | OFFER | JOINED`
- Application row shape: `{ id, userId, jobId, status, createdAt, updatedAt, job?: Job }`

### Page 8 — Interview prep — proposed: `POST /ai/interview-questions` (JWT)
- Body: `{ jobTitle: string, jobDescription?: string, type?: 'behavioral' | 'technical' | 'general' }`
- Response: `{ questions: { question: string, type: string, suggestedAnswer?: string, difficulty?: 'easy' | 'medium' | 'hard' }[] }`

---

## How to proceed

1. Implement the missing endpoints above in the backend.
2. Tell me the exact route + request/response shapes if they differ from these proposals.
3. I'll wire pages 4–8 to them and verify end-to-end.

## Frontend env

Only one variable is required:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

The JWT is stored in `localStorage` (`applyai_token`, `applyai_user`) and attached as
`Authorization: Bearer <token>` on protected requests.
