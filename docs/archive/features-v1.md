# REELO — Feature Specification & Capabilities Matrix

Version: 1.0  
Product: REELO (All-in-One Social Networking Platform)  
Visual Direction: Natural Premium  

---

## 1. Feature Specifications by Domain

### 1. Welcome & Landing Hub (`/`)
- **Brand Hero:** Features REELO monogram aperture logo, clean natural typography, and tagline: *"Connect. Create. Discover."*
- **Pillar Highlights:** Multi-format canvas, sovereign communities, algorithmic transparency, and creator ecosystem.
- **Entry Points:** Direct navigation to `/login`, `/signup`, or guest explore mode into `/home`.

### 2. Authentication & Session System (`/login`, `/signup`, `/api/auth/*`)
- **Sign-Up:** Collects full name, unique handle, email address, and password with client-side validation.
- **Sign-In:** Authenticates credentials with session cookie generation (`reelo_session`).
- **Quick Local Test Access:** One-click demo sign-in button for instant testing as primary creator Alex Rivera (`alex@reelo.io`).
- **Sign-Out:** Dedicated logout button in desktop sidebar and mobile navigation that expires session cookies and navigates to `/login`.

### 3. Unified Home Feed (`/home`)
- **Interactive Story Tray:** Horizontal story carousel with terracotta active rings. Clicking a creator launches the full-screen `StoryViewerModal` with 5-second slide auto-advancement, hold-to-pause, and reaction burst physics.
- **Feed Filter Tabs:**
  - `For You`: Organic recommendations based on engagement.
  - `Following`: Pure chronological updates strictly from followed creators.
  - `Reels & Media`: High-resolution visual and vertical media.
  - `Trending`: Posts ordered by live engagement tallies.
- **Inline Creator Studio:** Quick-entry prompt allowing creators to draft thoughts or attach media without leaving the feed.
- **Interactive Post Cards:**
  - Real-time double-tap heart bursting animation with optimistic count updates.
  - Expandable comments drawer with instantaneous local comment submission.
  - Bookmark / save toggle with feedback toast.
  - Social share trigger with native Web Share API and fallback clipboard copy.
  - Post options dropdown with direct **Report Post** and **Block Author** actions.
  - Audio waveform player integration for posts featuring musical or spoken stems.

### 4. Explore & Discovery Hub (`/explore`)
- **Real-Time Search:** Dynamic query matching across post content, usernames, and hashtags.
- **Category Taxonomy:** Filter chips for `All`, `Technology`, `3D & VFX`, `Sound Lab`, `AI & Code`, and `Cosmos`.
- **Trending Hashtags:** Interactive tags displaying post count metrics.
- **Media Masonry Grid:** Responsive media cards featuring video play duration badges and author overlays. Clicking a video opens the vertical `ReelsTheaterModal`.

### 5. Sovereign Communities (`/communities`)
- **Craft Directory:** Curated groups across creative domains (Technology, Design & 3D, Music & Audio, Science).
- **Community Cards:** Cover imagery, avatar badges, membership tallies, and post counts.
- **Membership Toggle:** Instant 1-click **Join / Leave** action that updates SQLite membership records.

### 6. Real-Time Direct Messaging (`/messages`)
- **Dual-Pane Conversation View:** Left-side contact list with online status badges and recent message snippets; right-side active conversation thread.
- **Message Dispatch:** Instant optimistic message appending and persistent storage in the `messages` table.
- **Media & Reaction Triggers:** Action buttons for media attachments and emoji reactions.

### 7. Activity & Notifications Center (`/notifications`)
- **Event Categorization:** Visual badges for Likes (❤️), Comments (💬), Follows (👤), and Reposts (🔁).
- **Read State:** Unread indicators with subtle pine badges.
- **Bulk Action:** One-click "Mark all as read" button that updates all notification records in SQLite.

### 8. User Profile Studio (`/profile` & `/profile/[username]`)
- **Customizable Hero:** Profile banner, avatar with story ring, bio, location, and website link.
- **Social Graph Metrics:** Live animated counters for Followers, Following, and Posts.
- **Follow / Unfollow Toggle:** Instant relationship toggle on public profiles with real-time counter adjustments.
- **Tabbed Portfolio Showcase:**
  - `Posts`: Standard published cards.
  - `Reels & Media`: 9:16 vertical video thumbnails.
  - `Likes`: Content liked by the user.
  - `Saved`: Privately bookmarked posts.
- **Edit Profile Modal:** Live update of display name, bio, location, and website with immediate persistence.

### 9. Multi-Format Post Studio (`/create`)
- **Drafting Composer:** Multi-line text editor with character counter.
- **Destination Targeting:** Post publicly or target a specific joined community.
- **Media Previews:** URL attachment input with 1-click test presets (photography, 3D renders, video reel clips).
- **Hashtag Chips:** Interactive tag adding and removal chips.

### 10. Safety, Moderation & Blocking (`/moderation`)
- **Report Modal (`ReportModal.tsx`):**
  - Triggered directly from any post options menu.
  - Standard categories: Spam, Harassment, Hate Speech, Misinformation, Inappropriate, Other.
  - Submits structured records to the `reports` table.
- **Block Modal (`BlockModal.tsx`):**
  - Confirms user blocking with explanation of consequences.
  - Persists block relation in `blocks` table.
  - Automatically suppresses all content from blocked users across the home feed.
- **Administrative Moderation Dashboard (`/moderation`):**
  - Lists pending user reports with target details and timestamps.
  - Action button **"Remove Content"**: Permanently deletes offending post from database and marks report resolved.
  - Action button **"Dismiss Report"**: Dismisses false positives without modifying content.
  - Filter tabs: `Pending`, `Resolved`, `Dismissed`.
