# REELO — Product Requirements Document (PRD)

**Version:** 2.0
**Owner:** Product
**Status:** Approved for Phase 1 execution
**Companion docs:** `memory.md` (master spec), `docs/features.md`, `docs/roadmap.md`, `docs/database.md`

---

## 1. Summary

REELO is an all-in-one social networking platform: everyday posts, short video, communities, private messaging, live streaming, polls, events, creator tools, and achievements — unified under a calm, premium "Natural Premium" identity.

**Full form:** Real Expressions, Everyday Life, Online.
**Tagline:** Connect. Create. Discover.
**Brand line:** Your World. Your People. Your REELO.

This PRD defines **what** REELO must do, **for whom**, and **how success is measured**. The **how** lives in `memory.md` and `docs/database.md`.

---

## 2. Problem & opportunity

### 2.1 Problem

Today's social products force trade-offs:

- Feed-first platforms optimize for outrage and passive scrolling.
- Messaging platforms lack discovery and creator tools.
- Community platforms feel utilitarian and fragmented.
- Creators lack transparent, real analytics.
- Privacy controls are buried or all-or-nothing.

### 2.2 Opportunity

A single, calm platform where a user can share a moment, watch a short video, join a focused community, message a friend, and grow an audience — without switching apps or sacrificing privacy.

### 2.3 Positioning

> REELO is the **calm social universe**: real people, real communities, real creators — with safety and privacy built in from day one.

Not a clone. The differentiation is **tone** (calm, editorial), **trust** (safety in MVP), and **creator transparency** (real metrics).

---

## 3. Goals & success metrics

### 3.1 Product goals (12 months)

1. Ship a secure, multi-user MVP.
2. Reach product-market signal with a small beta cohort.
3. Establish a creator loop (post → audience → insight).
4. Keep safety response times under 24 hours.

### 3.2 Success metrics

| Area | Metric | Target (beta) |
|---|---|---|
| Activation | New user completes profile + first post within 24 h | ≥ 40% |
| Retention | D7 retention | ≥ 25% |
| Engagement | Weekly active / monthly active | ≥ 45% |
| Content | Posts per active user per week | ≥ 2 |
| Social graph | New users following ≥ 5 accounts in week 1 | ≥ 50% |
| Safety | Reports resolved within 24 h | ≥ 90% |
| Performance | Feed API p95 | < 500 ms |
| Reliability | Uptime | ≥ 99.5% |
| Quality | Build/type/lint clean on main | 100% |

Metrics are reviewed monthly; vanity metrics (raw signups, total likes) are not primary.

---

## 4. Personas

| Persona | Description | Primary jobs |
|---|---|---|
| **Maya, 24** | Everyday sharer, mobile-first | Share moments, keep privacy, see friends |
| **Arjun, 29** | Creator, posts short video | Grow audience, understand performance |
| **Sara, 33** | Community organizer | Run a focused group, moderate safely |
| **Nina, 27** | Privacy-conscious | Control visibility, avoid unwanted DMs |
| **Dev, 30** | Platform admin | Resolve reports, keep platform safe |

---

## 5. Scope

### 5.1 MVP (Phase 1)

Authentication · Profiles & customization basics · Home feed · Text/image/video posts with real uploads · Likes & comments · Follow system · Basic search · Saved posts · Notifications · Block & report · Basic admin moderation.

### 5.2 Future phases

| Phase | Scope |
|---|---|
| 2 | Stories, Shorts/Reels, Communities, Polls & Discussions, Saved Collections, Personalized feed v1 |
| 3 | DMs, Group chats, Voice messages, Message requests, Realtime notifications |
| 4 | Creator dashboard, Creator analytics, Events, Achievements & Badges, Creator discovery |
| 5 | Live streaming, Advanced recommendations, Advanced moderation, Platform analytics, Scale/security |

### 5.3 Out of scope (all phases unless re-approved)

