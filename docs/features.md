# REELO — Feature Specification & Capability Matrix

**Version:** 2.0
**Source of truth:** `memory.md`
**Status legend:** `NOT_STARTED` · `PROTOTYPE` · `IN_PROGRESS` · `IMPLEMENTED` · `TESTED`

---

## 1. Feature matrix (15 categories)

| # | Feature | Phase | Status | Primary screens | Core tables |
|---|---|---|---|---|---|
| 1 | Stories | 2 | `PROTOTYPE` | Home tray, Story viewer, Highlights | `stories`, `story_views`, `story_reactions`, `story_highlights` |
| 2 | Shorts / Reels | 2 | `PROTOTYPE` | Reels feed, Reel detail | `posts` (`kind='reel'`), `reel_views` |
| 3 | Communities | 2 | `PROTOTYPE` | Directory, Community home, Members | `communities`, `community_members` |
| 4 | Direct Messaging | 3 | `PROTOTYPE` | Inbox, Thread | `conversations`, `messages` |
| 5 | Voice Messages | 3 | `NOT_STARTED` | Recorder, Player | `messages` (`content_type='voice'`) |
| 6 | Live Streaming | 5 | `NOT_STARTED` | Go live, Live room | `live_streams`, `live_viewers` |
| 7 | Polls & Discussions | 2 | `NOT_STARTED` | Composer poll, Discussion thread | `polls`, `poll_options`, `poll_votes` |
| 8 | Creator Dashboard | 4 | `NOT_STARTED` | Studio overview, Analytics | `creator_stats_daily`, `analytics_events` |
| 9 | Events | 4 | `NOT_STARTED` | Event page, RSVP, Updates | `events`, `event_attendees` |
| 10 | Achievements & Badges | 4 | `NOT_STARTED` | Profile badges, Achievements | `achievements`, `user_badges` |
| 11 | Saved Collections | 2 | `NOT_STARTED` | Saved tab, Collection detail | `collections`, `collection_items` |
| 12 | Advanced Search | 2 | `NOT_STARTED` | Explore, Search results | `posts`, `profiles`, `communities` |
| 13 | Personalized Feed | 2 | `NOT_STARTED` | Home (For You), Preferences | `user_settings`, `analytics_events` |
| 14 | Profile Customization | 1 | `PROTOTYPE` | Profile, Settings | `profiles`, `user_settings` |
| 15 | Admin Dashboard | 1 | `PROTOTYPE` | Admin reports, Users, Audit | `reports`, `admin_roles`, `audit_logs` |

> Existing Stories/Reels/Communities/DM screens are UI prototypes over seeded data. They are **not** part of the MVP and must be feature-flagged.

---

## 2. Detailed specifications

### 2.1 Stories — Phase 2

**User behavior:** Add a photo, video, or text story; it disappears after 24 hours; viewers can react; the author sees who viewed; stories can be saved into highlights.

**Screens**
- Home tray: unseen ring in `accent`, seen ring muted, “Your story” first.
- Viewer: full-screen, segmented progress, tap to advance, hold to pause, swipe down to close.
- Author insights: viewer list, reactions, reach.
- Highlights: grid on profile, create/rename/delete.

**Rules**
- Media: 1 image or 1 video (≤ 60 s) or text with background color.
- Visibility: `public`, `followers`, `close_friends`.
- Expiry: `expires_at = created_at + 24h`; API hides expired rows.
- Views: one per viewer per story; author-only visibility.
- Reactions: one per user per story; replies stored for Phase 3 DM delivery.
- Highlights do not expire; deleting a story removes it from highlights.

**Edge cases:** expired story deep link → “Story unavailable”; blocked viewer → 404; private profile → followers only; upload failure → retry, no partial row.

**Acceptance**
- [ ] Expired story is inaccessible via API and UI.
- [ ] Non-follower cannot view a followers-only story.
- [ ] View count increments once per user.
- [ ] Highlight persists after story expiry.

---

### 2.2 Shorts / Reels — Phase 2

**User behavior:** Watch a full-screen vertical feed; like, comment, share, save; follow the creator; upload a short video with caption and hashtags.

**Screens:** Reels feed (snap scroll), Reel detail, Upload flow, Creator profile.

**Rules**
- 9:16, 3 s–3 min, MP4/WebM, poster generated.
- One video per reel; caption ≤ 2,200; hashtags ≤ 10.
- Play only the active item; pause off-screen; mute state persisted.
- View counted after 2 s or 50% watched, once per user per session.
- Reels reuse `posts`, `likes`, `comments`, `bookmarks`, `notifications`.

**Edge cases:** autoplay blocked → show play button; slow network → poster + spinner; deleted reel → next item; blocked creator → excluded.

**Acceptance**
- [ ] Only active video plays.
- [ ] View counted once per session.
- [ ] Blocked creators never appear.
- [ ] Upload rejects unsupported codec/size.

