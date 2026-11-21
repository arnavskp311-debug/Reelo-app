# REELO — Development Roadmap

**Version:** 2.0
**Active phase:** Phase 1 — Core MVP
**Source of truth:** `memory.md`

---

## 1. Roadmap at a glance

```
Phase 1  Core MVP            Auth · Profiles · Feed · Posts+Media · Engagement
   │                         Follows · Search · Saved · Notifications · Safety · Admin
   ▼
Phase 2  Social Experience   Stories · Shorts/Reels · Communities · Polls · Collections · Feed v1
   │
   ▼
Phase 3  Communication       DMs · Groups · Voice · Requests · Realtime notifications
   │
   ▼
Phase 4  Creator Ecosystem   Dashboard · Analytics · Events · Achievements · Discovery
   │
   ▼
Phase 5  Advanced Platform   Live · Advanced recs · Advanced moderation · Platform analytics · Scale
```

Each phase ends with a **release gate**. The next phase does not start until the gate passes.

---

## 2. Phase 1 — Core MVP

**Goal:** A secure, multi-user social foundation.

| ID | Work package | Depends on | Est. effort | Exit evidence |
|---|---|---|---|---|
| P1.0 | Foundation, audit & cleanup | — | 1–2 days | Demo fallback removed; env validation; test harness |
| P1.1 | Schema, migrations & seed | P1.0 | 1–2 days | `init-db` from scratch; FKs + indexes |
| P1.2 | Authentication & sessions | P1.1 | 2–3 days | Auth integration tests pass |
| P1.3 | Profiles & settings | P1.2 | 2 days | Profile edit + privacy tests |
| P1.4 | Media upload pipeline | P1.2 | 2–3 days | Type/size validation tests |
| P1.5 | Posts, composer & feed | P1.3, P1.4 | 3 days | Post CRUD + feed isolation tests |
| P1.6 | Likes & comments | P1.5 | 2 days | Idempotency + authz tests |
| P1.7 | Follow graph | P1.5 | 1–2 days | Counts + feed filtering tests |
| P1.8 | Search | P1.5 | 2 days | Search integration tests |
| P1.9 | Saved posts | P1.5 | 1 day | Privacy test |
| P1.10 | Notifications | P1.6, P1.7 | 1–2 days | Event creation + dedupe tests |
| P1.11 | Block, report & moderation | P1.5–P1.7 | 2–3 days | Block filtering + admin authz tests |
| P1.12 | Admin roles & audit | P1.11 | 1–2 days | Role + audit tests |
| P1.13 | QA & release gate | all | 2–3 days | Full checklist + smoke E2E |

**Phase 1 gate:** all 11 MVP features `TESTED`; type-check/lint/build clean; RLS verified; responsive check at 360/768/1440 px.

> Estimates assume one developer/agent working sequentially. They are planning aids, not commitments.

---

## 3. Phase 2 — Social Experience

**Goal:** Depth and discovery after the foundation is stable.

| ID | Feature | Key dependencies | Main risk |
|---|---|---|---|
| P2.1 | Stories & highlights | Media pipeline, follows | Expiry job + privacy leaks |
| P2.2 | Shorts / Reels | Media pipeline, video metadata | Bandwidth/transcoding |
| P2.3 | Communities | Roles, moderation | Private-community access control |
| P2.4 | Polls & discussions | Posts, comments | Vote integrity |
| P2.5 | Saved collections | Bookmarks | Migration of existing saves |
| P2.6 | Personalized feed v1 | Interests, follows | Explainability, filter bubbles |

**Gate:** media lifecycle stable; expired stories inaccessible; community roles enforced; vote uniqueness proven; feed controls work.

---

## 4. Phase 3 — Communication

| ID | Feature | Key dependencies | Main risk |
|---|---|---|---|
| P3.1 | Direct messaging | Auth, blocks, settings | Authorization + realtime ordering |
| P3.2 | Group chats | P3.1 | Role enforcement |
| P3.3 | Voice messages | Storage, P3.1 | Private audio access |
| P3.4 | Message requests | P3.1 | Spam/abuse |
| P3.5 | Realtime notifications | P3.1, notifications | Missed events on reconnect |

**Gate:** non-members denied; blocked pairs cannot message; realtime delivery < 2 s; reconnect recovers missed messages; voice files private.

---

## 5. Phase 4 — Creator Ecosystem

| ID | Feature | Key dependencies | Main risk |
|---|---|---|---|
| P4.1 | Creator dashboard | Analytics events | Misleading metrics |
| P4.2 | Creator analytics | Event pipeline | Volume/cost, privacy |
| P4.3 | Events | Notifications | Timezones, capacity |
| P4.4 | Achievements & badges | Verified events | Gaming the system |
| P4.5 | Creator discovery | Search, stats | Dead/inactive profiles |

**Gate:** dashboard reconciles with raw events; badge job idempotent; RSVP capacity enforced.

---

## 6. Phase 5 — Advanced Platform

| ID | Feature | Key dependencies | Main risk |
|---|---|---|---|
| P5.1 | Live streaming | Provider, moderation | Cost, latency, abuse |
| P5.2 | Advanced recommendations | Event data, ML infra | Safety, explainability |
| P5.3 | Advanced moderation | Classifiers, appeals | False positives |
| P5.4 | Platform analytics | Warehouse | Privacy |
| P5.5 | Scalability & optimization | All | Cost/complexity |

**Gate:** real live stream verified end-to-end; load tests at 10× baseline; moderation SLAs met; no critical single point of failure.

---

## 7. Cross-phase rules

- Every feature ships with: migration, service, API, UI states, authorization, tests, docs.
- No phase starts with unresolved critical security issues from the previous phase.
- Feature flags gate unfinished work: `NEXT_PUBLIC_FEATURE_STORIES`, `_REELS`, `_COMMUNITIES`, `_MESSAGES`, `_LIVE`, `_CREATOR`.
- Mobile (React Native/Expo) begins only after Phase 3 contracts are stable.

---

## 8. Suggested near-term sequence (next 10 sessions)

1. P1.0 foundation
2. P1.1 schema
3. P1.2 auth
4. P1.3 profiles
5. P1.4 uploads
6. P1.5 feed
7. P1.6 engagement
8. P1.7 follows
9. P1.8 search
10. P1.9–P1.10 saved + notifications

Then P1.11–P1.13, gate, and Phase 2 kickoff.
