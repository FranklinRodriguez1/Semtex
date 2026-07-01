# Semtex — Administrative & Financial Copilot (Frontend)

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Auth-Supabase-3ECF8E?logo=supabase)
![Runtime](https://img.shields.io/badge/runtime-Bun-black?logo=bun)
![Status](https://img.shields.io/badge/status-MVP%20in%20development-yellow)
![License](https://img.shields.io/badge/license-internal%20%2F%20confidential-red)

## Description and vision

**Semtex** is the frontend of an **intelligent automation SaaS** built as an
"Administrative & Financial Copilot" for SMBs. The product's goal is to let a small or
mid-sized company **upload its accounting files (Excel/CSV)**, **query them in natural
language** about balances, income, expenses and time-based comparisons, and **delegate
real-world actions** (such as sending corporate emails) to an AI agent — all under a
**multi-tenant architecture** with role-based access control (RBAC) and strict guarantees
of data isolation between companies.

This repository holds **only the presentation layer (Next.js)**. User authentication runs
on **Supabase Auth**, while business logic, the AI agent (Function Calling) and the
persistence of financial data live in an **independent Spring Boot backend**
(`semtex-application-backend`), consumed via a REST API secured with JWT.

**Who is it for?** Administrative and finance teams at SMBs who need to cut down time
spent on repetitive data-analysis and communication tasks, while keeping full control and
confidentiality over their accounting information.

## Current status and roadmap

**Current status:** active MVP development. The authentication flow, company/user
provisioning (RBAC with `ADMIN` / `OPERATOR` / `AUDITOR` roles), document upload and the
AI chat agent are already wired up against the backend deployed on Render. The app is
deployed on Vercel.

**Proposed roadmap:**

1. **Enriched audit dashboard** — filters by date/user/action and log export from
   `/view/audit`, currently limited to a simple list.
2. **Self-service SMTP configuration per company** — the database migration already
   exists (`smtp_email`, `smtp_password` on `organizations`); the UI in
   `/view/configuration` still needs to be exposed so each admin can manage their own
   sending account instead of relying on global Render env vars.
3. **Offline mode / local LLM validation** — support for pointing the chat at a locally
   hosted open-source language model (via Ollama), as required by the full-confidentiality
   requirement for accounting records.
4. **Automated test coverage** — the project has no unit or e2e test suite yet; this is
   the natural next step before scaling the number of views and roles.

## Architecture and scalability

```
┌────────────┐  1. login/register   ┌─────────────────┐
│  FRONTEND  │ ───────────────────► │  SUPABASE AUTH  │  (issues the JWT, ES256)
│  (Next 16) │ ◄─────────────────── │                 │
│            │     access_token     └─────────────────┘
│            │
│            │  2. Bearer <token>   ┌─────────────────┐  3. JDBC
│            │ ───────────────────► │  Spring Backend │ ───────► Supabase Postgres
└────────────┘   business data      │  (Render :8080) │          (same tables)
                                     └─────────────────┘
```

- **Feature-based pattern (not strict Clean Architecture):** each view under
  `src/app/view/<module>/` encapsulates its own `Container`, `components/`, `hooks/` and
  `services/`. This keeps data logic (fetching, transforming) separate from presentation,
  and prevents a change in one module (e.g. `transfer`) from affecting another
  (e.g. `team`).
- **Delegated authentication:** Supabase Auth issues the JWT; the frontend never validates
  passwords or manages its own sessions. `AuthProvider` (a React Context) exposes `user`,
  `status` and `isAuthenticated` to the whole app; `RoleGuard` adds a UX layer that hides
  sections based on role, but **real authorization happens in the backend** (403 on an
  invalid role).
- **Two clearly separated API layers:**
  - `src/lib/api.ts` (`apiFetch`) → calls the **Spring backend** (`NEXT_PUBLIC_API_URL`)
    for business data (documents, financial records, chat, audit logs).
  - Internal routes under `src/app/api/**` (Next.js Route Handlers) → operations that
    require Supabase's `service_role` (creating companies, inviting users), executed
    exclusively server-side so privileged credentials are never exposed to the client.
- **Multi-tenant:** the `org_id` travels embedded in the JWT (injected by a Supabase
  Access Token Hook) and the backend filters every query by that tenant; the frontend
  never sends or filters by `organizationId` manually, reducing the risk of cross-tenant
  leaks caused by client-side mistakes.
- **Current scalability:** the front/backend split allows each layer to scale
  independently (Vercel for the frontend, Render/a container for the backend). The
  backend on Render's Free plan suffers a *cold start* (~50s) after inactivity, a known
  limitation to address before production traffic. Since the frontend holds no shared
  state (everything lives in the JWT and server-side calls), the frontend itself is
  *stateless* and horizontally scalable with no code changes.

## Prerequisites, installation and usage

### Prerequisites

- [Bun](https://bun.sh) (runtime declared in `package.json` → `engines.bun`).
- Access to a **Supabase** project (URL + anon key) and to the backend credentials
  (`SUPABASE_SERVICE_ROLE_KEY`, the Spring backend running locally or deployed).
- The Spring backend (`semtex-application-backend`) running, either locally on `:8080` or
  using the instance deployed on Render.

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd semtex-app-front

# 2. Install dependencies with Bun
bun install
```

### Environment variables

Create a `.env` file at the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public anon key>

# Spring backend (local :8080 or deployed on Render)
NEXT_PUBLIC_API_URL=http://localhost:8080

# SERVER-ONLY — never expose with the NEXT_PUBLIC prefix, never commit to git
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
SUPERADMIN_EMAILS=email1@example.com,email2@example.com
```

### Running in development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The app automatically redirects to
`/view/loginy` when there is no active session.

### Build and production

```bash
bun run build
bun run start
```

### Linting

```bash
bun run lint
```

## Troubleshooting

**1. Chat or document upload return `403 Forbidden`**
Supabase's Access Token Hook injects the role as the `app_role` claim, but by default the
Spring backend looks for a `role` claim. If the backend doesn't recognize the role, any
endpoint protected with `hasRole(...)` will fail. Fix: set
`semtex.jwt.role-claim=app_role` in the backend's environment (e.g. Render), or
alternatively update the Supabase hook to emit the claim as `role`.

**2. CORS errors when calling the backend from a different origin (Vercel, a different
local port)**
The backend only accepts explicitly listed origins (`SEMTEX_CORS_ALLOWED_ORIGINS`). If the
frontend runs on a port other than `http://localhost:3000` or is deployed to a Vercel
domain, that origin must be added to that variable in the backend's environment and the
service restarted; otherwise the browser will silently block every request.

**3. The first request to the backend takes ~50 seconds or times out**
If the backend runs on Render's Free plan, it enters *cold start* after a period of
inactivity. The first request after that period can take up to 50s. This is not a
configuration error — just wait for the service to wake up (check the backend's
`/actuator/health` to confirm it's up).

**4. Changes to `.env` are not reflected in the app**
Next.js only reads environment variables when the process starts. After editing `.env`,
you need to stop and re-run `bun run dev` (reloading the browser is not enough).

## Project structure

```
semtex-app-front/
├── src/
│   ├── app/
│   │   ├── api/                       # Server-side Route Handlers (service_role)
│   │   │   ├── me/                    # GET  /api/me           → current user claims
│   │   │   ├── admin/companies/       # POST /api/admin/companies (super-admin)
│   │   │   ├── team/invite/           # POST /api/team/invite  (ADMIN invites employees)
│   │   │   ├── config/email/          # Per-organization SMTP configuration
│   │   │   ├── mail/                  # Email sending
│   │   │   └── users/                 # User management
│   │   ├── view/                      # One module per feature: container + hooks + services
│   │   │   ├── loginy/                # Login / Register (Supabase Auth)
│   │   │   ├── home/                  # Visual landing (Three.js) + AI agent chat
│   │   │   ├── transfer/              # Drag & drop upload and reception of documents
│   │   │   ├── configuration/         # Integrations, roles and SMTP
│   │   │   ├── team/                  # Company user management (ADMIN)
│   │   │   ├── admin/                 # Company provisioning (super-admin)
│   │   │   └── audit/                 # Audit logs (ADMIN/AUDITOR)
│   │   ├── dev/jwt-debug/             # Internal tool to inspect the JWT
│   │   └── layout.tsx                 # Root layout: wraps the app in AuthProvider + Shell
│   ├── components/
│   │   ├── auth/                      # AuthProvider (Context) and RoleGuard (role-based UX)
│   │   └── layout/                    # Shell and Sidebar (role-aware navigation)
│   ├── lib/
│   │   ├── api.ts                     # apiFetch() → Spring backend with automatic Bearer
│   │   ├── session.ts                 # getClaims / getInternal / postInternal (Next routes)
│   │   ├── supabase.ts                # Browser Supabase client
│   │   └── supabaseAdmin.ts           # ⚠ service_role client — server-only
│   └── utils/                         # Utilities (Three.js animation, mailer)
├── supabase/migrations/               # SQL migrations applied manually in Supabase
├── public/                            # Static assets (UI icons)
├── INTEGRATION.md                     # Detailed front ↔ backend integration guide
└── package.json
```

## Contact and maintenance

Maintained by the **Semtex Core Team**. Primary point of contact for this repository:
**Franklin Rodríguez** ([franklinrodriguezdev@gmail.com](mailto:franklinrodriguezdev@gmail.com)).
For access requests, environment credentials or integration questions, reach out through
this contact before opening changes to authentication or multi-tenant logic.

## License and copyright

© 2026 Semtex. All rights reserved.

This repository and its contents are the exclusive property of Semtex. Unauthorized
copying, distribution, modification, or use of this software, in whole or in part, via
any medium, is strictly prohibited without prior written permission from the copyright
holder. This project is confidential and intended solely for internal use by authorized
members of the Semtex team.
