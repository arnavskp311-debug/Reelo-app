# REELO — Changelog & Release History

All notable changes are documented here. Status claims must match `docs/status.md` evidence.

---

## [2.0.0] — 2026-11-21 — Specification & Status Correction

### Documentation
- Rewrote `memory.md` as the single source of truth (v2.0): vision, full form, personas, design system, architecture, engineering standards, phase plan, 14 Phase 1 work packages, Phase 2–5 feature specs, full DB blueprint, security model, testing, honest tracker, ADR log, next-task queue, and Antigravity prompts.
- Added `docs/prd.md` — complete PRD with user stories and requirements for all 15 feature categories.
- Added `docs/status.md` — evidence-based 31-feature tracker.
- Added `docs/antigravity-prompts.md` — ready-to-paste prompts per work package.
- Rewrote `docs/roadmap.md`, `docs/features.md`, `docs/database.md`, `docs/architecture.md`, `docs/security.md`, `docs/testing.md`.
- Archived v1 documents in `docs/archive/`.

### Status correction (important)
- Previous `memory.md` claimed Phase 1 complete with 20/20 `TESTED` features, including Stories, Reels, Communities, and DMs.
- Code audit found:
  - login accepts any credentials and returns the demo user,
  - signup ignores email/password,
  - all APIs hardcode `DEMO_CURRENT_USER`,
  - no password hashing/session table,
  - no media upload pipeline,
  - `/moderation` has no admin authorization,
  - no automated tests.
- Corrected status: **0 / 31 features `TESTED`**; existing screens are `PROTOTYPE` or `IN_PROGRESS`.
- Redefined MVP scope: 11 features only; Stories/Reels/Communities/DMs moved to Phase 2–3.

### Architecture decisions
- Supabase is the production backend; SQLite is development-only.
- Service-layer adapter (`local` / `supabase`) allows work without credentials.
- Reels modeled as `posts.kind='reel'` to reuse engagement and moderation.
- No fake realtime/live/analytics; unfinished screens are feature-flagged.

### No code changes
- This release is documentation and status only. Application code is unchanged.

---

## [1.0.0] — 2026-11-21 — UI Prototype Release

> Historical entry. Feature completion claims were later found inaccurate (see 2.0.0).

### Brand
- Natural Premium palette: `#243746`, `#4C7A78`, `#F7F6F2`, `#FFFFFF`, `#202A30`, `#77818A`, `#C87952`.
- Editorial typography, subtle shadows, reduced neon/glassmorphism.

### UI prototype
- Landing, login, signup, home feed, explore, communities, messages, notifications, moderation, profile, create.
- Interactive post cards, story viewer, reels modal, waveform player.
- Responsive shell + mobile nav + PWA manifest.

### Data
- Local SQLite demo database (`data/reelo.db`) with 12 tables and seeded content.
- Supabase PostgreSQL blueprint (`supabase/migrations/001_initial_schema.sql`).

### Known limitations at 1.0.0
- Single demo user; no real authentication.
- URL-only media; no uploads.
- No admin authorization.
- No automated tests.
- Stories/Reels/Communities/DMs are UI prototypes over seeded data.
