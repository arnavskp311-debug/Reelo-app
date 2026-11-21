# REELO — Security, Privacy & Trust

**Version:** 2.0
**Source of truth:** `memory.md`

> Security is a launch requirement, not a Phase 5 task. Every mutation is authorized server-side.

---

## 1. Threat model (summary)

| Threat | Example | Control |
|---|---|---|
| Credential stuffing | Automated login attempts | Rate limit, generic errors, optional CAPTCHA |
| Account takeover | Stolen session | HttpOnly/Secure cookies, rotation, expiry |
| IDOR | Editing another user's post by ID | Ownership checks in services + RLS |
| Privilege escalation | Calling admin API directly | `requireAdmin()` + RLS on admin tables |
| Content injection | XSS via bio/link | React escaping, URL allowlist, CSP |
| Malicious upload | Executable disguised as image | Magic-byte validation, MIME allowlist, no execution |
| Harassment | Abusive DMs/comments | Block, report, rate limits, moderation |
| Spam | Bulk follows/posts | Per-action rate limits, dedupe |
| Data scraping | Enumerating users | Pagination limits, auth required, monitoring |
| Privacy leak | Private post via API | Server-side visibility checks + RLS tests |
| Secret leak | Service key in bundle | Server-only env, bundle scan in CI |
| Replay/CSRF | Cross-site POST | SameSite=Lax + Origin check |

---

## 2. Authentication

### 2.1 Passwords

- Hash with `scrypt` (N=16384, r=8, p=1) or Argon2id.
- Per-user random salt; store algorithm parameters.
- Constant-time comparison.
- Policy: 8–72 chars; reject common passwords; no forced composition rules.
- Never log passwords, hashes, or reset tokens.

### 2.2 Sessions

- Random 32-byte session id; stored hashed or as opaque id in `sessions`.
- Cookie: `HttpOnly; SameSite=Lax; Path=/; Secure` in production; 30-day expiry.
- Rotate session id on login; delete row on logout.
- Reject expired sessions in middleware and `requireUser()`.
- Suspended users: sessions revoked immediately.

### 2.3 Supabase Auth

- Email/password provider; email verification recommended.
- `profiles.id = auth.users.id`; profile creation via trigger.
- Service-role key only in server-side admin/jobs.
- Never trust `user_metadata` for authorization.

### 2.4 Recovery (P1)

- Time-limited, single-use reset token (hashed at rest).
- Generic response whether or not the email exists.
- Reset invalidates all sessions.

---

## 3. Authorization

### 3.1 Guards

```ts
requireUser()            // 401 if no valid session
requireOwner(resource)   // 403 if actor != owner
requireAdmin(role?)      // 403 if no admin role
assertNotBlocked(a, b)   // 403/404 for interactions
assertCanView(post, actor) // visibility + block + suspension
```

### 3.2 Rules

- `userId` comes only from the session.
- Every service mutation takes `actorId` and checks it.
- Client-side hiding is UX only; server is authoritative.
- Admin routes are never protected by UI conditionals alone.
- Ownership checks use IDs from the database, not request payloads.

### 3.3 Authorization matrix (Phase 1)

| Action | Guest | User | Owner | Moderator | Super admin |
|---|---|---|---|---|---|
| View public post | ✅ | ✅ | ✅ | ✅ | ✅ |
| View followers-only post | ❌ | follower only | ✅ | ✅ | ✅ |
| Create post | ❌ | ✅ | — | ✅ | ✅ |
| Edit/delete post | ❌ | ❌ | ✅ | ✅ | ✅ |
| Like/comment | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit profile | ❌ | ❌ | ✅ | ❌ | ✅ |
| View admin queue | ❌ | ❌ | ❌ | ✅ | ✅ |
| Remove content | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage admin roles | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit log | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 4. Row Level Security

- RLS enabled on every exposed table; default deny.
- Policies in `docs/database.md` §4.
- `is_admin()`, `is_blocked()`, `is_following()` are `security definer` helpers with fixed `search_path`.
- Test RLS as `anon`, `authenticated user A`, `authenticated user B`, `moderator`, `super_admin`.
- Denied cases must be tested explicitly, not just allowed cases.

---

## 5. Input validation

