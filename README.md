# REELO — Real Expressions, Everyday Life, Online

**Your Social Universe.**
Connect. Create. Discover.

REELO is an all-in-one social networking platform: everyday posts, short video, communities, private messaging, live streaming, polls, events, creator tools, and achievements — built around a calm, premium **Natural Premium** identity.

> **Current status:** Phase 1 (Core MVP) is **in progress**. The repository contains a strong UI prototype, but authentication is still demo-only and multi-user data isolation is not yet implemented. See [`docs/status.md`](docs/status.md) for the evidence-based tracker.

---

## Product scope

| Phase | Scope |
|---|---|
| **1 — Core MVP** | Auth, profiles, feed, posts + media uploads, likes/comments, follows, search, saved posts, notifications, block/report, admin moderation |
| 2 — Social | Stories, Shorts/Reels, Communities, Polls & Discussions, Collections, Personalized feed v1 |
| 3 — Communication | DMs, group chats, voice messages, message requests, realtime notifications |
| 4 — Creator | Dashboard, analytics, events, achievements/badges, discovery |
| 5 — Advanced | Live streaming, advanced recommendations, advanced moderation, platform analytics, scale |

Full specification: [`memory.md`](memory.md) · PRD: [`docs/prd.md`](docs/prd.md) · Roadmap: [`docs/roadmap.md`](docs/roadmap.md)

---

## Brand: Natural Premium

| Token | Hex |
|---|---|
| Primary | `#243746` |
| Secondary | `#4C7A78` |
| Background | `#F7F6F2` |
| Surface | `#FFFFFF` |
| Text | `#202A30` |
| Muted | `#77818A` |
| Accent | `#C87952` |

Editorial typography, natural colors, subtle shadows, light mode default, WCAG AA contrast. No neon gradients or excessive glassmorphism.

---

## Technology

- **Web:** Next.js 14 App Router, React 18, TypeScript (strict), Tailwind CSS
- **Icons/motion:** Lucide React, Framer Motion
- **Primary Data Store:** Cloud Supabase (Auth, PostgreSQL, Storage, Realtime) with Row Level Security (RLS)
- **Local PC Storage:** **Strictly Decommissioned** — User data, posts, media, and account records are never stored locally on the PC
- **Planned Mobile:** React Native + Expo, sharing the same Supabase backend contracts

---

## Quickstart

### 1. Install
```bash
npm install
```

### 2. Configure Supabase Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Apply Supabase Database Migrations
Execute the SQL migrations in `supabase/migrations/`:
- `supabase/migrations/001_initial_schema.sql` (Profiles, Posts, Likes, Comments, Follows, Communities, Messages, Notifications, RLS & triggers)
- `supabase/migrations/002_bookmarks_blocks_reports.sql` (Bookmarks, Blocks, Reports & RLS)

### 4. Run Development Server
```bash
npm run dev -- -H 0.0.0.0
```

- Local: `http://localhost:3000`
- Phone on the same Wi-Fi: `http://<YOUR_PC_IP>:3000`

### 5. Build & verify

```bash
npm run type-check
npm run lint
npm run build
npm run test        # available after P1.0 adds the test harness
```

---

## Repository guide

```text
app/            routes (auth, main, api)
components/     UI, layout, feed, profile, moderation
services/       domain logic (target: all business rules)
lib/            backend adapters, auth, validation, utils
types/          database/domain/API types
supabase/       migrations + RLS policies
scripts/        local DB init, seed, create-admin
docs/           PRD, architecture, database, security, testing, status
memory.md       master spec & development memory
```

---

## Documentation

- [`memory.md`](memory.md) — master product memory, rules, phase plan, work packages, tracker
- [`docs/prd.md`](docs/prd.md) — product requirements, personas, user stories
- [`docs/status.md`](docs/status.md) — live status + evidence log
- [`docs/roadmap.md`](docs/roadmap.md) — 5-phase roadmap and gates
- [`docs/features.md`](docs/features.md) — 15-feature matrix and screen specs
- [`docs/database.md`](docs/database.md) — full schema, indexes, RLS policies
- [`docs/architecture.md`](docs/architecture.md) — system design and adapters
- [`docs/security.md`](docs/security.md) — threat model, authz, privacy
- [`docs/testing.md`](docs/testing.md) — test strategy and release checklist
- [`docs/antigravity-prompts.md`](docs/antigravity-prompts.md) — prompt pack
- [`docs/changelog.md`](docs/changelog.md) — release history

---

## Contributing / agent workflow

1. Read `memory.md` before any change.
2. Pick the first untested item in §17.
3. Implement database → service → API → UI → tests.
4. Run type-check, lint, build, tests.
5. Update `memory.md`, `docs/status.md`, `docs/changelog.md`.
6. Never claim `TESTED` without evidence.

---

## License

MIT