Monetization, ads, e-commerce, dating, encrypted secret chats, crypto, third-party app marketplace, desktop native apps.

---

## 6. Functional requirements

### 6.1 Authentication (AUTH)

| ID | Requirement | Priority |
|---|---|---|
| AUTH-1 | Sign up with email, password, unique username, display name | P0 |
| AUTH-2 | Passwords hashed with scrypt/Argon2id; never stored plaintext | P0 |
| AUTH-3 | Login issues an HttpOnly session cookie | P0 |
| AUTH-4 | Logout invalidates the session server-side | P0 |
| AUTH-5 | Session persists across refresh; expires after 30 days | P0 |
| AUTH-6 | Rate-limit login attempts (5 / 15 min) | P0 |
| AUTH-7 | Suspended users cannot log in or act | P0 |
| AUTH-8 | Password reset via email | P1 |
| AUTH-9 | Email verification | P1 |
| AUTH-10 | Account deletion with 30-day grace | P1 |

**User stories**

- *As a new user, I want to create an account with a unique handle so people can find me.*
  - Reject duplicate email/username with a clear message.
  - Auto-create profile + default settings.
- *As a returning user, I want to log in securely so only I can access my account.*
  - Wrong password → generic error, no account enumeration.
- *As a user, I want to log out on a shared device so my session ends.*
  - Cookie cleared; session row deleted; back button cannot restore access.

---

### 6.2 Profiles & customization (PROF)

| ID | Requirement | Priority |
|---|---|---|
| PROF-1 | Public profile at `/profile/[username]` | P0 |
| PROF-2 | Edit display name, username, bio, location, website | P0 |
| PROF-3 | Upload avatar and cover image | P0 |
| PROF-4 | Follower/following/post counts | P0 |
| PROF-5 | Private profile hides content from non-followers | P0 |
| PROF-6 | Username change rate-limited (2 / 30 days) | P1 |
| PROF-7 | Pinned posts | P2 |
| PROF-8 | Profile themes | P2 |

**Stories**

- *As a creator, I want to customize my profile so my identity is clear.*
  - Only owner can edit; changes persist.
- *As a private user, I want my posts hidden from strangers.*
  - Enforced server-side, not only in UI.

---

### 6.3 Posts & media (POST)

| ID | Requirement | Priority |
|---|---|---|
| POST-1 | Create text post (≤ 2,000 chars) | P0 |
| POST-2 | Attach up to 4 images or 1 video | P0 |
| POST-3 | Real upload with MIME/size validation | P0 |
| POST-4 | Hashtags (≤ 10) | P0 |
| POST-5 | Edit/delete own post (soft delete) | P0 |
| POST-6 | Visibility public / followers | P0 |
| POST-7 | Alt text for images | P1 |
| POST-8 | Drafts | P2 |

**Stories**

- *As a user, I want to share a photo or video so friends can see my moment.*
  - Upload progress; failure retry; post appears in feed and profile.
- *As a user, I want to delete my post so it disappears everywhere.*
  - Soft delete; 404 afterwards; media cleanup queued.

---

### 6.4 Feed (FEED)

| ID | Requirement | Priority |
|---|---|---|
| FEED-1 | Following feed (chronological) | P0 |
| FEED-2 | Discover feed (recency + engagement) | P0 |
| FEED-3 | Cursor pagination, no duplicates | P0 |
| FEED-4 | Exclude blocked/suspended content | P0 |
| FEED-5 | Loading, empty, error states | P0 |
| FEED-6 | “Why am I seeing this?” explanation | P1 |
| FEED-7 | Personalized ranking | Phase 2 |

**Stories**

- *As a user, I want a feed of people I follow so I don't miss their posts.*
  - New follow appears after refresh; unfollow removes content.
- *As a user, I want discovery content that isn't spam.*
  - Safety exclusions; diversity cap.

---

### 6.5 Likes & comments (ENG)

