import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { PostWithAuthor, Profile } from '@/types';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'for-you';
    const currentUserId = DEMO_CURRENT_USER.id;

    let query = `
      SELECT 
        p.*,
        u.id as author_id,
        u.username as author_username,
        u.full_name as author_full_name,
        u.avatar_url as author_avatar_url,
        u.banner_url as author_banner_url,
        u.bio as author_bio,
        u.website as author_website,
        u.location as author_location,
        u.is_verified as author_is_verified,
        u.followers_count as author_followers_count,
        u.following_count as author_following_count,
        u.posts_count as author_posts_count,
        u.created_at as author_created_at,
        u.updated_at as author_updated_at,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) as user_liked,
        (SELECT COUNT(*) FROM bookmarks b WHERE b.post_id = p.id AND b.user_id = ?) as user_bookmarked
      FROM posts p
      JOIN profiles u ON p.user_id = u.id
      WHERE p.user_id NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = ?)
    `;

    if (filter === 'reels') {
      query += ` AND (p.media_type = 'reel' OR (p.media_urls != '[]' AND p.media_urls IS NOT NULL))`;
    } else if (filter === 'saved') {
      query += ` AND p.id IN (SELECT post_id FROM bookmarks WHERE user_id = ?)`;
    } else if (filter === 'following') {
      query += ` AND p.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)`;
    }

    if (filter === 'trending') {
      query += ` ORDER BY p.likes_count DESC, p.created_at DESC`;
    } else {
      query += ` ORDER BY p.is_pinned DESC, p.created_at DESC`;
    }

    let params: any[] = [currentUserId, currentUserId, currentUserId];
    if (filter === 'saved' || filter === 'following') {
      params.push(currentUserId);
    }

    const rows = db.prepare(query).all(...params) as any[];

    const posts: PostWithAuthor[] = rows.map((row) => {
      let mediaUrls: string[] = [];
      let tags: string[] = [];

      try {
        mediaUrls = JSON.parse(row.media_urls || '[]');
      } catch {}
      try {
        tags = JSON.parse(row.tags || '[]');
      } catch {}

      const author: Profile = {
        id: row.author_id,
        username: row.author_username,
        full_name: row.author_full_name,
        avatar_url: row.author_avatar_url,
        banner_url: row.author_banner_url,
        bio: row.author_bio,
        website: row.author_website,
        location: row.author_location,
        is_verified: Boolean(row.author_is_verified),
        followers_count: row.author_followers_count,
        following_count: row.author_following_count,
        posts_count: row.author_posts_count,
        created_at: row.author_created_at,
        updated_at: row.author_updated_at,
      };

      return {
        id: row.id,
        user_id: row.user_id,
        author,
        content: row.content,
        media_urls: mediaUrls,
        media_type: row.media_type,
        likes_count: row.likes_count,
        comments_count: row.comments_count,
        reposts_count: row.reposts_count,
        community_id: row.community_id,
        tags,
        is_pinned: Boolean(row.is_pinned),
        user_has_liked: Boolean(row.user_liked),
        user_has_bookmarked: Boolean(row.user_bookmarked),
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Error fetching posts from local SQLite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const {
      content,
      mediaUrls = [],
      mediaType = 'none',
      tags = [],
      communityId = null,
      userId = DEMO_CURRENT_USER.id,
    } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required.' }, { status: 400 });
    }

    const postId = `post_${Date.now()}`;
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO posts (
        id, user_id, content, media_urls, media_type, likes_count, comments_count,
        reposts_count, community_id, tags, is_pinned, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?, ?, 0, ?, ?)
    `);

    insert.run(
      postId,
      userId,
      content,
      JSON.stringify(mediaUrls),
      mediaType,
      communityId,
      JSON.stringify(tags),
      now,
      now
    );

    // Increment profile posts_count
    db.prepare('UPDATE profiles SET posts_count = posts_count + 1 WHERE id = ?').run(userId);

    // Retrieve created post with author
    const authorRow = db.prepare('SELECT * FROM profiles WHERE id = ?').get(userId) as any;
    const author: Profile = {
      ...authorRow,
      is_verified: Boolean(authorRow.is_verified),
    };

    const newPost: PostWithAuthor = {
      id: postId,
      user_id: userId,
      author,
      content,
      media_urls: mediaUrls,
      media_type: mediaType,
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
      community_id: communityId,
      tags,
      is_pinned: false,
      user_has_liked: false,
      user_has_reposted: false,
      user_has_bookmarked: false,
      created_at: now,
      updated_at: now,
    };

    return NextResponse.json({ post: newPost });
  } catch (error: any) {
    console.error('Error creating post in local SQLite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