---

### 2.3 Communities — Phase 2

**User behavior:** Discover communities, join public ones instantly, request private ones, post discussions, moderate as owner/moderator.

**Screens:** Directory, Community home (About, Posts, Members), Create community, Moderator tools.

**Rules**
- Visibility: `public` / `private`.
- Roles: `owner`, `moderator`, `member`; owner transfers only to a member.
- Private community: content visible to members only; join request requires approval.
- Community posts use `posts.community_id`; deleting a community soft-deletes posts or moves them to author profile (decision: keep posts, remove community context).
- Guidelines shown before first post; reportable.
- Banned members cannot rejoin without owner approval.

**Acceptance**
- [ ] Non-member cannot read/post in a private community.
- [ ] Moderator can remove post/member; member cannot.
- [ ] Slug unique; rename keeps links working.
- [ ] Banned member blocked from posting.

---

### 2.4 Direct Messaging — Phase 3

**User behavior:** Private 1:1 chat with text, images, shared posts; see delivery/read state; block/report; control who can message.

**Screens:** Inbox (conversations + requests), Thread, New message, Shared post preview.

**Rules**
- Only `accepted` members can read/send.
- `who_can_dm`: `everyone`, `followers`, `nobody`.
- Blocked users cannot create or continue a conversation.
- Read receipts configurable; default on.
- Message edit/delete own (delete = soft delete).
- Realtime via Supabase Realtime/SSE; optimistic send with reconciliation.
- No E2E encryption in v1 (documented in `docs/security.md`).

**Acceptance**
- [ ] Non-member API access → 403.
- [ ] Blocked pair cannot message.
- [ ] Unread count matches unread messages.
- [ ] Reconnect recovers missed messages.

---

### 2.5 Voice Messages — Phase 3

**User behavior:** Record and send a voice note; recipient plays with seek, speed, duration.

**Rules**
- Max 5 min, ≤ 10 MB, Opus/WebM or M4A.
- Private bucket; signed URLs only for conversation members.
- Waveform peaks generated client-side or server-side; store JSON.
- Cancel recording deletes local blob; no orphan upload.
- Upload progress + retry.

**Acceptance**
- [ ] Unauthorized fetch of audio → 403.
- [ ] Duration and waveform match audio.
- [ ] Cancel leaves no stored file.
- [ ] Playback speed persists per session.

---

### 2.6 Live Streaming — Phase 5

**User behavior:** Creator goes live; viewers join a real-time room, chat, react; host moderates; optional replay.

**Rules**
- Real provider required (LiveKit/Agora/Mux/Cloudflare). No static fake stream.
- Host controls: start, end, mute chat, remove viewer, enable replay.
- Viewer count from provider webhooks.
- Live chat rate-limited; banned words/report flow.
- Replay only if enabled; otherwise 404 after end.

**Acceptance**
- [ ] Real RTMP/WebRTC stream plays end-to-end.
- [ ] Webhook updates `live` → `ended`.
- [ ] Ended stream rejects new chat.
- [ ] Replay respects creator setting.

---

### 2.7 Polls & Discussions — Phase 2

**User behavior:** Attach a poll to a post; vote; see results; discuss in comments/threads.

**Rules**
- 2–6 options; single or multiple choice; optional close time.
- One vote per user per option; changing vote allowed only if configured.
- Results hidden until vote/close (configurable).
- Author can close early.
- Discussion = post with `kind='discussion'`, topic tags, threaded comments (max depth 2).

**Acceptance**
- [ ] Duplicate vote rejected.
- [ ] Percentages sum to 100% (rounding handled).
- [ ] Closed poll read-only.
- [ ] Non-author cannot close.

---

### 2.8 Creator Dashboard — Phase 4

**User behavior:** See followers, reach, engagement, top posts, audience insights by date range.

**Rules**
- Metrics derived from `analytics_events` + `creator_stats_daily`.
- Date ranges 7/30/90 days; timezone-aware.
- No fabricated or estimated numbers; label unavailable metrics.
- Export CSV (optional).

**Acceptance**
- [ ] Dashboard totals reconcile with raw events for a sampled day.
- [ ] Date filter changes all cards consistently.
- [ ] Empty state for new creators.

---

### 2.9 Events — Phase 4

**User behavior:** Create online/offline events, RSVP, receive reminders, discuss.

**Rules**
- Fields: title, description, cover, start/end, timezone, mode, location/URL, capacity, visibility.
- RSVP states: `going`, `interested`, `declined`; idempotent.
- Capacity enforced for `going`.
- Online link visible only to `going` attendees.
- Host can edit/cancel; cancellation notifies attendees.

**Acceptance**
- [ ] RSVP idempotent.
- [ ] Capacity blocks overbooking.
- [ ] Canceled event notifies attendees.
- [ ] Timezone displays correctly.

