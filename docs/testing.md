# REELO — Testing & QA

**Version:** 2.0
**Source of truth:** `memory.md`

> A feature is `TESTED` only with reproducible evidence. UI presence is not evidence.

---

## 1. Test strategy

```
        E2E (few)          critical journeys, real browser
      Integration          API + DB + auth + authorization
    Unit (many)            validation, hashing, ranking, permissions, utils
```

Every work package adds tests at the appropriate level. Security rules require **denied-case** tests, not only happy paths.

---

## 2. Setup (P1.0)

```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test   # optional until P1.13
```

`package.json` scripts:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "next lint",
    "build": "next build",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

Test environment rules:
- Each integration test uses an isolated DB (temp SQLite file or a Supabase test schema).
- Never run destructive tests against development data.
- Seed only what the test needs; clean up in `afterEach`.
- Freeze time for expiry/ranking tests.

---

## 3. Baseline commands

```bash
npm run type-check
npm run lint
npm run build
npm run test
npm run test:e2e     # when configured
```

All four must pass before a phase gate. Build failures are never ignored.

---

## 4. Unit tests

| Area | Cases |
|---|---|
| Validation | username regex, bio length, post length, URL allowlist, report reason enum |
| Password | hash format, verify correct/incorrect, timing-safe compare |
| Ranking | score ordering, recency decay, diversity cap |
| Permissions | owner vs non-owner, admin vs user, blocked pair |
| Formatters | relative time, counts (1.2k), truncation |
| Pagination | cursor encode/decode, no duplicates |

---

## 5. Integration tests (API + DB)

| ID | Scenario | Expected |
|---|---|---|
| AUTH-01 | Signup valid | 201, profile + settings created, session cookie |
| AUTH-02 | Signup duplicate email | 409 |
| AUTH-03 | Signup duplicate username | 409 |
| AUTH-04 | Login correct | 200, new session |
| AUTH-05 | Login wrong password | 401, generic message |
| AUTH-06 | Protected route without cookie | 401 |
| AUTH-07 | Logout then protected route | 401 |
| AUTH-08 | Suspended user login | 403 |
| PROF-01 | Edit own profile | 200, persisted |
| PROF-02 | Edit another profile | 403 |
| PROF-03 | Private profile post as stranger | hidden/404 |
| POST-01 | Create text post | 201, appears in feed |
| POST-02 | Create post with image | 201, media row |
| POST-03 | Oversized upload | 400 |
| POST-04 | Wrong MIME | 400 |
| POST-05 | Delete another user's post | 403 |
| POST-06 | Deleted post fetch | 404 |
| FEED-01 | Following feed shows only follows | correct |
| FEED-02 | Blocked author excluded | absent |
| FEED-03 | Pagination no duplicates | stable |
| ENG-01 | Like twice | count +1 only |
| ENG-02 | Comment persists | 201, listed |
| ENG-03 | Delete other's comment | 403 |
| SOC-01 | Follow/unfollow | counts correct |
| SOC-02 | Follow self | 400 |
| SOC-03 | Follow blocked user | 403 |
| SRCH-01 | Search user by handle | found |
| SRCH-02 | Search blocked content | absent |
| SAVE-01 | Save/unsave | private list correct |
| NOTIF-01 | Like creates notification | 1 row |
| NOTIF-02 | Self-like | no notification |
| NOTIF-03 | Duplicate like/unlike | deduped |
| SAFE-01 | Report post | row created |
| SAFE-02 | Duplicate pending report | rejected |
| SAFE-03 | Non-admin report queue | 403 |
| ADMIN-01 | Moderator removes post | soft-deleted |
| ADMIN-02 | Admin suspends user | login blocked |
| ADMIN-03 | Every action audited | audit row |

---

## 6. RLS tests (Supabase)

Run each assertion as a specific role using `set role` / JWT claims.