- Zod schemas per domain; reject unknown fields.
- Normalize usernames to lowercase; trim whitespace.
- Limits: post 2,000; comment 1,000; bio 300; report 1,000; search 100.
- URLs: only `http`/`https`; reject `javascript:`, `data:`.
- Parameterized SQL only; never string-concatenate user input.
- HTML is not accepted in text fields; React escapes output.
- Add a Content Security Policy in production (`default-src 'self'`, allow image CDN).

---

## 6. Uploads

- Validate magic bytes, not just `Content-Type`.
- Allowlist: jpg/png/webp/avif; mp4/webm; webm/m4a/ogg for voice.
- Size limits enforced server-side.
- Randomized filenames; never trust client path.
- Store outside the web root in production; serve via CDN/signed URL.
- Strip EXIF (GPS) from images.
- Never execute or render uploaded HTML/SVG as active content.
- Orphan cleanup after 24 h.

---

## 7. Rate limiting & abuse

| Action | Limit |
|---|---|
| Login | 5 / 15 min per IP+email |
| Signup | 5 / hour per IP |
| Post create | 10 / hour per user |
| Comment | 30 / hour per user |
| Follow | 100 / day per user |
| Report | 10 / day per user |
| Upload | 30 / hour per user |
| Search | 60 / min per user |
| DM (Phase 3) | 20 new conversations / day |

Implementation: in-memory for local dev; Redis/Upstash or DB-backed for production. Return `429` with `Retry-After`.

Additional controls: duplicate report suppression, follow-back limits, new-account restrictions (e.g. no DMs for 24 h), spam heuristics.

---

## 8. Privacy

- Private profile: posts visible only to followers; enforced in queries/RLS.
- Post visibility: `public` or `followers`.
- DM policy: `everyone`, `followers`, `nobody`.
- Story viewer list: author only.
- Saved posts/collections: owner only.
- Analytics: aggregated, no PII in metadata.
- Account deletion: 30-day grace, then cascade content + storage purge; audit logs retain anonymized actor id.
- Data export: JSON of profile, posts, comments, follows (P1).
- No selling data; no third-party trackers in MVP.

---

## 9. Moderation & trust

- Report categories: spam, harassment, hate speech, misinformation, nudity, violence, other.
- Report snapshot stored (content, author, timestamp) to survive deletion.
- Queue states: `pending → reviewing → resolved | dismissed`.
- Actions: dismiss, remove content, warn, suspend (with duration), restore.
- Every action writes `moderation_actions` + `audit_logs`.
- SLA target: 90% of reports reviewed within 24 h.
- Appeals in Phase 5; until then, support email.
- Transparency: publish community guidelines and enforcement summary.

---

## 10. Admin security

- Roles: `super_admin`, `moderator`, `support`.
- Admin access granted only via script/service role, never public signup.
- `requireAdmin()` on every admin route and server action.
- Sensitive actions (role change, suspension) require confirmation + audit.
- No admin impersonation in MVP.
- Admin sessions follow the same cookie rules; optional shorter expiry.

---

## 11. Secrets & infrastructure

- `.env.local` gitignored; `.env.example` placeholders only.
- `SUPABASE_SERVICE_ROLE_KEY` never prefixed `NEXT_PUBLIC_`.
- CI scans the client bundle for accidental secrets.
- Rotate keys after any suspected exposure.
- Least-privilege DB roles; service role only where required.
- Backups encrypted; restore tested quarterly.

---

## 12. Logging & monitoring

Log: auth success/failure (no password), admin actions, moderation actions, rate-limit hits, upload rejections, 5xx errors.
Do not log: passwords, tokens, cookies, message bodies, full emails in plaintext.

Alerts: spike in 401/403/429, report backlog, storage growth, error rate.

---

## 13. Incident response

1. Detect (alert/report).
2. Contain (revoke sessions/keys, disable endpoint).
3. Assess scope (logs, audit trail).
4. Fix + deploy.
5. Notify affected users if personal data exposed.
6. Post-mortem + prevention task in `memory.md`.

---

## 14. Security checklist (per work package)

- [ ] Server-side authorization on every mutation.
- [ ] Zod validation on every input.
- [ ] No `userId` from request body.
- [ ] RLS/policy added or updated.
- [ ] Rate limit applied where relevant.
- [ ] Upload validation (if media).
- [ ] No secrets in client code.
- [ ] Audit log for admin/moderation actions.
- [ ] Denied-case test added.
- [ ] Error messages do not leak internals.
