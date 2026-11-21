# REELO — Antigravity Prompt Pack

**Version:** 2.0
**How to use:** paste **one prompt per session**. Replace `<...>` placeholders. Always start by making Antigravity read `memory.md`.

> Do not paste the whole pack at once. One work package per session keeps context focused and status honest.

---

## 1. Master session prompt (use every time)

```text
You are working on REELO, an all-in-one social networking platform.

Before doing anything:
1. Read memory.md completely.
2. Read docs/status.md and docs/changelog.md.
3. Inspect the actual repository. Do not trust status claims without checking code.
4. Run: npm run type-check, npm run lint, npm run build. Report failures.

Then:
5. Pick the first item in memory.md §17 Next Task Queue that is not TESTED.
6. Write a 5–10 bullet implementation plan.
7. Implement that work package end-to-end: database migration, service,
   API route, Zod validation, server-side authorization, UI states, tests.
8. Follow memory.md §4 Engineering Standards and §14 Definition of Done.
9. Run the relevant tests. Fix errors. Do not ignore failures.
10. Update memory.md §15, docs/status.md, docs/changelog.md, and affected docs.
11. Report using the memory.md §0.4 format.

Rules:
- Do not implement future-phase features.
- Do not fake realtime, live streaming, analytics, or recommendations.
- Do not hardcode DEMO_CURRENT_USER anywhere.
- Do not claim TESTED without evidence.
- Preserve the Natural Premium design system.
```

---

## 2. Audit-only prompt (run before starting work)

```text
Read memory.md. Audit the repository against Phase 1 scope only.

For each of the 11 MVP features, report:
- actual code path (files/routes),
- real vs demo behavior,
- security gaps (authz, validation, uploads),
- status: NOT_STARTED / PROTOTYPE / IN_PROGRESS / IMPLEMENTED / TESTED.

Also list:
- every place DEMO_CURRENT_USER is hardcoded,
- every API route missing authorization,
- every table missing indexes or constraints,
- every UI control with no real action.

Do not modify code. Produce a prioritized gap list with file references.
```

---

## 3. Phase 1 kickoff prompt

```text
Read memory.md. Current milestone: Phase 1 — Core MVP.

Execute P1.0, then P1.1, then P1.2, in that order:

P1.0 — Foundation:
- Add lib/config/env.ts with validation.
- Add lib/api/response.ts, errors.ts, rate-limit.ts.
- Remove the demo login fallback in services/authService.ts.
- Remove every hardcoded DEMO_CURRENT_USER from API routes.
- Add Zod, Vitest, test scripts.
- Feature-flag unfinished Phase 2–5 screens and remove them from primary nav.

P1.1 — Schema:
- Create supabase/migrations/002_phase1_hardening.sql with the Phase 1 tables,
  indexes, constraints, and RLS policies from docs/database.md.
- Update scripts/init-local-db.js to match (SQLite parity).
- Seed only when SEED_DEMO_DATA=true.

P1.2 — Auth:
- scrypt password hashing, sessions table, HttpOnly cookie.
- Signup/login/logout/me routes with validation and rate limiting.
- requireUser/requireAdmin guards.

Do not touch Phase 2–5 features.
After each package: type-check, lint, build, tests, update status.
Stop when P1.0–P1.2 are TESTED and report with evidence.
```

---

## 4. Work package prompts

### P1.3 — Profiles & settings

```text
Implement P1.3 from memory.md §6.
Profile view + edit (name, username, bio, location, website, avatar, cover),
user_settings (private, who_can_dm), privacy enforcement server-side,
username uniqueness + rate limit, owner-only authorization, tests.
No Phase 2 features.
```

### P1.4 — Media uploads

```text
Implement P1.4 from memory.md §6.
POST /api/uploads with magic-byte validation, size limits, path scoping,
local + Supabase storage adapters, image thumbnail, video metadata/poster,
upload rate limit, cleanup script, tests for rejected files.
```

### P1.5 — Posts & feed

```text
Implement P1.5 from memory.md §6.
Composer (text + up to 4 images or 1 video, hashtags, visibility),
post CRUD with soft delete, Following + Discover feeds with cursor pagination,
blocked/suspended exclusions, loading/empty/error states, tests.
```

### P1.6 — Likes & comments

```text
Implement P1.6 from memory.md §6.
Idempotent like toggle with transactional counter, comments with pagination,
one-level replies, delete permissions (author/post owner/admin),
notifications on like/comment, optimistic UI with rollback, tests.
```

### P1.7 — Follow graph

```text
Implement P1.7 from memory.md §6.
Follow/unfollow toggle, self/blocked rejection, follower/following lists,
transactional counters, Following feed integration, tests.
```

### P1.8 — Search

