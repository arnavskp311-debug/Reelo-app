# REELO — Master Product Memory & Development Specification

**Version:** 2.0
**Project:** REELO — Real Expressions, Everyday Life, Online
**Product Type:** All-in-One Social Networking Platform
**Status:** Phase 1 (Core MVP) — IN PROGRESS (foundation exists, production hardening pending)
**Primary Vision:** Your Social Universe.
**Tagline:** Connect. Create. Discover.
**Brand Line:** Your World. Your People. Your REELO.
**Last Updated:** 2026-11-21

> **This file is the single source of truth for REELO.**
> Every Antigravity session must read this file completely before touching code.
> If this file conflicts with an older document, this file wins. Update the older document.
> Previous version archived at `docs/archive/memory-v1.md`.

---

## 0. How Antigravity Must Use This File

### 0.1 Mandatory session protocol

At the start of **every** session, in this order:

1. Read `memory.md` completely.
2. Read `docs/status.md` (current tracker) and `docs/changelog.md` (last changes).
3. Inspect the actual repository — do not trust status claims without checking code.
4. Run the baseline checks: `npm run type-check`, `npm run lint`, `npm run build` (report failures).
5. Pick the **first item** in `§17 Next Task Queue` that is not `TESTED`.
6. Write a short plan (5–10 bullets) before editing.
7. Implement the work package fully: database, service, API, UI, validation, authorization, tests.
8. Run the Definition of Done checks in `§14`.
9. Update `memory.md`, `docs/status.md`, `docs/changelog.md`, and any affected docs.
10. Report factually using the format in `§0.4`.

### 0.2 Hard rules

- Never rebuild working functionality. Inspect first, extend second, replace only with a documented reason.
- Never claim `TESTED` without evidence (command output, test name, or manual test steps + result).
- Never mark a feature complete because its UI exists.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or any secret to the browser/mobile client.
- Never authorize from the client only. Every mutation is authorized server-side.
- Never fake realtime, live streaming, analytics, or AI recommendations with static data.
- Never ship a fake placeholder for a future phase. Use a feature flag and label it `Preview` if already present.
- Never introduce a new framework/library without recording an ADR entry in `§16`.
- If credentials are missing, implement everything that does not need them and record the exact blocker.
- Preserve existing useful code and the Natural Premium visual identity.
- Keep the web app first. Mobile (React Native/Expo) reuses the same backend contracts later.

### 0.3 Status vocabulary

| Status | Meaning |
|---|---|
| `NOT_STARTED` | No real implementation. |
| `PROTOTYPE` | UI/demo only, static or single-user data, not production behavior. |
| `IN_PROGRESS` | Partially implemented; known gaps remain. |
| `IMPLEMENTED` | Code complete end-to-end, not yet verified with evidence. |
| `TESTED` | Verified with reproducible evidence (automated test or documented manual pass). |
| `BLOCKED` | Cannot proceed; blocker and required credential/service documented. |

### 0.4 Required end-of-session report

```text
WORK PACKAGE: <ID + name>
STATUS: <new status>
WHAT CHANGED: <files/areas>
DATABASE: <migrations added / none>
SECURITY: <authorization + validation added>
TESTS RUN: <commands + result>
MANUAL CHECKS: <steps + result>
KNOWN ISSUES: <list>
DOCS UPDATED: <files>
NEXT TASK: <first untested item>
```

---

## 1. Product Identity

### 1.1 Name and meaning

**REELO** = **R**eal **E**xpressions, **E**veryday **L**ife, **O**nline.

It is not a clone of Instagram, Facebook, TikTok, X, or Discord. REELO combines the strongest social primitives into one calm, premium, natural product:

- everyday posts and stories,
- short vertical video,
- interest communities,
- private communication,
- creator tools,
- events and achievements.

### 1.2 Elevator pitch

> REELO is a calmer social universe where people share real moments, build communities, watch short videos, talk privately, and grow as creators — without noise, rage-bait, or engagement traps.

### 1.3 Target users

| Persona | Need | Success signal |
|---|---|---|
| **Maya, 24 — everyday sharer** | Share life with friends, control privacy | Posts 2–3×/week, returns daily |
| **Arjun, 29 — creator** | Grow an audience, understand performance | Uploads reels weekly, checks dashboard |
| **Sara, 33 — community organizer** | Run a focused community with moderators | Members active weekly, reports handled |
| **Nina, 27 — privacy-conscious** | No unwanted DMs, granular visibility | Uses followers-only + message requests |
| **Dev — platform admin** | Keep the platform safe | Reports resolved < 24h, audit trail intact |

### 1.4 Product pillars

1. Social networking
2. Content creation and discovery
3. Communities
4. Communication
5. Creator ecosystem
6. Safety and trust

### 1.5 Product principles

- **Real over viral.** Rank meaningful interaction, not outrage.
- **Privacy by default.** New accounts are discoverable but DMs are request-gated.
- **Safety is not optional.** Report, block, and moderation ship in MVP.
- **Creator ownership.** Creators can see real numbers and control their audience.
- **Calm design.** Natural Premium, editorial, no neon/glassmorphism clutter.
- **One backend.** Web, Android, iOS share the same contracts and data.
- **Performance is a feature.** Feed interaction budget: < 200 ms local response.

### 1.6 Non-goals for MVP

Stories, Reels feed, Communities, DMs, Voice Messages, Live, Polls, Creator Dashboard, Events, Achievements, Collections, Advanced Search, Recommendation engine, full Admin analytics, native mobile apps.

> These are **not cancelled** — they are Phase 2–5. Do not build them early. Existing demo screens for them must be hidden behind `NEXT_PUBLIC_FEATURE_*` flags and labelled `Preview` until their phase begins.

---

## 2. Brand & Design System — "Natural Premium"

### 2.1 Color tokens

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#243746` | Headings, primary buttons, nav active |
| `secondary` | `#4C7A78` | Links, success states, secondary accents |
| `background` | `#F7F6F2` | App background |
| `surface` | `#FFFFFF` | Cards, modals, inputs |
| `text` | `#202A30` | Body text |
| `muted` | `#77818A` | Meta, timestamps, helper text |
| `accent` | `#C87952` | Likes, highlights, story rings, focus accent |
| `border` | `#E6E3DB` | Hairlines, dividers |
| `danger` | `#B4472F` | Destructive actions, reports |

Rules: light mode default; dark mode is a later milestone; no gradients except subtle image overlays; shadows are soft and low-opacity; contrast must meet WCAG AA.

### 2.2 Typography

- Display/headings: editorial serif (e.g. **Fraunces** or **Source Serif 4**).
- UI/body: clean sans (e.g. **Inter** or **Geist Sans**).
- Mono: system mono for code/IDs only.
- Scale: 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 px. Body line-height 1.55.

### 2.3 Spacing, radius, elevation

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 56, 72.
- Radius: inputs/buttons `12px`, cards `18px`, modals `24px`, avatars full.
- Shadow: `0 1px 2px rgba(36,55,70,.04), 0 4px 14px rgba(36,55,70,.05)`.
- Motion: 150–250 ms ease-out; respect `prefers-reduced-motion`.

### 2.4 Component inventory (reuse, do not duplicate)

`Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Card`, `Badge`, `Avatar`, `Tabs`, `Modal`, `Sheet`, `Toast`, `Dropdown`, `EmptyState`, `Skeleton`, `ConfirmDialog`, `ReportDialog`, `Pagination`.