---

### 2.10 Achievements & Badges — Phase 4

**User behavior:** Earn badges for verified milestones; show on profile; see progress.

**Rules**
- Criteria stored as JSONB; evaluated server-side by an idempotent job.
- Examples: first post, 10 posts, 100 followers, 30-day streak, community moderator, event host.
- No badge from client claims; abuse revokes with audit.
- Profile shows max 6 pinned badges.

**Acceptance**
- [ ] Re-running award job creates no duplicates.
- [ ] Criteria fixtures produce expected awards.
- [ ] Revocation is audited.

---

### 2.11 Saved Collections — Phase 2

**User behavior:** Save posts into named private collections.

**Rules**
- Max 50 collections; unique name per owner; default “Saved”.
- Items unique per collection.
- Owner-only access; deleting a collection keeps posts in default.
- Migrate existing `bookmarks` into default collection.

**Acceptance**
- [ ] Private collection never exposed.
- [ ] Add item idempotent.
- [ ] Deleting collection does not delete posts.

---

### 2.12 Advanced Search — Phase 2

**User behavior:** Search people, posts, hashtags, videos, communities, events with filters and pagination.

**Rules**
- Min 2 chars; debounce 300 ms; 20 results per type.
- Filters: type, date, sort, community.
- Excludes blocked/suspended/private content.
- Postgres FTS/GIN; SQLite FTS5 fallback.
- Recent searches stored locally only.

**Acceptance**
- [ ] New content searchable immediately.
- [ ] Blocked content absent.
- [ ] Pagination stable.
- [ ] Injection-safe queries.

---

### 2.13 Personalized Feed — Phase 2

**User behavior:** “For You” feed tuned by interests and follows, with controls.

**Signals:** follow graph, selected interests, recency, comment/save weight, diversity cap (2 posts/author/page), safety exclusions.

**Controls:** “Not interested”, mute author/topic, “Why am I seeing this?”.

**Rules:** no engagement-only optimization; no hidden boosts; deterministic tests.

**Acceptance**
- [ ] Muted topic disappears.
- [ ] Explanation matches applied signals.
- [ ] Diversity cap respected.
- [ ] Blocked content excluded.

---

### 2.14 Profile Customization — Phase 1

**User behavior:** Edit display name, username, avatar, cover, bio, links, privacy.

**MVP scope:** name, username, avatar, cover, bio (≤300), location, website, private profile.
**Later:** themes, pinned posts, profile music, pronouns, close friends.

**Rules**
- Username unique, `^[a-z0-9_]{3,24}$`, change limited (e.g. 2/30 days).
- Avatar/cover validated uploads.
- Private profile hides posts from non-followers server-side.
- Links must be http/https.

**Acceptance**
- [ ] Only owner can edit.
- [ ] Username collision → 409.
- [ ] Private profile hides content via API, not just UI.
- [ ] Avatar persists after reload.

---

### 2.15 Admin Dashboard — Phase 1

**User behavior:** Admins review reports, remove content, suspend users, inspect audit logs, see platform counts.

**MVP scope:** report queue, content removal, user suspension/restore, basic counts, audit log.
**Later:** advanced analytics, appeals, role management UI, bulk actions.

**Rules**
- Server-side `requireAdmin()`; UI hiding is not authorization.
- Every action writes `moderation_actions` + `audit_logs`.
- Suspended users cannot log in or act.
- Report snapshots survive content deletion.

**Acceptance**
- [ ] Non-admin → 403 on all admin routes.
- [ ] Remove content hides it everywhere.
- [ ] Suspend blocks login and mutations.
- [ ] Audit row exists for every action.

---

## 3. Screen map (MVP)

| Route | Purpose | Auth |
|---|---|---|
| `/` | Landing | public |
| `/signup` | Create account | public |
| `/login` | Sign in | public |
| `/home` | Feed (Following / Discover) | required |
| `/create` | Composer | required |
| `/explore` | Search + discovery | required |
| `/notifications` | Activity | required |
| `/profile/[username]` | Public profile | public |
| `/settings/profile` | Edit profile | required |
| `/settings/privacy` | Privacy controls | required |
| `/saved` | Saved posts | required |
| `/moderation` | Admin queue | admin |
| `/admin/users` | User management | admin |
| `/admin/audit` | Audit log | admin |

**Phase 2+:** `/shorts`, `/communities`, `/communities/[slug]`, `/collections`, `/studio`, `/events`, `/live`.

---

## 4. Navigation rules

- MVP nav: Home, Explore, Create, Notifications, Profile.
- Do not show nav items for unbuilt features.
- Feature-flagged previews show a `Preview` badge and a disabled primary action if incomplete.
- Mobile bottom bar max 5 items; overflow into “More”.
