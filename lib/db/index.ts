/**
 * REELO Local PC Database Engine (Node.js 24 Native SQLite).
 * All user data, posts, accounts, profiles, comments, and interactions
 * are securely stored and persisted directly in data/reelo.db on the user's PC.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { NextRequest } from 'next/server';
import {
  DEMO_CURRENT_USER,
  DEMO_USERS,
  DEMO_COMMUNITIES,
  DEMO_POSTS,
  DEMO_MESSAGES,
  DEMO_NOTIFICATIONS,
} from '@/lib/constants/demo-data';
import { Profile } from '@/types';

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'reelo.db');
  const isNewDb = !fs.existsSync(dbPath);

  dbInstance = new DatabaseSync(dbPath);

  // Enable WAL and foreign keys
  dbInstance.exec('PRAGMA foreign_keys = ON;');
  dbInstance.exec('PRAGMA journal_mode = WAL;');

  initSchema(dbInstance);

  if (isNewDb) {
    seedInitialData(dbInstance);
  }

  return dbInstance;
}

export function getServerSessionUserId(request?: NextRequest): string {
  if (!request) return DEMO_CURRENT_USER.id;
  const sessionId = request.cookies.get('reelo_session')?.value;
  return sessionId || DEMO_CURRENT_USER.id;
}

export function getServerSessionUser(request?: NextRequest): Profile | null {
  try {
    const db = getDb();
    const userId = getServerSessionUserId(request);
    const row = db.prepare('SELECT * FROM profiles WHERE id = ?').get(userId) as any;
    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      full_name: row.full_name,
      avatar_url: row.avatar_url,
      banner_url: row.banner_url || null,
      bio: row.bio || '',
      website: row.website || '',
      location: row.location || '',
      is_verified: Boolean(row.is_verified),
      followers_count: row.followers_count || 0,
      following_count: row.following_count || 0,
      posts_count: row.posts_count || 0,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  } catch (err) {
    return null;
  }
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT,
      password_hash TEXT,
      avatar_url TEXT,
      banner_url TEXT,
      bio TEXT,
      website TEXT,
      location TEXT,
      is_verified INTEGER DEFAULT 0,
      followers_count INTEGER DEFAULT 0,
      following_count INTEGER DEFAULT 0,
      posts_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS communities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      avatar_url TEXT,
      banner_url TEXT,
      creator_id TEXT NOT NULL,
      members_count INTEGER DEFAULT 1,
      is_verified INTEGER DEFAULT 0,
      category TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      media_urls TEXT DEFAULT '[]',
      media_type TEXT DEFAULT 'none',
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      reposts_count INTEGER DEFAULT 0,
      community_id TEXT,
      tags TEXT DEFAULT '[]',
      is_pinned INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS likes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, post_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, post_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      content TEXT NOT NULL,
      parent_id TEXT,
      likes_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS follows (
      id TEXT PRIMARY KEY,
      follower_id TEXT NOT NULL,
      following_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(follower_id, following_id)
    );

    CREATE TABLE IF NOT EXISTS community_members (
      id TEXT PRIMARY KEY,
      community_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      joined_at TEXT NOT NULL,
      UNIQUE(community_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      recipient_id TEXT NOT NULL,
      content TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      type TEXT NOT NULL,
      post_id TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blocks (
      id TEXT PRIMARY KEY,
      blocker_id TEXT NOT NULL,
      blocked_id TEXT NOT NULL,
      reason TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(blocker_id, blocked_id)
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      details TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL,
      resolved_at TEXT,
      resolved_by TEXT
    );

    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      media_url TEXT NOT NULL,
      media_type TEXT DEFAULT 'image',
      text_overlay TEXT,
      background_color TEXT DEFAULT '#243746',
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS story_views (
      id TEXT PRIMARY KEY,
      story_id TEXT NOT NULL,
      viewer_id TEXT NOT NULL,
      viewed_at TEXT NOT NULL,
      UNIQUE(story_id, viewer_id),
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS story_reactions (
      id TEXT PRIMARY KEY,
      story_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      emoji TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(story_id, user_id, emoji),
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS polls (
      id TEXT PRIMARY KEY,
      post_id TEXT UNIQUE NOT NULL,
      question TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS poll_options (
      id TEXT PRIMARY KEY,
      poll_id TEXT NOT NULL,
      option_text TEXT NOT NULL,
      votes_count INTEGER DEFAULT 0,
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS poll_votes (
      id TEXT PRIMARY KEY,
      poll_id TEXT NOT NULL,
      option_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(poll_id, user_id),
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
      FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      is_private INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS collection_items (
      id TEXT PRIMARY KEY,
      collection_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(collection_id, post_id),
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      cover_url TEXT,
      start_time TEXT NOT NULL,
      location_type TEXT DEFAULT 'online',
      location_details TEXT,
      attendees_count INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS event_rsvps (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT DEFAULT 'going',
      created_at TEXT NOT NULL,
      UNIQUE(event_id, user_id),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      badge_key TEXT NOT NULL,
      badge_name TEXT NOT NULL,
      badge_description TEXT NOT NULL,
      badge_icon TEXT NOT NULL,
      unlocked_at TEXT NOT NULL,
      UNIQUE(user_id, badge_key),
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS live_streams (
      id TEXT PRIMARY KEY,
      host_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'Creative & Design',
      is_live INTEGER DEFAULT 1,
      viewers_count INTEGER DEFAULT 0,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      FOREIGN KEY (host_id) REFERENCES profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS live_messages (
      id TEXT PRIMARY KEY,
      stream_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (stream_id) REFERENCES live_streams(id) ON DELETE CASCADE
    );
  `);

  // Auto-populate default sample events if table is empty
  const eventsCount = (db.prepare('SELECT COUNT(*) as count FROM events').get() as any)?.count || 0;
  if (eventsCount === 0) {
    const now = new Date().toISOString();
    const insertEvent = db.prepare(`
      INSERT OR IGNORE INTO events (id, creator_id, title, description, cover_url, start_time, location_type, location_details, attendees_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertEvent.run(
      'evt_01',
      DEMO_CURRENT_USER.id,
      'Generative Spatial Audio Hackathon',
      'A 48-hour hands-on session exploring next-gen ambisonic soundscapes, custom DSP filters, and real-time WebAudio visualizers.',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      new Date(Date.now() + 86400000 * 2).toISOString(),
      'online',
      'Spatial Lab Discord / Live Stream',
      48,
      now
    );
    insertEvent.run(
      'evt_02',
      DEMO_CURRENT_USER.id,
      'Editorial Design & Typography Masterclass',
      'Deep dive into Natural Premium design tokens, asymmetric layouts, accessible contrast, and tactile UI patterns.',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      new Date(Date.now() + 86400000 * 5).toISOString(),
      'online',
      'REELO Stage Live',
      124,
      now
    );
  }

  // Auto-populate default badges if table is empty
  const badgesCount = (db.prepare('SELECT COUNT(*) as count FROM user_badges').get() as any)?.count || 0;
  if (badgesCount === 0) {
    const now = new Date().toISOString();
    const insertBadge = db.prepare(`
      INSERT OR IGNORE INTO user_badges (id, user_id, badge_key, badge_name, badge_description, badge_icon, unlocked_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertBadge.run('bdg_01', DEMO_CURRENT_USER.id, 'pioneer', 'Platform Pioneer', 'Early member of REELO Alpha network', 'Sparkles', now);
    insertBadge.run('bdg_02', DEMO_CURRENT_USER.id, 'creator', 'Verified Creator', 'Published high-signal original works', 'CheckCircle2', now);
    insertBadge.run('bdg_03', DEMO_CURRENT_USER.id, 'community_lead', 'Guild Founder', 'Founded an active community guild', 'Users', now);
  }
}

function seedInitialData(db: DatabaseSync) {
  // Insert demo profiles
  const insertProfile = db.prepare(`
    INSERT OR IGNORE INTO profiles (
      id, username, full_name, email, password_hash, avatar_url, banner_url, bio, website, location,
      is_verified, followers_count, following_count, posts_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const allProfiles = [DEMO_CURRENT_USER, ...Object.values(DEMO_USERS)];
  for (const u of allProfiles) {
    const userEmail = `${u.username}@reelo.io`;
    insertProfile.run(
      u.id,
      u.username,
      u.full_name,
      userEmail,
      'demo123456',
      u.avatar_url,
      u.banner_url,
      u.bio,
      u.website,
      u.location,
      u.is_verified ? 1 : 0,
      u.followers_count,
      u.following_count,
      u.posts_count,
      u.created_at,
      u.updated_at
    );
  }

  // Insert communities
  const insertCommunity = db.prepare(`
    INSERT OR IGNORE INTO communities (
      id, name, slug, description, avatar_url, banner_url, creator_id,
      members_count, is_verified, category, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of DEMO_COMMUNITIES) {
    insertCommunity.run(
      c.id,
      c.name,
      c.slug,
      c.description,
      c.avatar_url,
      c.banner_url,
      c.creator_id,
      c.members_count,
      c.is_verified ? 1 : 0,
      c.category,
      c.created_at
    );
  }

  // Insert posts
  const insertPost = db.prepare(`
    INSERT OR IGNORE INTO posts (
      id, user_id, content, media_urls, media_type, likes_count, comments_count,
      reposts_count, community_id, tags, is_pinned, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of DEMO_POSTS) {
    insertPost.run(
      p.id,
      p.user_id,
      p.content,
      JSON.stringify(p.media_urls || []),
      p.media_type,
      p.likes_count,
      p.comments_count,
      p.reposts_count,
      p.community_id,
      JSON.stringify(p.tags || []),
      p.is_pinned ? 1 : 0,
      p.created_at,
      p.updated_at
    );
  }

  // Insert messages
  const insertMsg = db.prepare(`
    INSERT OR IGNORE INTO messages (id, sender_id, recipient_id, content, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const m of DEMO_MESSAGES) {
    insertMsg.run(m.id, m.sender_id, m.recipient_id, m.content, m.is_read ? 1 : 0, m.created_at);
  }

  // Insert notifications
  const insertNotif = db.prepare(`
    INSERT OR IGNORE INTO notifications (id, user_id, actor_id, type, post_id, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const n of DEMO_NOTIFICATIONS) {
    insertNotif.run(n.id, n.user_id, n.actor_id, n.type, n.post_id, n.is_read ? 1 : 0, n.created_at);
  }

  // Insert initial badges
  const insertBadge = db.prepare(`
    INSERT OR IGNORE INTO user_badges (id, user_id, badge_key, badge_name, badge_description, badge_icon, unlocked_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const now = new Date().toISOString();
  insertBadge.run('bdg_01', DEMO_CURRENT_USER.id, 'pioneer', 'Platform Pioneer', 'Early member of REELO Alpha network', 'Sparkles', now);
  insertBadge.run('bdg_02', DEMO_CURRENT_USER.id, 'creator', 'Verified Creator', 'Published high-signal original works', 'CheckCircle2', now);
  insertBadge.run('bdg_03', DEMO_CURRENT_USER.id, 'community_lead', 'Guild Founder', 'Founded an active community guild', 'Users', now);

  // Insert initial events
  const insertEvent = db.prepare(`
    INSERT OR IGNORE INTO events (id, creator_id, title, description, cover_url, start_time, location_type, location_details, attendees_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertEvent.run(
    'evt_01',
    'usr_sarah_01',
    'Generative Spatial Audio Hackathon',
    'A 48-hour hands-on session exploring next-gen ambisonic soundscapes, custom DSP filters, and real-time WebAudio visualizers.',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    new Date(Date.now() + 86400000 * 2).toISOString(),
    'online',
    'Spatial Lab Discord / Live Stream',
    48,
    now
  );
  insertEvent.run(
    'evt_02',
    'usr_marcus_01',
    'Editorial Design & Typography Masterclass',
    'Deep dive into Natural Premium design tokens, asymmetric layouts, accessible contrast, and tactile UI patterns.',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    new Date(Date.now() + 86400000 * 5).toISOString(),
    'online',
    'REELO Stage Live',
    124,
    now
  );

  // Insert initial collections
  const insertCol = db.prepare(`
    INSERT OR IGNORE INTO collections (id, user_id, name, description, is_private, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertCol.run('col_01', DEMO_CURRENT_USER.id, 'Design Inspiration', 'Editorial UI and typography references', 1, now);
  insertCol.run('col_02', DEMO_CURRENT_USER.id, 'Audio Stems', 'Favorite modular synth tracks and loops', 0, now);

  // Insert initial stories (24h expiry)
  const insertStory = db.prepare(`
    INSERT OR IGNORE INTO stories (id, user_id, media_url, media_type, text_overlay, background_color, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const expiry24h = new Date(Date.now() + 86400000).toISOString();
  insertStory.run('sty_01', 'usr_sarah_01', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 'image', 'Sunset vibes in Bali 🌊', '#1a365d', expiry24h, now);
  insertStory.run('sty_02', 'usr_marcus_01', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 'image', 'New mechanical keyboard build ✨', '#243746', expiry24h, now);
}
