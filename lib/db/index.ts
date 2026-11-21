/**
 * @deprecated
 * LEGACY / UNUSED:
 * REELO strictly uses Cloud Supabase (Auth, PostgreSQL, Storage, Realtime) as its primary data store.
 * User data, posts, media, or account records are NEVER stored locally on the PC.
 * This file is retained exclusively as an offline legacy reference and is not part of the active production path.
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import {
  DEMO_CURRENT_USER,
  DEMO_USERS,
  DEMO_COMMUNITIES,
  DEMO_POSTS,
  DEMO_MESSAGES,
  DEMO_NOTIFICATIONS,
} from '@/lib/constants/demo-data';

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

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
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
  `);
}

function seedInitialData(db: DatabaseSync) {
  // Insert demo profiles
  const insertProfile = db.prepare(`
    INSERT OR IGNORE INTO profiles (
      id, username, full_name, avatar_url, banner_url, bio, website, location,
      is_verified, followers_count, following_count, posts_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const allProfiles = [DEMO_CURRENT_USER, ...Object.values(DEMO_USERS)];
  for (const u of allProfiles) {
    insertProfile.run(
      u.id,
      u.username,
      u.full_name,
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
}