```text
Implement P1.8 from memory.md §6.
GET /api/search for users/posts/hashtags, min 2 chars, debounce,
Postgres FTS + SQLite FTS5, blocked/private exclusions, pagination,
empty/loading states, injection-safe queries, tests.
```

### P1.9 — Saved posts

```text
Implement P1.9 from memory.md §6.
Save/unsave toggle, private saved list, owner-only access, pagination,
profile Saved tab, tests. Do not build collections yet.
```

### P1.10 — Notifications

```text
Implement P1.10 from memory.md §6.
Create notifications on like/comment/follow (skip self), dedupe_key,
unread count, mark one/all read, target navigation, 60s polling,
tests. Realtime is Phase 3.
```

### P1.11 — Block, report, moderation

```text
Implement P1.11 from memory.md §6.
Block/unblock with bidirectional visibility filtering,
report dialog + API with reason enum and duplicate suppression,
snapshot storage, admin-only moderation queue, remove/dismiss actions,
tests including non-admin 403.
```

### P1.12 — Admin roles & audit

```text
Implement P1.12 from memory.md §6.
admin_roles table, requireAdmin server-side, create-admin script,
user management (search, suspend, restore), audit_logs for every action,
tests. No public admin signup.
```

### P1.13 — QA & release gate

```text
Implement P1.13 from memory.md §6.
Add integration tests for all MVP flows, RLS test SQL, Playwright smoke,
run type-check/lint/build/tests, fix all failures,
verify the Phase 1 exit criteria in memory.md §5.2 with evidence,
update status to TESTED only where proven.
```

---

## 5. Per-feature prompt (Phase 2+)

```text
Implement <FEATURE> exactly as specified in memory.md §<section> and docs/features.md.
Before coding:
- list files to touch,
- list DB changes (migration, indexes, constraints, RLS),
- list API contracts,
- list authorization rules,
- list test cases including denied cases.

Then implement: migration, service, validated API, UI with loading/empty/error,
privacy/block rules, tests.
Do not modify unrelated features.
Update memory.md §15, docs/status.md, docs/changelog.md.
Report with evidence.
```

---

## 6. Release gate prompt

```text
Verify the Phase 1 exit criteria in memory.md §5.2.

Run:
- npm run type-check
- npm run lint
- npm run build
- npm run test
- RLS tests (supabase/tests/rls.sql)
- E2E smoke if configured

Then execute the manual checklist in docs/testing.md §8.

For every criterion, provide evidence: command output or manual steps + result.
If a criterion fails, fix it or mark the phase BLOCKED with the exact blocker.
Only then update docs/status.md and write the release report.
```

---

## 7. Debugging prompt

```text
A failure occurred in <feature>.
1. Reproduce it with the exact steps.
2. Capture the error, stack trace, request, and relevant DB state.
3. Identify the root cause (do not guess).
4. Fix the smallest correct layer.
5. Add a regression test.
6. Run type-check/lint/build/tests.
7. Update docs/changelog.md with the fix.
Report: root cause, fix, test evidence.
```

---

## 8. Documentation sync prompt

```text
Read memory.md, docs/status.md, docs/roadmap.md, docs/features.md,
docs/database.md, docs/security.md, docs/testing.md, docs/changelog.md.

Compare them with the actual code.
Fix contradictions. Update statuses with evidence.
Do not invent completed features. Do not delete architectural decisions.
Append a changelog entry describing the sync.
```

---

## 9. Phase 2 kickoff prompt (only after gate)

```text
Phase 1 is TESTED and the release gate passed.
Read memory.md §7 and implement P2.1 Stories first, then P2.2 Reels.

Start with:
- migration 003_phase2_social.sql (stories + views + reactions + highlights),
- expiry job,
- visibility enforcement,
- upload integration,
- UI tray/viewer/highlights,
- tests for expiry and privacy.

Do not start Communities, Polls, Collections, or personalized feed in this session.
Update status and report.
```

---

## 10. Phase 3/4/5 kickoff prompts

```text
Phase 3: Read memory.md §8. Implement P3.1 Direct Messaging only.
Include conversations, members, messages, receipts, request gating,
block enforcement, realtime, tests. No group chats or voice yet.

Phase 4: Read memory.md §9. Implement P4.2 analytics event pipeline first,
then P4.1 dashboard. Numbers must reconcile with raw events.

Phase 5: Read memory.md §10. Implement P5.1 live streaming with a real provider.
Do not build static/fake live UI.
```

---

## 11. Prompt hygiene

- One work package per session.
- Always include the current status of the target feature.
- Always ask for a plan before edits.
- Always demand evidence for `TESTED`.
- Never ask for "all features" in one prompt.
- When output is large, ask for a diff summary + file list, not full files.
- If Antigravity proposes a new dependency, require an ADR entry in `memory.md` §16.