| ID | Requirement | Priority |
|---|---|---|
| ENG-1 | Toggle like, idempotent | P0 |
| ENG-2 | Comment on posts | P0 |
| ENG-3 | Delete own comment; post owner can remove comments on their post | P0 |
| ENG-4 | Counts accurate | P0 |
| ENG-5 | One-level replies | P1 |
| ENG-6 | Comment likes | P2 |

**Stories**

- *As a user, I want to react quickly so the creator knows I liked it.*
  - Double-like does not double-count.
- *As a post owner, I want to remove abusive comments.*
  - Authorized; audit optional.

---

### 6.6 Follow graph (SOC)

| ID | Requirement | Priority |
|---|---|---|
| SOC-1 | Follow/unfollow | P0 |
| SOC-2 | Cannot follow self/blocked user | P0 |
| SOC-3 | Follower/following lists | P0 |
| SOC-4 | Counts consistent | P0 |
| SOC-5 | Follow requests for private profiles | P1 |

---

### 6.7 Search (SRCH)

| ID | Requirement | Priority |
|---|---|---|
| SRCH-1 | Search users, posts, hashtags | P0 |
| SRCH-2 | Min 2 chars, debounced | P0 |
| SRCH-3 | Exclude blocked/private/suspended | P0 |
| SRCH-4 | Pagination | P0 |
| SRCH-5 | Filters and communities/events | Phase 2 |

**Stories**

- *As a user, I want to find a creator by name or handle.*
  - Exact and partial matches; handle prioritized.
- *As a user, I want to explore a hashtag.*
  - Results sorted by recency/engagement.

---

### 6.8 Saved posts (SAVE)

| ID | Requirement | Priority |
|---|---|---|
| SAVE-1 | Save/unsave a post | P0 |
| SAVE-2 | Private saved list | P0 |
| SAVE-3 | Saved tab on own profile | P0 |
| SAVE-4 | Collections | Phase 2 |

---

### 6.9 Notifications (NOTIF)

| ID | Requirement | Priority |
|---|---|---|
| NOTIF-1 | Create on like/comment/follow (not self) | P0 |
| NOTIF-2 | Deduplicate repeated events | P0 |
| NOTIF-3 | Unread count + mark read/all | P0 |
| NOTIF-4 | Navigate to target | P0 |
| NOTIF-5 | Realtime delivery | Phase 3 |

---

### 6.10 Block & report (SAFE)

| ID | Requirement | Priority |
|---|---|---|
| SAFE-1 | Block/unblock a user | P0 |
| SAFE-2 | Block hides content bidirectionally | P0 |
| SAFE-3 | Report post/comment/user with reason | P0 |
| SAFE-4 | Duplicate report throttled | P0 |
| SAFE-5 | Report snapshot preserved | P1 |
| SAFE-6 | Appeals | Phase 5 |

---

### 6.11 Admin moderation (ADMIN)

| ID | Requirement | Priority |
|---|---|---|
| ADMIN-1 | Admin role table + server-side check | P0 |
| ADMIN-2 | Report queue with filters | P0 |
| ADMIN-3 | Remove content (soft delete) | P0 |
| ADMIN-4 | Suspend/restore user | P0 |
| ADMIN-5 | Audit every action | P0 |
| ADMIN-6 | Platform counts | P1 |
| ADMIN-7 | Role management UI | P2 |

---

### 6.12 Stories (STORY) — Phase 2

| ID | Requirement |
|---|---|
| STORY-1 | Create image/video/text story |
| STORY-2 | 24-hour expiry |
| STORY-3 | Visibility public/followers/close friends |
| STORY-4 | Views counted once; author-only viewer list |
| STORY-5 | Reactions and replies |
| STORY-6 | Highlights |

**Story:** *As a creator, I want my story to disappear after a day so I can share casually.*

---

### 6.13 Shorts / Reels (REEL) — Phase 2