```sql
-- as user A
select count(*) from posts where author_id = 'B';           -- expected: 0 for followers-only
select count(*) from bookmarks where user_id = 'B';         -- expected: 0
select count(*) from reports;                               -- expected: only own
update posts set content = 'hacked' where author_id = 'B';  -- expected: 0 rows
delete from admin_roles where user_id = 'A';                -- expected: denied
```

Matrix to cover:

| Table | anon | user A | user B | moderator | super_admin |
|---|---|---|---|---|---|
| profiles (read) | public only | all active | all active | all | all |
| posts (read) | public | public + own + follows | same | all | all |
| posts (write) | ❌ | own | own | own + moderation | all |
| bookmarks | ❌ | own | own | own | own |
| notifications | ❌ | own | own | own | own |
| reports (read) | ❌ | own | own | all | all |
| audit_logs | ❌ | ❌ | ❌ | read | read |
| admin_roles | ❌ | own | own | own | all |

Store the SQL test file in `supabase/tests/rls.sql` and run it in CI against a disposable project/branch.

---

## 7. E2E smoke (Playwright)

1. Sign up user A → land on home → create text post.
2. Sign up user B (new context) → follow A → see A's post.
3. B likes + comments → A sees notification.
4. B saves post → appears in Saved.
5. B reports post → admin logs in → resolves → post hidden.
6. B blocks A → A's content disappears from B's feed and search.
7. A logs out → protected route redirects to login.

Assertions must be user-visible text/roles, not implementation details.

---

## 8. Manual QA checklist

### Responsive
- [ ] 360 px: nav, composer, feed, profile, modals usable; no horizontal scroll.
- [ ] 768 px: tablet layout; right rail hidden.
- [ ] 1440 px: three-column layout aligned.

### Accessibility
- [ ] Keyboard-only: login → post → like → comment.
- [ ] Visible focus on all controls.
- [ ] Icon buttons have `aria-label`.
- [ ] Form errors announced.
- [ ] Contrast AA on text and buttons.
- [ ] Reduced motion respected.

### States
- [ ] Loading skeletons on feed/profile/search.
- [ ] Empty states for no posts/followers/notifications.
- [ ] API failure shows retry, not a blank screen.
- [ ] Optimistic like/comment rolls back on failure.

### Security spot checks
- [ ] Remove session cookie → redirected/401.
- [ ] Change post ID in URL → 403/404.
- [ ] Call admin API as normal user → 403.
- [ ] Upload `.exe` renamed `.jpg` → rejected.
- [ ] Search for blocked user's content → absent.

---

## 9. Performance & accessibility budgets

| Check | Target |
|---|---|
| Feed API p95 | < 500 ms prod |
| Lighthouse performance (home) | ≥ 85 |
| Lighthouse accessibility | ≥ 95 |
| LCP | < 2.5 s |
| CLS | < 0.1 |
| Bundle (home, gzip) | < 250 KB |

Run Lighthouse in an incognito window against a production build, not dev.

---

## 10. Evidence log

Record every verification in `docs/status.md` §9:

```text
Date: 2026-11-21
Work package: P1.2 Authentication
Command/test: npm run test -- auth
Result: 8 passed, 0 failed
Manual: wrong password rejected; logout invalidates session
Status: TESTED
```

---

## 11. CI pipeline (target)

```yaml
# .github/workflows/ci.yml (outline)
on: [push, pull_request]
jobs:
  quality:
    steps:
      - npm ci
      - npm run type-check
      - npm run lint
      - npm run test
      - npm run build
  rls:
    steps:
      - supabase start
      - psql -f supabase/tests/rls.sql
  e2e:
    steps:
      - npm run build
      - npm run test:e2e
```

Merge blocked if any job fails.

---

## 12. Release gate checklist

- [ ] All MVP features `TESTED` with evidence.
- [ ] Type-check, lint, build, tests pass.
- [ ] RLS denied cases pass.
- [ ] E2E smoke passes.
- [ ] Manual responsive + accessibility checks pass.
- [ ] No critical console errors.
- [ ] Docs and status updated.
- [ ] Backup + rollback verified.
