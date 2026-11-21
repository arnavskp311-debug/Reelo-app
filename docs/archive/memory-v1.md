# REELO — Master Product Memory & Development Specification

**Version:** 1.0  
**Project:** REELO  
**Product Type:** All-in-One Social Networking Platform  
**Status:** Phase 1 (Core MVP) Completed & Verified  
**Primary Vision:** Your Social Universe.  
**Tagline:** Connect. Create. Discover.  
**Last Updated:** 2026-11-21  

---

# 1. Project Vision & Identity

REELO is an original, all-in-one social networking platform designed to combine content sharing, short videos, sovereign communities, direct messaging, creator experiences, and social discovery.

REELO maintains its own independent brand identity:
- **Visual Direction:** **Natural Premium**
- **Brand Colors:**
  - Primary: `#243746` (Deep slate / navy)
  - Secondary: `#4C7A78` (Muted pine / sage teal)
  - Background: `#F7F6F2` (Warm linen / natural cream)
  - Surface: `#FFFFFF` (Pure white card & modal surface)
  - Main text: `#202A30` (Rich charcoal)
  - Muted text: `#77818A` (Slate gray)
  - Accent: `#C87952` (Terracotta / warm clay)
- **Aesthetic Principles:**
  - Editorial, content-first aesthetic with natural color harmony.
  - Crisp typography with serif display headings and clean sans-serif bodies.
  - Subtle shadows (`box-shadow: 0 1px 2px rgba(36, 55, 70, 0.04), 0 4px 14px rgba(36, 55, 70, 0.05)`).
  - Light mode by default.
  - Strictly avoids excessive AI gradients, neon glows, oversaturated blobs, or generic templates.

---

# 2. Technology Stack & Database Architecture

- **Framework:** Next.js 14+ (App Router, Server and Client Components)
- **Language:** TypeScript 5.6+ (Strict type safety across database and API models)
- **Styling:** Tailwind CSS 3.4+ configured with Natural Premium tokens
- **Motion Engine:** Framer Motion (`framer-motion`) with GPU transforms and `layoutId` sliding tabs
- **Icons:** Lucide React (`lucide-react`)
- **Active Local Database:** Node.js 24 native SQLite (`DatabaseSync` from `node:sqlite`) writing directly to `data/reelo.db` on the user's PC. Features 12 relational tables with foreign key constraints.
- **Production Cloud Database (Ready):** Supabase PostgreSQL with complete Row Level Security (`supabase/migrations/001_initial_schema.sql`).
- **Session & Auth:** HttpOnly signed session cookies (`reelo_session`) with `SameSite=Lax`.
- **Cross-Platform Target:** API contracts and data models are decoupled from the DOM to allow a future React Native / Expo mobile application to use the exact same backend.

---

# 3. Phase 1 — Core MVP Feature Status Tracker

| Feature ID | Feature Name | Description | Target Phase | Status | Verification Notes |
|---|---|---|---|---|---|
| P1-01 | User Registration | User sign-up with unique username, email, full name, and password | Phase 1 | `TESTED` | Tested via `/signup` and `/api/auth/signup` |
| P1-02 | User Login | Credential verification and session cookie issuance | Phase 1 | `TESTED` | Tested via `/login` with 1-click test login |
| P1-03 | User Logout | Secure session termination and cookie invalidation | Phase 1 | `TESTED` | Tested via `/api/auth/logout` & sidebar sign-out |
| P1-04 | Session Management | HttpOnly session cookie persistence & auth state hooks | Phase 1 | `TESTED` | Verified via `middleware.ts` & `useAuth.ts` |
| P1-05 | User Profile View | Bio, metrics, portfolio tabs (Posts, Reels, Likes, Saved) | Phase 1 | `TESTED` | Verified on `/profile` & `/profile/[username]` |
| P1-06 | User Profile Edit | Live update modal for bio, location, name, and website | Phase 1 | `TESTED` | Verified on `EditProfileModal.tsx` & `/api/users/[username]` |
| P1-07 | User Avatars & Bios | Avatar display with story ring and verification badge | Phase 1 | `TESTED` | Verified in `Avatar.tsx` and headers |
| P1-08 | Home Feed | Tabbed chronological feeds (For You, Following, Reels, Trending) | Phase 1 | `TESTED` | Verified on `/home` with Framer Motion tabs |
| P1-09 | Post Creation | Multi-format studio supporting text, media URLs, tags | Phase 1 | `TESTED` | Verified on `/create` and inline feed prompt |
| P1-10 | Post Likes | Real-time like toggle with optimistic count animation & DB storage | Phase 1 | `TESTED` | Verified via `/api/posts/[id]/like` |
| P1-11 | Post Comments | Expandable comment drawer, real-time post & fetch | Phase 1 | `TESTED` | Verified via `/api/posts/[id]/comments` |
| P1-12 | Bookmarks / Saves | Saved post persistence with dedicated Saved tab on profile | Phase 1 | `TESTED` | Verified via `/api/posts/[id]/bookmark` & profile tab |
| P1-13 | Post Shares | Web Share API integration + clipboard link copy toast | Phase 1 | `TESTED` | Verified in `PostCard.tsx` share action |
| P1-14 | Follow / Unfollow | Persistent relationship tracking with counter updates | Phase 1 | `TESTED` | Verified via `/api/users/[username]/follow` |
| P1-15 | Notifications | Categorized feed (likes, comments, follows) with mark-as-read | Phase 1 | `TESTED` | Verified on `/notifications` & `/api/notifications` |
| P1-16 | Direct Messaging | Split-pane 1-on-1 conversations with real-time optimistic messaging | Phase 1 | `TESTED` | Verified on `/messages` & `/api/messages` |
| P1-17 | Explore & Search | Live search across hashtags, creators, and category pills | Phase 1 | `TESTED` | Verified on `/explore` |
| P1-18 | Public Communities | Public community directory with 1-click Join/Leave persistence | Phase 1 | `TESTED` | Verified on `/communities` & `/api/communities` |
| P1-19 | Community Posts | Publishing directly to specific communities & hub filtering | Phase 1 | `TESTED` | Verified in `/create` destination selector |
| P1-20 | Moderation Foundation | Report modal, Block modal & API, feed exclusion, `/moderation` queue | Phase 1 | `TESTED` | Verified on `/moderation`, `blocks`, and `reports` |