| ID | Requirement |
|---|---|
| REEL-1 | Vertical full-screen feed |
| REEL-2 | Upload ≤ 3 min, 9:16 |
| REEL-3 | Like/comment/share/save/follow |
| REEL-4 | View counting (2 s / 50%) |
| REEL-5 | Captions + hashtags |
| REEL-6 | Recommendation feed (Phase 4 ranking) |

**Story:** *As a viewer, I want to swipe through short videos without leaving the app.*

---

### 6.14 Communities (COMM) — Phase 2

| ID | Requirement |
|---|---|
| COMM-1 | Create public/private community |
| COMM-2 | Join/leave; request for private |
| COMM-3 | Roles owner/moderator/member |
| COMM-4 | Community posts and guidelines |
| COMM-5 | Moderator tools |
| COMM-6 | Report content/members |

**Story:** *As an organizer, I want a private space with moderators so discussions stay healthy.*

---

### 6.15 Direct messaging (DM) — Phase 3

| ID | Requirement |
|---|---|
| DM-1 | 1:1 conversations |
| DM-2 | Text/image/shared post messages |
| DM-3 | Read receipts + delivery state |
| DM-4 | Message requests |
| DM-5 | Block/report in chat |
| DM-6 | Realtime updates |
| DM-7 | Group chats |

**Story:** *As a user, I want to chat privately without giving my phone number.*

---

### 6.16 Voice messages (VOICE) — Phase 3

| ID | Requirement |
|---|---|
| VOICE-1 | Record and send audio ≤ 5 min |
| VOICE-2 | Playback with seek/speed |
| VOICE-3 | Cancel recording |
| VOICE-4 | Upload progress/retry |
| VOICE-5 | Private access only |

---

### 6.17 Live streaming (LIVE) — Phase 5

| ID | Requirement |
|---|---|
| LIVE-1 | Real live stream via provider |
| LIVE-2 | Viewer count from provider |
| LIVE-3 | Live chat + moderation |
| LIVE-4 | Host controls |
| LIVE-5 | Optional replay |
| LIVE-6 | Report stream |

**Story:** *As a creator, I want to go live with my community in real time.*

---

### 6.18 Polls & discussions (POLL) — Phase 2

| ID | Requirement |
|---|---|
| POLL-1 | Attach poll to post (2–6 options) |
| POLL-2 | Single/multiple choice |
| POLL-3 | One vote per user; results |
| POLL-4 | Close time / early close |
| POLL-5 | Topic discussions with threaded comments |

---

### 6.19 Creator dashboard & analytics (STUDIO) — Phase 4

| ID | Requirement |
|---|---|
| STUDIO-1 | Followers, reach, engagement, profile views |
| STUDIO-2 | Top posts / videos |
| STUDIO-3 | Date ranges 7/30/90 |
| STUDIO-4 | Audience insights |
| STUDIO-5 | Real data only; reconcile with events |

---

### 6.20 Events (EVENT) — Phase 4

| ID | Requirement |
|---|---|
| EVENT-1 | Create online/offline event |
| EVENT-2 | RSVP going/interested/declined |
| EVENT-3 | Capacity |
| EVENT-4 | Attendee list |
| EVENT-5 | Updates + reminders |
| EVENT-6 | Cancel event |

---

### 6.21 Achievements & badges (BADGE) — Phase 4

| ID | Requirement |
|---|---|
| BADGE-1 | Criteria-based achievements |
| BADGE-2 | Idempotent award job |
| BADGE-3 | Profile badge shelf |
| BADGE-4 | Progress view |
| BADGE-5 | Revocation with audit |

---

### 6.22 Saved collections (COLL) — Phase 2

| ID | Requirement |
|---|---|
| COLL-1 | Create/rename/delete collections |
| COLL-2 | Add/remove saved posts |
| COLL-3 | Private by default |
| COLL-4 | Default “Saved” collection |

---

### 6.23 Advanced search (ASRCH) — Phase 2