### 2.5 Layout

- Desktop: left nav (240px) · center column (max 680px) · right context rail (300px).
- Tablet: left nav collapses to icons · right rail hidden.
- Mobile: top bar + bottom tab bar · full-width feed · touch targets ≥ 44px.

Primary nav: **Home · Explore · Create · Notifications · Profile** (MVP).
Phase 2 adds **Shorts · Communities**; Phase 3 adds **Messages**.

### 2.6 Accessibility

Keyboard reachable controls, visible focus ring (`accent`), `aria-label` on icon buttons, alt text required for uploaded media, form errors linked with `aria-describedby`, no color-only status.

---

## 3. Technical Architecture

### 3.1 Stack (current + target)

| Layer | MVP local | Production target |
|---|---|---|
| Web | Next.js 14 App Router, React 18, TypeScript strict | same |
| Styling | Tailwind CSS 3.4 + tokens | same |
| Icons | Lucide React | same |
| Motion | Framer Motion (sparingly) | same |
| Auth | Local adapter: scrypt + signed HttpOnly session | Supabase Auth (email/password) |
| Database | SQLite via `node:sqlite` (`data/reelo.db`) — **dev only** | Supabase PostgreSQL + RLS |
| Storage | Local `/public/uploads` or Supabase Storage | Supabase Storage + image/video transforms |
| Realtime | Polling (MVP notifications only) | Supabase Realtime |
| Mobile | — | React Native + Expo, shared API |

**Decision:** Supabase is the production backend. SQLite exists only so development works without credentials. The application must talk to a service layer, never to `getDb()` from UI components, so the adapter can be swapped.

### 3.2 Backend adapter strategy

```
UI (server/client components)
        │
        ▼
services/*.ts        ← domain logic, authorization-aware
        │
        ▼
lib/backend/*        ← adapter interface
   ├── local/        ← SQLite + scrypt sessions (dev)
   └── supabase/     ← Postgres + Supabase Auth (prod)
```

Rules:
- `services/` is the only place business rules live.
- Route handlers are thin: parse → validate → call service → map response.
- No SQL in components. No `fetch` from services to own API. No secrets in client bundles.
- Select the adapter with `BACKEND=local|supabase`. Fail fast if required env vars are missing.

### 3.3 Repository structure (target)

```text
app/
  (auth)/login, signup, forgot-password
  (main)/home, explore, notifications, profile, settings, admin
  api/...
components/
  ui/            generic primitives
  layout/        shell, nav, rails
  feed/          PostCard, Composer, CommentSheet
  profile/
  moderation/
  admin/
lib/
  backend/       adapter interface + local + supabase
  auth/          session helpers, requireUser, requireAdmin
  db/            local schema + migrations runner
  validation/    zod schemas per domain
  utils/         cn, dates, pagination, media
services/        auth, profile, post, feed, comment, follow, search,
                 saved, notification, moderation, admin, storage
types/           database.ts, api.ts, domain.ts
supabase/
  migrations/    numbered SQL
  policies/      RLS policy SQL
docs/
```

### 3.4 Environment variables

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
BACKEND=local                     # local | supabase
ALLOW_DEMO_LOGIN=false            # true only in local dev

# Supabase (server + public)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only, never NEXT_PUBLIC_