---

# 4. Project File Directory & Manifest

### Core Application Routes
- [app/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/page.tsx) — Landing / Welcome screen
- [app/(auth)/login/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(auth)/login/page.tsx) — Sign In page
- [app/(auth)/signup/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(auth)/signup/page.tsx) — Registration page
- [app/(main)/home/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(main)/home/page.tsx) — Feed with stories tray & inline creator
- [app/(main)/explore/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(main)/explore/page.tsx) — Search & media grid
- [app/(main)/communities/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(main)/communities/page.tsx) — Sovereign community directory
- [app/(main)/messages/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(main)/messages/page.tsx) — Direct messaging center
- [app/(main)/notifications/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(main)/notifications/page.tsx) — Activity notifications center
- [app/(main)/moderation/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(main)/moderation/page.tsx) — Administrative safety queue & content review
- [app/(main)/profile/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(main)/profile/page.tsx) — Authenticated profile studio
- [app/(main)/profile/[username]/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/(main)/profile/[username]/page.tsx) — Public creator portfolio
- [app/create/page.tsx](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/create/page.tsx) — Multi-format composer studio

### Database & API Route Handlers
- [data/reelo.db](file:///c:/Users/DAV-3/Desktop/Project/Reelo/data/reelo.db) — Local SQLite relational database (12 tables)
- [lib/db/index.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/lib/db/index.ts) — Connection manager, schema executor, auto-seeder
- [app/api/auth/login/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/auth/login/route.ts) — Login endpoint
- [app/api/auth/logout/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/auth/logout/route.ts) — Logout endpoint
- [app/api/auth/me/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/auth/me/route.ts) — Active session profile endpoint
- [app/api/auth/signup/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/auth/signup/route.ts) — Registration endpoint
- [app/api/posts/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/posts/route.ts) — Post feed query & creation
- [app/api/posts/[id]/like/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/posts/[id]/like/route.ts) — Like toggle
- [app/api/posts/[id]/bookmark/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/posts/[id]/bookmark/route.ts) — Bookmark toggle
- [app/api/posts/[id]/comments/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/posts/[id]/comments/route.ts) — Comments endpoint
- [app/api/users/[username]/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/users/[username]/route.ts) — Profile endpoint
- [app/api/users/[username]/follow/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/users/[username]/follow/route.ts) — Follow toggle
- [app/api/communities/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/communities/route.ts) — Communities endpoint
- [app/api/messages/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/messages/route.ts) — Messages endpoint
- [app/api/notifications/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/notifications/route.ts) — Notifications endpoint
- [app/api/blocks/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/blocks/route.ts) — User block endpoint
- [app/api/reports/route.ts](file:///c:/Users/DAV-3/Desktop/Project/Reelo/app/api/reports/route.ts) — Moderation reports endpoint

### Documentation Suite
- [memory.md](file:///c:/Users/DAV-3/Desktop/Project/Reelo/memory.md) — Master product memory & status specification
- [README.md](file:///c:/Users/DAV-3/Desktop/Project/Reelo/README.md) — Quickstart & mobile connection instructions
- [docs/architecture.md](file:///c:/Users/DAV-3/Desktop/Project/Reelo/docs/architecture.md) — Architecture & data flow diagrams
- [docs/features.md](file:///c:/Users/DAV-3/Desktop/Project/Reelo/docs/features.md) — Feature matrix and screen specifications
- [docs/roadmap.md](file:///c:/Users/DAV-3/Desktop/Project/Reelo/docs/roadmap.md) — Detailed 5-phase development roadmap
- [docs/database.md](file:///c:/Users/DAV-3/Desktop/Project/Reelo/docs/database.md) — Schema DDL, ER diagrams, foreign key contracts
- [docs/security.md](file:///c:/Users/DAV-3/Desktop/Project/Reelo/docs/security.md) — Auth security, input sanitization, RLS policies
- [docs/testing.md](file:///c:/Users/DAV-3/Desktop/Project/Reelo/docs/testing.md) — Test procedures, verification matrix, checklists
- [docs/changelog.md](file:///c:/Users/DAV-3/Desktop/Project/Reelo/docs/changelog.md) — Release notes and version history

---

# 5. Verification Status

- **Type Safety:** `npm run type-check` passed with 0 errors.
- **Production Build:** `npm run build` compiled 19/19 routes with code 0.
- **Database Engine:** SQLite database populated and running on `data/reelo.db`.
- **Mobile Access:** Progressive Web App configured with `manifest.json` and icons (`public/icons/icon-192.png`, `public/icons/icon-512.png`). Accessible across local Wi-Fi.