| ID | Requirement |
|---|---|
| ASRCH-1 | Users, posts, hashtags, videos, communities, events |
| ASRCH-2 | Filters + sort + pagination |
| ASRCH-3 | Privacy/safety exclusions |
| ASRCH-4 | Recent searches (local) |

---

### 6.24 Personalized feed (PFEED) — Phase 2

| ID | Requirement |
|---|---|
| PFEED-1 | Interest selection |
| PFEED-2 | Ranking by follows/interests/recency/quality |
| PFEED-3 | “Not interested” + mute |
| PFEED-4 | Explanation |
| PFEED-5 | Diversity cap |

---

## 7. Non-functional requirements

### 7.1 Security

- OWASP Top 10 mitigations; server-side authorization on every mutation.
- RLS enabled on all exposed tables.
- Secrets server-only; no service key in client.
- Upload validation; rate limiting; audit logs.
- Account deletion and data export (P1).

### 7.2 Performance

- Feed p95 < 500 ms production.
- LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- Images responsive; video posters only in lists.
- Cursor pagination everywhere.

### 7.3 Accessibility

- WCAG 2.1 AA: contrast, focus, labels, keyboard.
- Reduced motion respected.
- Alt text required for uploads.

### 7.4 Privacy

- Private profiles, followers-only posts, DM settings.
- Viewer lists author-only.
- Analytics aggregated; no PII in event metadata.
- Data retention: analytics 12 months; deleted content purged within 30 days.

### 7.5 Reliability & observability

- Structured logs with request id.
- Error tracking (Sentry or equivalent) in production.
- Health endpoint; DB backups.
- Migration rollback plan.

### 7.6 Compatibility

- Evergreen Chrome/Edge/Firefox/Safari; iOS Safari 16+; Android Chrome.
- Responsive at 360 / 768 / 1024 / 1440 px.
- PWA installable; offline read-only later.

---

## 8. Release criteria

### 8.1 MVP release

- [ ] All 11 MVP features `TESTED`.
- [ ] Two-account isolation verified.
- [ ] Auth, authorization, RLS tests pass.
- [ ] Type-check, lint, build clean.
- [ ] Manual QA matrix signed off.
- [ ] Privacy policy, terms, community guidelines published.
- [ ] Backup + rollback documented.

### 8.2 Beta launch

- [ ] 50–200 invited users.
- [ ] Report SLA monitored.
- [ ] Error tracking + analytics live.
- [ ] Onboarding checklist (profile, follow 5, first post).

---

## 9. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep from 15 features | Delays MVP | Strict phase gates; feature flags |
| Media costs (video) | High | Limits, posters, transcoding later, CDN |
| Moderation load | Safety | MVP report queue, SLAs, rate limits |
| Auth migration (SQLite → Supabase) | Rework | Adapter layer; auth tests |
| Privacy leaks | Trust | Server-side checks + RLS tests |
| Fake/demo features shipping | Credibility | Status vocabulary + evidence log |
| Live provider complexity | Phase 5 risk | Defer; prototype only with real provider |
| Legal/compliance | Launch block | Terms, age gate, data deletion |

---

## 10. Open questions

1. Monetization model — subscriptions, tips, or none at launch?
2. E2E encryption for DMs — v2 or never?
3. Age gate: 13+ global or 18+ in some regions?
4. Data residency requirements?
5. Live provider choice (LiveKit vs Agora vs Mux)?
6. Email provider for verification/reset?
7. Community discovery: algorithmic or curated at launch?
8. Private profiles: auto-accept follows in MVP (decision D-011); revisit follow requests in Phase 2.

> Decisions must be recorded in `memory.md` §16 when resolved.

---

## 11. Approvals

| Role | Name | Status |
|---|---|---|
| Product | — | Approved (v2.0) |
| Engineering | — | Pending Phase 1 kickoff |
| Design | — | Natural Premium tokens approved |
| Security | — | Pending auth hardening |