# Limits
MAX_IMAGE_MB=8
MAX_VIDEO_MB=100
SESSION_DAYS=30
```

Add `lib/config/env.ts` with schema validation; the app must refuse to start in production with missing secrets.

### 3.5 Performance budgets

- Feed API p95 < 300 ms (local) / < 500 ms (prod).
- LCP < 2.5 s on 4G; CLS < 0.1.
- Images: responsive `next/image`, width caps, AVIF/WebP.
- Video: poster + metadata only in feed; never autoplay original files.
- Pagination: cursor-based, page size 10–20.

---

## 4. Engineering Standards

### 4.1 TypeScript

- `strict: true`; no `any` in new code (use `unknown` + narrowing).
- Domain types in `types/domain.ts`; DB row types in `types/database.ts`.
- Shared API response types in `types/api.ts`.

### 4.2 Validation

- All input validated with **Zod** on the server (`lib/validation/*`).
- Client validation mirrors server but never replaces it.
- Limits: username `^[a-z0-9_]{3,24}$`; display name 1–50; bio ≤ 300; post text ≤ 2,000; comment ≤ 1,000; report details ≤ 1,000.
- Reject unknown fields. Normalize usernames to lowercase.

### 4.3 API conventions

Success:
```json
{ "data": { }, "meta": { "nextCursor": "..." } }
```
Error:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable", "fields": { } } }
```
Status codes: 200/201, 400 validation, 401 unauthenticated, 403 forbidden, 404 missing, 409 conflict, 429 rate-limited, 500 unexpected.

Rules: no stack traces to clients; log server-side with request id; all mutations require CSRF-safe cookies (`SameSite=Lax` + origin check for unsafe methods); idempotent toggles where possible.

### 4.4 Database conventions

- UUID v4 text/`uuid` primary keys; `created_at`, `updated_at` timestamptz.
- Foreign keys with explicit `ON DELETE` behavior (`CASCADE` for owned content, `SET NULL` for references).
- Soft delete via `deleted_at` on user content.
- Counters are derived from tables; denormalized counters only if maintained transactionally.
- Index every foreign key and every feed/sort column.
- Migrations are additive and numbered; never edit an applied migration.

### 4.5 Security invariants

1. Session cookie is `HttpOnly`, `Secure` in production, `SameSite=Lax`.
2. Password hashing uses `scrypt` (or Argon2id) with per-user salt; never plaintext/SHA.
3. Every service function that mutates data receives an authenticated `actorId` and checks ownership/role.
4. Admin routes call `requireAdmin()` server-side.
5. Storage paths are scoped by user id; MIME + size validated server-side.
6. Reports and moderation actions are append-only and audited.
7. Blocked users cannot see/interact with the blocker's content or DMs.
8. Rate-limit auth, posts, comments, reports, and uploads.
9. Never trust `userId` from the request body.
10. Log security-relevant events without storing passwords or message bodies.

### 4.6 UI conventions

- Server Components by default; Client Components only for interaction.
- Loading skeletons, empty states, and error states are mandatory for every data screen.
- Optimistic updates must roll back on API failure and show a toast.
- All destructive actions require confirmation.
- No dead buttons. If a control is not implemented, disable it with a tooltip or hide it.

### 4.7 Documentation rules

Every meaningful change updates: `memory.md` status/decision, `docs/status.md`, `docs/changelog.md`, and the relevant spec (`database`, `security`, `features`).

---

## 5. Phase Map & Release Gates

| Phase | Theme | Scope | Gate to next phase |
|---|---|---|---|
| **1** | Core MVP | Auth, profiles, feed, posts+media, likes/comments, follows, search, saved, notifications, block/report, basic admin | All 11 MVP features `TESTED`; build/lint/type-check clean; RLS verified |
| **2** | Social experience | Stories, Shorts/Reels, Communities, Polls & Discussions, Collections, Personalized feed v1 | Media pipeline stable; expiry jobs verified; community roles enforced |
| **3** | Communication | DMs, group chats, voice messages, requests, realtime notifications | Realtime delivery verified; privacy/block rules enforced |
| **4** | Creator ecosystem | Creator dashboard, analytics, events, achievements/badges, discovery | Metrics trace to real events; badge rules idempotent |
| **5** | Advanced platform | Live streaming, advanced recs, advanced moderation, platform analytics, scale/security | Load tests pass; live provider integrated; moderation SLAs met |

### 5.1 MVP scope — exact boundary

**IN (Phase 1):**

1. Email/password signup, login, logout, session management.
2. Profile view + edit basics (name, username, bio, avatar, cover, links).
3. Home feed (Following + Discover).
4. Text, image, and video posts with real uploads.
5. Likes and comments.
6. Follow/unfollow.
7. Basic search (users, posts, hashtags).
8. Saved posts (single default list; collections in Phase 2).
9. In-app notifications (like, comment, follow).
10. Block and report.
11. Basic admin moderation (report queue, remove content, suspend user, audit log).

**OUT (deferred):** everything in `§1.6`.

### 5.2 Phase 1 exit criteria (release gate)

- A new user can sign up, log out, log back in, and see only their own session.
- Two different accounts see correct, isolated data (no hardcoded demo user).
- Passwords are hashed; wrong password is rejected; duplicate email/username rejected.
- Posts persist with uploaded media; unauthorized edits/deletes are rejected.
- Likes/comments/follows are idempotent and counted correctly.
- Blocked users' content disappears from feed, search, profile, and comments.
- Reports reach the admin queue; only admins can resolve; every action is audited.
- `npm run type-check`, `npm run lint`, `npm run build` pass.
- Automated tests cover auth, authorization, and RLS; manual checklist signed off.
- No critical console errors; mobile layout verified at 360 px, 768 px, 1440 px.

---

## 6. PHASE 1 — CORE MVP IMPLEMENTATION PLAN

Execute work packages in order. Do not skip P1.0/P1.1.

### P1.0 — Foundation, audit & cleanup

**Goal:** Make the repo honest and safe to build on.

Tasks:
- Create `docs/status.md` from the tracker in `§15`.
- Add `.env` validation (`lib/config/env.ts`) and fail-fast for production.
- Remove all hardcoded `DEMO_CURRENT_USER` usage from API routes. Replace with `requireUser()`.
- Remove the demo login fallback in `services/authService.ts`; demo login only when `ALLOW_DEMO_LOGIN=true`.
- Add `zod`, `vitest`, `@vitest/coverage-v8`, `playwright` (optional), and a test script.
- Add `lib/api/response.ts` helpers (`ok`, `fail`, `parseBody`).
- Add `lib/api/rate-limit.ts` (in-memory dev, documented prod replacement).
- Add global `error.tsx`, `not-found.tsx`, and `loading.tsx` for main routes.
- Feature-flag unfinished Phase 2–5 screens; label `Preview`; remove from primary nav.

**Files:** `lib/config/env.ts`, `lib/auth/session.ts`, `lib/api/*`, `services/authService.ts`, `middleware.ts`, `package.json`, `.env.example`.

**Acceptance:** no demo user fallback; every protected route returns 401 without a session; build passes.

### P1.1 — Database schema, migrations & seed

**Goal:** A real relational schema for the MVP.

Tables (see `docs/database.md` for full DDL):
`profiles`, `user_settings`, `auth_credentials` (local only), `sessions` (local only), `posts`, `post_media`, `likes`, `comments`, `follows`, `bookmarks`, `notifications`, `blocks`, `reports`, `moderation_actions`, `admin_roles`, `audit_logs`.

Requirements:
- UUID/text IDs, timestamps, FKs, unique constraints, indexes.
- `profiles.status` enum: `active | suspended | deactivated | deleted`.
- `posts.deleted_at` soft delete; `comments.deleted_at`.
- `notifications.dedupe_key` unique to prevent spam.
- `reports.status`: `pending | reviewing | resolved | dismissed`; `target_type`: `post | comment | user`.
- Seed data only in development, behind `SEED_DEMO_DATA=true`.

**Acceptance:** `npm run init-db` creates schema from scratch; foreign keys enforced; indexes exist; seed is optional.

### P1.2 — Authentication & sessions

**Goal:** Real multi-user authentication.

Local adapter:
- `auth_credentials(user_id, email UNIQUE, password_hash, email_verified_at, created_at)`.
- Password hash: `scrypt$N$r$p$salt$hash` via `node:crypto` (`scryptSync`), constant-time compare.
- `sessions(id, user_id, expires_at, created_at, user_agent, ip_hash)`.
- Cookie `reelo_session`: random 32-byte id, HttpOnly, SameSite=Lax, Secure in prod, 30 days.
- `getSession()` → user or null; `requireUser()` → 401; `requireAdmin()` → 403.
- Login: verify email + password, rotate session, update `last_login_at`.
- Signup: validate, hash, create `profiles` + `user_settings` + `auth_credentials` in a transaction.
- Logout: delete session row + clear cookie.
- Rate limit: 5 attempts / 15 min per IP+email.
- Origin check on POST/PATCH/DELETE.

Supabase adapter (when credentials exist): Supabase Auth email/password; mirror profile via trigger; server client with `@supabase/ssr`; never service key in client.

**API:** `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.

**Acceptance:** wrong password → 401; duplicate email/username → 409; session persists across refresh; logout invalidates server-side; suspended user cannot log in.

### P1.3 — Profiles & settings

**Goal:** Editable identity.

- View `/profile/[username]`: avatar, cover, display name, `@username`, bio, links, joined date, counts, posts grid, follow button, report/block menu.
- `/settings/profile`: edit display name, username (unique, rate-limited), bio, location, website, avatar, cover.
- `user_settings`: `is_private`, `who_can_dm` (`everyone | followers | nobody`), `show_activity_status`, `theme`.
- Upload avatar/cover via media pipeline (P1.4).
- Counters: `followers_count`, `following_count`, `posts_count` maintained transactionally or computed.
- Privacy: private profile hides posts from non-followers; follow requests deferred to Phase 2? For MVP, private profile = posts visible to followers only (auto-accept follow).

**API:** `GET /api/profiles/:username`, `PATCH /api/profiles/me`, `GET/PATCH /api/settings`.

**Acceptance:** only owner can edit; username collision handled; avatar persists; private profile hides content server-side.

### P1.4 — Media upload pipeline

**Goal:** Real image/video uploads (no URL-only posts).

- `POST /api/uploads` (multipart or signed URL): validate MIME by magic bytes, size limits (`MAX_IMAGE_MB`, `MAX_VIDEO_MB`), extension allowlist.
- Local: write to `public/uploads/{userId}/{uuid}.{ext}` (dev only, gitignored); production: Supabase Storage bucket `post-media`.
- Path scoping: `{userId}/{uuid}`; never accept a client path.
- Images: generate thumbnail (sharp or `next/image` remote loader); strip EXIF.
- Videos: store metadata (duration, width, height, poster); reject unsupported codecs; no transcoding in MVP (document limitation).
- Return `{ url, path, mime, width, height, duration, size }`.
- Upload rate limit and per-user quota.

**Acceptance:** oversized/wrong-type files rejected; uploaded image renders in feed; user cannot overwrite another user's file.

### P1.5 — Posts, composer & feed

**Goal:** Create and consume content.

- Composer `/create`: text (≤2,000), up to 4 images **or** 1 video, hashtags (max 10), visibility (`public | followers`), optional community later.
- `POST /api/posts` validates and stores `posts` + `post_media`.
- Edit/delete own post (soft delete); delete cascades media cleanup job.
- Feed `/home` tabs: **Following** (chronological from follows) and **Discover** (recency + engagement score, exclude blocked/self/suspended).
- Cursor pagination `(created_at, id)`; page size 12.
- Post card: author, time, text with hashtag links, media, like/comment/save/share, overflow menu.
- Empty states + skeletons.

**Ranking (Discover MVP):** `score = (likes + 2*comments + 3*saves) / pow(hours_since + 2, 1.5)`. Document formula; no hidden “engagement traps”.

**API:** `GET /api/posts?feed=following|discover&cursor=`, `POST /api/posts`, `GET /api/posts/:id`, `PATCH /api/posts/:id`, `DELETE /api/posts/:id`.

**Acceptance:** post appears in author profile and followers' feed; blocked content excluded; pagination has no duplicates; deleted post returns 404.

### P1.6 — Likes & comments

- `POST /api/posts/:id/like` toggles like; unique constraint prevents duplicates; counter updated in transaction.
- `GET/POST /api/posts/:id/comments`; `DELETE /api/comments/:id` (author or post owner or admin).
- Comment pagination, newest/oldest, reply support (`parent_id`) — one level in MVP.
- Notifications created for post author (not self).
- Optimistic UI with rollback.

**Acceptance:** double-like does not double-count; comment persists; unauthorized delete → 403; comment on deleted post → 404.

### P1.7 — Follow graph

- `POST /api/users/:username/follow` toggle; cannot follow self/blocked user.
- Counters updated transactionally; unfollow removes feed content.
- Followers/following lists with pagination.
- Feed “Following” uses this graph.

**Acceptance:** follow state survives refresh; counts match rows; blocked pair cannot follow.

### P1.8 — Search

- `GET /api/search?q=&type=all|users|posts|hashtags&cursor=`.
- Min 2 chars; debounce 300 ms; limit 20 per type.
- Postgres: `to_tsvector` + GIN; local: `LIKE` with normalized `search_text` column or FTS5.
- Results: people (avatar, name, handle, follow), posts (snippet, media thumb), hashtags (count).
- Exclude blocked, suspended, private content.

**Acceptance:** search finds new post/user immediately; blocked content absent; SQL injection impossible (parameterized).

### P1.9 — Saved posts

- `POST /api/posts/:id/save` toggle; `GET /api/saved` paginated.
- Profile “Saved” tab visible only to owner.
- Phase 2 migrates saves into collections; keep backward compatibility.

**Acceptance:** saved items private; unsave removes; count not public.

### P1.10 — Notifications

- Types: `like`, `comment`, `follow`, `mention` (mention optional MVP).
- Created server-side on the action; skip self; dedupe via `dedupe_key`.
- `GET /api/notifications` paginated; `PATCH /api/notifications/read` (one/all).
- Unread badge; polling every 60 s in MVP (documented); realtime in Phase 3.
- Clicking navigates to target; deleted target shows fallback text.

**Acceptance:** actor sees no self-notification; unread count correct; mark-all works.

### P1.11 — Safety: block, report, moderation

- Block: `POST /api/blocks` / `DELETE /api/blocks/:userId`; bidirectional effect on feed, search, profile, comments, follow, DMs (Phase 3).
- Report: `POST /api/reports` with target type/id, reason enum, details; duplicate report within 24 h rejected.
- Report dialog accessible from post/comment/profile menus.
- `/moderation` requires admin; queue filters `pending/reviewing/resolved/dismissed`.
- Actions: dismiss, remove content (soft delete), suspend user (duration), warn; each writes `moderation_actions` + `audit_logs`.
- Reported content snapshot stored to survive deletion.

**Acceptance:** non-admin gets 403 on `/moderation` and admin APIs; removing content hides it everywhere; audit entry exists.

### P1.12 — Admin roles & audit

- `admin_roles(user_id, role: super_admin|moderator|support, granted_by, created_at)`.
- Seed first admin via script/env, never via public signup.
- `requireAdmin(role?)` server-side; UI hides admin nav for non-admins (defense in depth).
- `audit_logs(actor_id, action, target_type, target_id, metadata JSONB, created_at)`.
- Basic admin screens: reports queue, user list (search, status, suspend/restore), platform counts.

**Acceptance:** role changes are audited; suspended user is logged out on next request; no admin action without a log row.

### P1.13 — QA, performance & release

- Unit tests: validation, password hashing, ranking, permissions.
- Integration tests: auth flow, post CRUD, like idempotency, block filtering, admin authorization.
- RLS tests (Supabase): run as anon/user/admin; assert denied cases.
- E2E smoke (Playwright): signup → post → like → comment → follow → save → report → admin resolve.
- Manual matrix: Chrome/Edge/Firefox, 360/768/1440 px, keyboard-only.
- Lighthouse ≥ 90 accessibility/performance on `/home` (dev caveat).
- Fix all build/lint/type errors. No `console.log` in production paths.

**Release gate:** `§5.2`.

---

## 7. PHASE 2 — SOCIAL EXPERIENCE

Start only after Phase 1 gate passes. Each feature requires DB + service + API + UI + authorization + tests.

### P2.1 — Stories & highlights

Data: `stories(id, author_id, media_url, media_type, text_overlay, background_color, visibility, expires_at, created_at)`, `story_views(story_id, viewer_id, viewed_at)`, `story_reactions(story_id, user_id, emoji)`, `story_highlights(id, owner_id, title, cover_url, created_at)`, `highlight_items(highlight_id, story_id)`.
Rules: 24 h expiry (`expires_at`); visibility `public | followers | close_friends`; viewer list visible to author only; reactions one per user per story; replies route to DM when Phase 3 lands (store as `story_replies` until then).
API: `POST /api/stories`, `GET /api/stories/feed`, `POST /api/stories/:id/view`, `POST /api/stories/:id/react`, `GET /api/stories/:id/viewers`, `POST /api/highlights`.
UI: tray with unseen ring, full-screen viewer with progress bars, hold-to-pause, swipe, author-only insights.
Jobs: hourly cleanup of expired stories and orphaned media.
Acceptance: expired story inaccessible via API; private story hidden from non-followers; views counted once per user.

### P2.2 — Shorts / Reels

Decision: model reels as `posts` with `kind='reel'` + `post_media` video, plus `reel_views(reel_id, viewer_id, watched_ms, created_at)`. Rationale: reuse likes/comments/saves/notifications. Expose `/api/reels` view over posts.
Rules: 9:16, ≤ 3 min, poster required, caption + hashtags, one video per reel; feed ordered by recency + completion rate (Phase 4) — MVP chronological/engagement.
API: `POST /api/reels`, `GET /api/reels/feed?cursor=`, `POST /api/reels/:id/view`.
UI: full-screen snap feed, mute toggle, progress, double-tap like, comment sheet, share/save.
Performance: never load full originals in list; use poster + `preload="metadata"`; CDN/transcode later.
Acceptance: video plays/pauses on visibility; view counted after ≥ 2 s or 50% watched; blocked creators excluded.

### P2.3 — Communities

Data: `communities(id, name, slug UNIQUE, description, avatar_url, cover_url, owner_id, visibility public|private, category, guidelines, members_count, posts_count, created_at)`, `community_members(community_id, user_id, role owner|moderator|member, status active|pending|banned, joined_at)`, `community_join_requests`.
Rules: public join instantly; private requires approval; owner/moderator can remove posts/members; banned users cannot rejoin without approval; community posts are `posts.community_id`.
API: CRUD communities, join/leave, members, posts, moderation.
UI: directory, community home, about/guidelines, member list, moderator tools.
Acceptance: non-member cannot post in private community; moderator actions authorized; slug unique.

### P2.4 — Polls & discussions

Data: `polls(id, post_id, question, multiple_choice, closes_at, created_at)`, `poll_options(id, poll_id, label, position)`, `poll_votes(poll_id, option_id, user_id, created_at)` unique `(poll_id, user_id, option_id)`.
Rules: 2–6 options; one vote per user (or multi if enabled); results hidden until vote or close (configurable); closed polls reject votes; author can close early.
Discussions: posts with `kind='discussion'` + topic tags; threaded comments (max depth 2) with sorting.
API: create poll with post, vote, results, close.
Acceptance: duplicate vote blocked; results accurate; closed poll read-only.

### P2.5 — Saved collections

Data: `collections(id, owner_id, name, is_private, created_at)`, `collection_items(collection_id, post_id, added_at)` unique pair. Migrate existing bookmarks into a default “Saved” collection.
Rules: owner-only access; max 50 collections; names unique per owner; deleting collection keeps posts saved in default.
API: CRUD collections, add/remove items, list with counts.
UI: save menu → choose collection; collections grid; item list.
Acceptance: private collection never leaks; item add idempotent.

### P2.6 — Personalized feed v1

- `user_settings.interests` (array of topic ids), `content_preferences` (mute topic/creator).
- Ranking signals: follow graph, interests, recency, meaningful interactions (comment/save > like), diversity (max 2 posts per author per page), safety exclusions.
- Controls: “Not interested”, “Mute author”, “Why am I seeing this?” explanation.
- No dark patterns; no engagement-only optimization.
Acceptance: muting a topic removes it from feed; explanation matches signals; A/B-free deterministic tests.

---

## 8. PHASE 3 — COMMUNICATION

### P3.1 — Direct messaging

Data: `conversations(id, type direct|group, created_by, created_at)`, `conversation_members(conversation_id, user_id, role, status pending|accepted|declined|left, joined_at, last_read_at)`, `messages(id, conversation_id, sender_id, content_type text|image|post|voice, content, media_url, reply_to_id, created_at, deleted_at)`, `message_receipts(message_id, user_id, delivered_at, read_at)`.
Rules: only members with `accepted` can read/send; blocked users cannot message; `who_can_dm` setting enforced; message edit/delete own; report message; no E2E encryption in v1 (documented).
Realtime: Supabase Realtime channel per conversation or SSE fallback; optimistic send with server id reconciliation.
Acceptance: non-member gets 403; blocked pair cannot create conversation; unread counts correct.

### P3.2 — Group chats

- Create group (2–50 members), name, avatar; owner/admin roles; add/remove members; system messages; leave.
- Only admins can remove; removed member loses access immediately.
- Acceptance: role enforcement tested; member list accurate.

### P3.3 — Voice messages

- Record via MediaRecorder (web) / Expo AV (mobile); max 5 min; opus/webm or m4a.
- Upload to private bucket `voice/{userId}/{uuid}`; signed URL for members only.
- Playback with seek, speed (1x/1.5x/2x), duration, waveform peaks metadata.
- Cancel recording discards; upload progress; retry on failure.
- Acceptance: unauthorized user cannot fetch audio; duration matches; cancel leaves no orphan file.

### P3.4 — Message requests

- First message from non-follower creates `pending` conversation; recipient sees request inbox; accept → move to inbox; decline → hidden; block → delete.
- Max 1 request per sender per 30 days after decline (anti-spam).
- Acceptance: pending messages not delivered as normal inbox; accept reveals history.

### P3.5 — Realtime notifications

- Replace polling with Realtime subscription; fallback polling if disconnected.
- Types expanded: message, mention, community, event, badge.
- Acceptance: notification appears < 2 s; reconnect recovers missed items via cursor.

---

## 9. PHASE 4 — CREATOR ECOSYSTEM

### P4.1 — Creator dashboard

- Route `/studio` (creator role not required; any user with content).
- Data: `creator_stats_daily` + `analytics_events`; range 7/30/90 days; timezone-aware.
- API: `GET /api/studio/overview?range=`, `GET /api/studio/content`, `GET /api/studio/audience`.
- UI: stat cards (followers, reach, engagement rate, profile views), growth chart, top content table, audience breakdown, empty state for new creators.
- Rules: all numbers from real events/aggregates; label unavailable metrics; no estimates presented as facts; export CSV optional.
- Acceptance: totals reconcile with raw events for a sampled day; date filter changes all cards consistently; no fabricated numbers.

### P4.2 — Creator analytics

Data: `analytics_events(id, actor_id, event_type, target_type, target_id, metadata, created_at)` partitioned by month; `creator_stats_daily(creator_id, date, profile_views, post_views, likes, comments, shares, followers_gained, followers_lost)`.
Rules: event ingestion server-side only; dedupe impressions per session; retention 12 months; privacy-safe (no PII in metadata).
Acceptance: dashboard numbers reconcile with raw events for a sampled day.

### P4.3 — Events

Data: `events(id, host_id, title, description, cover_url, starts_at, ends_at, timezone, mode online|offline, location, online_url, capacity, visibility, created_at)`, `event_attendees(event_id, user_id, status going|interested|declined, created_at)`, `event_updates(id, event_id, body, created_at)`.
Rules: host can edit/cancel; attendees notified; capacity enforced; online link visible only to going attendees; reminders (in-app MVP, push later).
Acceptance: RSVP idempotent; capacity blocks overbooking; canceled event notifies attendees.

### P4.4 — Achievements & badges

Data: `achievements(id, code UNIQUE, name, description, icon, criteria JSONB, category)`, `user_badges(user_id, achievement_id, awarded_at, unique)`, `badge_progress` (optional derived).
Rules: award via idempotent job on verified events (e.g. 10 posts, 100 followers, 30-day streak, community moderator); no award from client claims; revoke on abuse with audit.
UI: profile badge shelf, achievement page, progress.
Acceptance: re-running award job creates no duplicates; criteria tested with fixtures.

### P4.5 — Creator discovery

- Route `/explore/creators`; filters: category, follower range, activity, sort (`rising`, `popular`, `new`).
- Data: `profiles` + `creator_stats_daily`; “rising” = real follower growth over 30 days, not random.
- API: `GET /api/creators?category=&range=&sort=&cursor=`.
- Rules: exclude suspended/inactive/blocked; no dead profiles; follow from card.
- Acceptance: pagination stable; blocked excluded; rising ranking reproducible from stats.

---

## 10. PHASE 5 — ADVANCED PLATFORM

### P5.1 — Live streaming

**Do not fake.** Integrate a real provider (recommended: LiveKit or Agora for interactive; Mux/Cloudflare for broadcast). Data: `live_streams(id, host_id, title, status scheduled|live|ended, provider, provider_stream_id, playback_url, started_at, ended_at, viewer_peak, replay_enabled)`, `live_viewers(stream_id, user_id, joined_at, left_at)`, `live_chat_messages`.
Rules: host controls start/end; moderator can mute/ban chat; report stream; replay only if enabled; viewer count from provider webhooks, not client.
API: `POST /api/live`, `POST /api/live/:id/start|end`, `GET /api/live/:id`, `POST /api/live/:id/chat`, `POST /api/webhooks/live` (provider signature verified).
UI: “Go live” setup, host studio (viewer count, chat, mute/ban, end), viewer room (player, chat, report).
Edge cases: provider outage → status banner + retry; stream ended → redirect to replay or host profile; banned viewer → chat read-only; webhook replay → idempotent update.
Acceptance: real RTMP/WebRTC stream plays; webhook updates status; ended stream rejects chat.

### P5.2 — Advanced recommendations

- Candidate generation (follows, interests, trending, similar creators) → ranking model (learning-to-rank or heuristic v2) → diversity/safety filters.
- Implementation: feature store (Postgres/materialized views first), offline evaluation set, shadow mode before rollout, fallback to Phase 2 ranking if the model fails.
- Explainability and user controls; no engagement-only objective; log which signals were used.
- Acceptance: measurable relevance improvement vs Phase 2 baseline; safety filters cannot be bypassed; fallback path tested.

### P5.3 — Advanced moderation

- Classifiers for spam/hate/NSFW (provider or self-hosted), human review queue, appeals, strike system, transparency log.
- Implementation: async moderation queue, confidence thresholds, auto-hide only above high confidence, human review for ambiguous cases, strike escalation (warn → restrict → suspend).
- Acceptance: appeals workflow audited; false-positive rate tracked; no auto-ban without review for ambiguous classes.

### P5.4 — Platform analytics

- Admin dashboards: DAU/WAU/MAU, retention, content volume, report SLA, growth; privacy-safe aggregates.
- Implementation: event warehouse (Postgres → BigQuery/ClickHouse if needed), daily rollups, admin-only API, no PII.
- Acceptance: numbers reproducible from warehouse/events.

### P5.5 — Scalability & optimization

- Read replicas/caching, CDN, image/video transcoding, queue workers for media/notifications, DB partitioning, load tests (k6), SLOs, incident runbook.
- Implementation order: indexes → query tuning → caching → CDN → async workers → replicas → partitioning.
- Acceptance: p95 targets met at 10× baseline load; no single point of failure in critical path.

---

## 11. Database Blueprint

Full DDL and policies: `docs/database.md`.

### 11.1 Table catalog by phase

| Phase | Tables |
|---|---|
| 1 | `profiles`, `user_settings`, `auth_credentials`, `sessions`, `posts`, `post_media`, `likes`, `comments`, `follows`, `bookmarks`, `notifications`, `blocks`, `reports`, `moderation_actions`, `admin_roles`, `audit_logs` |
| 2 | `stories`, `story_views`, `story_reactions`, `story_highlights`, `highlight_items`, `reel_views`, `communities`, `community_members`, `community_join_requests`, `polls`, `poll_options`, `poll_votes`, `collections`, `collection_items` |
| 3 | `conversations`, `conversation_members`, `messages`, `message_receipts`, `message_requests` (or member status), `voice_uploads` |
| 4 | `analytics_events`, `creator_stats_daily`, `events`, `event_attendees`, `event_updates`, `achievements`, `user_badges` |
| 5 | `live_streams`, `live_viewers`, `live_chat_messages`, `moderation_appeals`, `platform_stats_daily` |

### 11.2 Non-negotiable data rules

- UUID primary keys; `created_at`/`updated_at` everywhere.
- Indexes on every FK, `created_at DESC`, and search columns.
- `UNIQUE` on `(user_id, post_id)` likes/bookmarks, `(follower_id, following_id)` follows, `(community_id, user_id)` memberships, `(poll_id, user_id)` votes.
- Soft delete user content (`deleted_at`), hard delete only via account deletion job.
- Counters updated in the same transaction as the underlying row.
- Every exposed table has RLS; service-role bypass only on the server.

### 11.3 Target API surface

All routes require a session unless marked **public**. All mutations are validated and authorized server-side.

**Phase 1**

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Current session user |
| GET | `/api/profiles/:username` | **public** profile |
| PATCH | `/api/profiles/me` | Edit own profile |
| GET/PATCH | `/api/settings` | Privacy/preferences |
| POST | `/api/uploads` | Image/video upload |
| GET | `/api/posts?feed=following\|discover&cursor=` | Feed |
| POST | `/api/posts` | Create post |
| GET/PATCH/DELETE | `/api/posts/:id` | Post detail/edit/soft delete |
| POST | `/api/posts/:id/like` | Toggle like |
| GET/POST | `/api/posts/:id/comments` | List/create comments |
| DELETE | `/api/comments/:id` | Delete comment |
| POST | `/api/users/:username/follow` | Toggle follow |
| GET | `/api/users/:username/followers` | Followers list |
| GET | `/api/users/:username/following` | Following list |
| GET | `/api/search?q=&type=` | Users/posts/hashtags |
| GET | `/api/saved` | Own saved posts |
| POST | `/api/posts/:id/save` | Toggle save |
| GET | `/api/notifications` | List notifications |
| PATCH | `/api/notifications/read` | Mark one/all read |
| POST | `/api/blocks` | Block user |
| DELETE | `/api/blocks/:userId` | Unblock |
| POST | `/api/reports` | Report content/user |
| GET | `/api/admin/reports` | Admin queue |
| PATCH | `/api/admin/reports/:id` | Resolve/dismiss |
| GET | `/api/admin/users` | User management |
| PATCH | `/api/admin/users/:id` | Suspend/restore |
| GET | `/api/admin/audit` | Audit log |
| GET | `/api/admin/stats` | Platform counts |
| GET | `/api/health` | **public** health check |

**Phase 2**

`POST/GET /api/stories`, `GET /api/stories/:id`, `POST /api/stories/:id/view`, `POST /api/stories/:id/react`, `GET /api/stories/:id/viewers`, `POST/GET/PATCH/DELETE /api/highlights`, `POST /api/highlights/:id/items`; `GET /api/reels/feed`, `POST /api/reels`, `POST /api/reels/:id/view`; `POST/GET /api/communities`, `GET/PATCH /api/communities/:slug`, `POST /api/communities/:id/join`, `POST /api/communities/:id/leave`, `GET /api/communities/:id/members`, `GET/PATCH /api/communities/:id/requests`, `POST/GET /api/communities/:id/posts`; `POST /api/polls`, `POST /api/polls/:id/vote`, `GET /api/polls/:id/results`, `POST /api/polls/:id/close`; `GET/POST /api/collections`, `PATCH/DELETE /api/collections/:id`, `POST/DELETE /api/collections/:id/items`; `GET /api/search?type=users|posts|hashtags|videos|communities|events`; `GET /api/feed?mode=for-you`, `PATCH /api/settings/interests`, `POST /api/posts/:id/not-interested`.

**Phase 3**

`GET/POST /api/conversations`, `GET /api/conversations/:id`, `PATCH /api/conversations/:id/read`, `POST/DELETE /api/conversations/:id/members`; `GET/POST /api/conversations/:id/messages`, `PATCH/DELETE /api/messages/:id`; `GET /api/message-requests`, `POST /api/message-requests/:id/accept|decline`; `POST /api/uploads/voice`. Realtime via Supabase channels (not REST).

**Phase 4**

`GET /api/studio/overview?range=7|30|90`, `GET /api/studio/content`, `GET /api/studio/audience`; `POST/GET /api/events`, `GET/PATCH/DELETE /api/events/:id`, `POST /api/events/:id/rsvp`, `POST /api/events/:id/updates`; `GET /api/achievements`, `GET /api/users/:username/badges`; `GET /api/creators`.

**Phase 5**

`POST /api/live`, `POST /api/live/:id/start|end`, `GET /api/live/:id`, `POST /api/live/:id/chat`, `POST /api/webhooks/live`; `POST /api/moderation/appeals`, `GET/PATCH /api/admin/appeals`; `GET /api/admin/analytics`.

---

## 12. Media Pipeline

| Asset | Bucket | Max | Types | Access |
|---|---|---|---|---|
| Avatar | `avatars` | 5 MB | jpg/png/webp | public read, owner write |
| Cover | `covers` | 10 MB | jpg/png/webp | public read, owner write |
| Post image | `post-media` | 8 MB | jpg/png/webp/avif | public read (MVP), owner write |
| Post video | `post-media` | 100 MB | mp4/webm | public read (MVP), owner write |
| Voice | `voice` | 10 MB | webm/m4a/ogg | private, signed URL |
| Live replay | `replays` | provider | HLS | creator setting |

Rules: magic-byte validation, extension allowlist, randomized filenames, EXIF stripping, thumbnail/poster generation, orphan cleanup job, never serve raw originals in feed lists.

---

## 13. Security & Privacy Model

- **Auth:** scrypt/Argon2id, HttpOnly sessions, rotation on login, server-side logout.
- **Authorization:** `requireUser`, `requireOwner`, `requireAdmin`; every route.
- **RLS:** default deny; public read only for public content; owner writes; admin via role check.
- **Input:** Zod, parameterized SQL, HTML escaped by React; sanitize link URLs (http/https only).
- **Uploads:** MIME/size validation, path scoping, no executable content.
- **Abuse:** rate limits, report throttling, duplicate-report suppression, block enforcement.
- **Privacy:** private profiles, followers-only posts, DM settings, viewer lists author-only.
- **Account deletion:** 30-day grace, cascade content, anonymize audit references.
- **Secrets:** server-only env, never in client bundles; rotate service role keys.
- **Logging:** structured logs, no passwords/message bodies/tokens.
- **Compliance:** terms, privacy policy, community guidelines, age gate (13+/18+ per region).

---

## 14. Testing & Definition of Done

### 14.1 Commands

```bash
npm run type-check
npm run lint
npm run build
npm run test          # add in P1.0
npm run test:e2e      # optional Playwright
```

### 14.2 Test layers

- Unit: validation, hashing, ranking, permissions, formatters.
- Integration: API routes with a test DB; auth → action → assertion.
- RLS: anon/user/admin matrices; denied cases must fail closed.
- E2E: critical journeys.
- Manual: responsive, keyboard, screen reader basics, error states.

### 14.3 Definition of Done (all required)

1. DB migration + indexes + constraints.
2. Service layer with authorization.
3. API route with validation and error envelope.
4. UI with loading, empty, error, and success states.
5. Privacy/block rules applied.
6. Automated tests or documented manual evidence.
7. `type-check`, `lint`, `build` pass.
8. Docs updated (`memory.md`, `status.md`, `changelog.md`).
9. No secrets or debug logs.
10. Status set to `TESTED` only with evidence.

---

## 15. Current Status Tracker (Honest Audit — 2026-11-21)

### 15.1 Audit findings (verified in code)

| Finding | Evidence | Impact |
|---|---|---|
| Login accepts any credentials and returns the demo user | `app/api/auth/login/route.ts` | Critical: no real authentication |
| Signup ignores email/password and stores no credentials | `app/api/auth/signup/route.ts` | Critical: accounts are not secure |
| APIs hardcode `DEMO_CURRENT_USER` | `app/api/messages/route.ts`, feed/post routes | Critical: no multi-user isolation |
| No password hashing or session table | `services/authService.ts` | Critical |
| Media is URL-only; no upload pipeline | `/create` composer | High |
| `/moderation` has no admin authorization | `app/(main)/moderation/page.tsx` | High |
| Stories/Reels/Communities/DM counted as Phase 1 “TESTED” | `docs/archive/memory-v1.md` | Scope/status inaccurate |
| No automated test suite | `package.json` | High |
| SQLite schema missing indexes, soft delete, settings, admin, audit | `lib/db/index.ts` | High |
| PWA claimed offline-ready without service worker | `public/manifest.json` | Medium |
| No rate limiting or Zod validation | repo-wide | High |

> **Conclusion:** the repo is a strong **UI prototype**. Phase 1 is **not** production-complete. Treat all prior `TESTED` claims as `PROTOTYPE` until re-verified.

### 15.2 Feature tracker (31 features)

Legend: `PROTOTYPE` = UI/demo only · `IN_PROGRESS` = partial real logic · `NOT_STARTED`.

#### Phase 1 — Core MVP (0/11 tested)

| # | Feature | Current state | Target | Next action |
|---|---|---|---|---|
| 1 | Authentication | `PROTOTYPE` — demo login, no hashing/sessions | `TESTED` | P1.0–P1.2 |
| 2 | User profiles | `PROTOTYPE` — demo data, single user | `TESTED` | P1.3 |
| 3 | Home feed | `PROTOTYPE` — demo posts, no isolation | `TESTED` | P1.5 |
| 4 | Posts & media uploads | `PROTOTYPE` — URL-only media | `TESTED` | P1.4–P1.5 |
| 5 | Likes & comments | `IN_PROGRESS` — works for demo user | `TESTED` | P1.6 |
| 6 | Follow system | `IN_PROGRESS` — demo user only | `TESTED` | P1.7 |
| 7 | Basic search | `PROTOTYPE` — client filter over demo data | `TESTED` | P1.8 |
| 8 | Saved posts | `IN_PROGRESS` — bookmarks table | `TESTED` | P1.9 |
| 9 | Notifications | `PROTOTYPE` — seeded rows | `TESTED` | P1.10 |
| 10 | Block & report | `IN_PROGRESS` — demo user context | `TESTED` | P1.11 |
| 11 | Basic admin moderation | `PROTOTYPE` — no admin auth | `TESTED` | P1.11–P1.12 |

#### Phase 2 — Social Experience (0/6)

| # | Feature | Current state |
|---|---|---|
| 1 | Stories | `PROTOTYPE` — viewer UI, no persistence/expiry |
| 2 | Shorts / Reels | `PROTOTYPE` — modal over demo video URLs |
| 3 | Communities | `PROTOTYPE` — join/leave on demo communities |
| 4 | Polls & discussions | `NOT_STARTED` |
| 5 | Saved collections | `NOT_STARTED` — single bookmarks only |
| 6 | Personalized feed | `NOT_STARTED` |

#### Phase 3 — Communication (0/5)

| # | Feature | Current state |
|---|---|---|
| 1 | Direct messaging | `PROTOTYPE` — demo user, polling, no realtime |
| 2 | Group chats | `NOT_STARTED` |
| 3 | Voice messages | `NOT_STARTED` — waveform UI only |
| 4 | Realtime notifications | `NOT_STARTED` |
| 5 | Message requests | `NOT_STARTED` |

#### Phase 4 — Creator Ecosystem (0/4)

| # | Feature | Current state |
|---|---|---|
| 1 | Creator dashboard | `NOT_STARTED` |
| 2 | Creator analytics | `NOT_STARTED` |
| 3 | Events | `NOT_STARTED` |
| 4 | Achievements & badges | `NOT_STARTED` |

#### Phase 5 — Advanced Platform (0/5)

| # | Feature | Current state |
|---|---|---|
| 1 | Live streaming | `NOT_STARTED` |
| 2 | Advanced recommendations | `NOT_STARTED` |
| 3 | Advanced moderation | `NOT_STARTED` |
| 4 | Platform analytics | `NOT_STARTED` |
| 5 | Scalability & optimization | `NOT_STARTED` |

**Verified progress: 0 / 31 `TESTED`.**

### 15.3 Known issues & technical debt

1. Demo auth and hardcoded user — must be removed first.
2. No upload pipeline; media URLs are unvalidated.
3. No admin authorization.
4. No tests, no CI.
5. SQLite is single-file/dev-only; production requires Postgres.
6. No rate limiting, CSRF origin check, or email verification.
7. No pagination consistency (offset-based in places).
8. No error boundaries/loading states everywhere.
9. Dead/placeholder controls for future features.
10. Docs and code status diverged (fixed by v2.0).
11. `package.json` version of `framer-motion` should be verified against React 18 compatibility.
12. No account deletion or data export flow.
13. No content sanitization policy for links.
14. No moderation SLA or appeal workflow.
15. PWA manifest without service worker.

---

## 16. Decision Log (ADR)

| ID | Decision | Rationale | Date |
|---|---|---|---|
| D-001 | Supabase is the production backend; SQLite is dev-only | Managed Postgres, Auth, Storage, Realtime, RLS | 2026-11-21 |
| D-002 | Service-layer adapter (`local` / `supabase`) | Works without credentials, swap without UI rewrite | 2026-11-21 |
| D-003 | Reels modeled as `posts.kind='reel'` | Reuse engagement, notifications, moderation | 2026-11-21 |
| D-004 | MVP feed = Following + Discover only | Avoid premature recsys | 2026-11-21 |
| D-005 | No fake live/realtime/analytics | Trust and product integrity | 2026-11-21 |
| D-006 | Feature-flag unfinished screens | Honest UI, no dead nav | 2026-11-21 |
| D-007 | Status requires evidence | Prevents false completion | 2026-11-21 |
| D-008 | Block is bidirectional for visibility | Safety and simplicity | 2026-11-21 |
| D-009 | No E2E encryption in DM v1 | Scope; document risk and roadmap | 2026-11-21 |
| D-010 | Full form: Real Expressions, Everyday Life, Online | Brand meaning | 2026-11-21 |
| D-011 | Private profiles auto-accept follows in MVP | Avoid a follow-request system before Phase 2 | 2026-11-21 |
| D-012 | Single-choice poll uniqueness enforced in service + partial index | Supports multi-choice without schema fork | 2026-11-21 |

---

## 17. Next Task Queue

Execute top to bottom. One work package per session unless explicitly told otherwise.

1. **P1.0** Foundation, audit, env validation, remove demo fallback.
2. **P1.1** MVP schema + migrations + indexes + seed flag.
3. **P1.2** Real auth + sessions + rate limit.
4. **P1.3** Profiles + settings + avatar/cover.
5. **P1.4** Media upload pipeline.
6. **P1.5** Composer + posts + feed.
7. **P1.6** Likes + comments.
8. **P1.7** Follow graph.
9. **P1.8** Search.
10. **P1.9** Saved posts.
11. **P1.10** Notifications.
12. **P1.11** Block + report + moderation.
13. **P1.12** Admin roles + audit.
14. **P1.13** QA + release gate.
15. Phase 2 kickoff (only after gate).

---

## 18. Documentation Map

| File | Purpose |
|---|---|
| `memory.md` | Single source of truth (this file) |
| `docs/prd.md` | Full PRD: personas, user stories, requirements, metrics |
| `docs/status.md` | Live status tracker + evidence log |
| `docs/roadmap.md` | Phase plan, dependencies, gates, estimates |
| `docs/features.md` | Feature matrix + screen specifications |
| `docs/database.md` | Full schema, indexes, RLS policies, migration order |
| `docs/architecture.md` | System design, adapters, data flow, deployment |
| `docs/security.md` | Threat model, authz, privacy, moderation |
| `docs/testing.md` | Test strategy, matrices, release checklist |
| `docs/antigravity-prompts.md` | Ready-to-paste prompts per phase |
| `docs/changelog.md` | Version history |
| `docs/archive/` | Superseded v1 documents |

---

## 19. Ready-to-Paste Antigravity Prompts

### 19.1 Master session prompt

```text
Read memory.md completely, then docs/status.md and docs/changelog.md.
Inspect the actual repository; do not trust status claims without checking code.
Run: npm run type-check, npm run lint, npm run build. Report failures.
Pick the first item in §17 Next Task Queue that is not TESTED.
Write a 5–10 bullet plan, then implement that work package end-to-end:
database, service, API, validation, authorization, UI, tests.
Follow §4 Engineering Standards and §14 Definition of Done.
Do not implement future-phase features. Do not fake realtime/live/analytics.
Update memory.md, docs/status.md, docs/changelog.md, and affected docs.
Report using the §0.4 format. Do not claim TESTED without evidence.
```

### 19.2 Phase 1 kickoff prompt

```text
Read memory.md. Current milestone: Phase 1 Core MVP.
Start with P1.0 (Foundation & cleanup), then P1.1 (schema), then P1.2 (real auth).
Remove every hardcoded DEMO_CURRENT_USER and the demo login fallback.
Implement real password hashing, sessions, validation, and authorization.
Do not touch Phase 2–5 features. Feature-flag existing previews.
After each work package, run type-check/lint/build and update the status tracker.
Stop only when P1.0–P1.2 are TESTED, then report.
```

### 19.3 Per-feature implementation prompt

```text
Implement <WORK PACKAGE ID + NAME> exactly as specified in memory.md §6.
Before coding: list the files you will touch and the DB changes.
Requirements: migration + indexes, service with authorization, validated API,
UI with loading/empty/error states, block/privacy rules, tests.
Do not modify unrelated features. Do not claim TESTED without evidence.
Update memory.md §15 and docs/status.md when done.
```

### 19.4 Audit-only prompt

```text
Read memory.md. Audit the repository against the Phase 1 scope only.
For each of the 11 MVP features, report: actual code path, real vs demo behavior,
security gaps, and status (NOT_STARTED/PROTOTYPE/IN_PROGRESS/IMPLEMENTED/TESTED).
Do not modify code. Produce a prioritized gap list with file references.
```

### 19.5 Release gate prompt

```text
Verify the Phase 1 exit criteria in memory.md §5.2.
Run type-check, lint, build, and the test suite.
Execute the manual checklist in docs/testing.md.
For every criterion, provide evidence (command output or test steps + result).
If any criterion fails, fix it or mark the phase BLOCKED with the exact blocker.
Only then update the tracker and write the release report.
```

---

## 20. Current Project Priority

**Active milestone:** PHASE 1 — CORE MVP.

Deliver a polished, secure, multi-user social foundation before any advanced feature.

**Immediate next task:** `P1.0 — Foundation, audit & cleanup`, then `P1.1`, then `P1.2`.

**END OF MASTER MEMORY SPECIFICATION — v2.0**
