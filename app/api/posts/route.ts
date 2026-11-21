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
    const currentUserId = request.cookies.get('reelo_session')?.value || DEMO_CURRENT_USER.id;

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

    const params: any[] = [currentUserId, currentUserId, currentUserId];

    if (filter === 'reels') {
      query += ` AND (p.media_type = 'reel' OR (p.media_urls != '[]' AND p.media_urls IS NOT NULL))`;
    } else if (filter === 'saved') {
      query += ` AND p.id IN (SELECT post_id FROM bookmarks WHERE user_id = ?)`;
      params.push(currentUserId);
    } else if (filter === 'following') {
      query += ` AND p.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)`;
      params.push(currentUserId);
    }

    if (filter === 'trending') {
      query += ` ORDER BY p.likes_count DESC, p.created_at DESC`;
    } else {
      query += ` ORDER BY p.is_pinned DESC, p.created_at DESC`;
    }

    const rows = db.prepare(query).all(...params) as any[];

    const posts: PostWithAuthor[] = rows.map((r) => {
      let mediaUrls: string[] = [];
      try {
        mediaUrls = JSON.parse(r.media_urls || '[]');
      } catch {
        mediaUrls = [];
      }

      let tags: string[] = [];
      try {
        tags = JSON.parse(r.tags || '[]');
      } catch {
        tags = [];
      }

      const author: Profile = {
        id: r.author_id,
        username: r.author_username,
        full_name: r.author_full_name,
        avatar_url: r.author_avatar_url,
        banner_url: r.author_banner_url || null,
        bio: r.author_bio || '',
        website: r.author_website || '',
        location: r.author_location || '',
        is_verified: Boolean(r.author_is_verified),
        followers_count: r.author_followers_count || 0,
        following_count: r.author_following_count || 0,
        posts_count: r.author_posts_count || 0,
        created_at: r.author_created_at,
        updated_at: r.author_updated_at,
      };

      return {
        id: r.id,
        user_id: r.user_id,
        content: r.content,
        media_urls: mediaUrls,
        media_type: r.media_type,
        likes_count: r.likes_count,
        comments_count: r.comments_count,
        reposts_count: r.reposts_count,
        community_id: r.community_id,
        tags,
        is_pinned: Boolean(r.is_pinned),
        created_at: r.created_at,
        updated_at: r.updated_at,
        author,
        user_has_liked: Boolean(r.user_liked),
        user_has_bookmarked: Boolean(r.user_bookmarked),
      };
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Local PC posts query error:', error);
    return NextResponse.json({ error: error.message || 'Internal database error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = request.cookies.get('reelo_session')?.value || DEMO_CURRENT_USER.id;
    const body = await request.json();
    const { content, mediaUrls, mediaType, tags, communityId } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Post content cannot be empty.' }, { status: 400 });
    }

    const postId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO posts (
        id, user_id, content, media_urls, media_type, likes_count, comments_count,
        reposts_count, community_id, tags, is_pinned, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?, ?, 0, ?, ?)
    `);

    insertStmt.run(
      postId,
      currentUserId,
      content.trim(),
      JSON.stringify(mediaUrls || []),
      mediaType || 'none',
      communityId || null,
      JSON.stringify(tags || []),
      now,
      now
    );

    // Update user post count
    db.prepare('UPDATE profiles SET posts_count = posts_count + 1 WHERE id = ?').run(currentUserId);

    // Fetch author profile
    const authorRow = db.prepare('SELECT * FROM profiles WHERE id = ?').get(currentUserId) as any;
    const author: Profile = authorRow
      ? {
          id: authorRow.id,
          username: authorRow.username,
          full_name: authorRow.full_name,
          avatar_url: authorRow.avatar_url,
          banner_url: authorRow.banner_url || null,
          bio: authorRow.bio || '',
          website: authorRow.website || '',
          location: authorRow.location || '',
          is_verified: Boolean(authorRow.is_verified),
          followers_count: authorRow.followers_count || 0,
          following_count: authorRow.following_count || 0,
          posts_count: authorRow.posts_count || 0,
          created_at: authorRow.created_at,
          updated_at: authorRow.updated_at,
        }
      : DEMO_CURRENT_USER;

    const newPost: PostWithAuthor = {
      id: postId,
      user_id: currentUserId,
      content: content.trim(),
      media_urls: mediaUrls || [],
      media_type: mediaType || 'none',
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
      community_id: communityId || null,
      tags: tags || [],
      is_pinned: false,
      created_at: now,
      updated_at: now,
      author,
      user_has_liked: false,
      user_has_bookmarked: false,
    };

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error('Local PC post create error:', error);
    return NextResponse.json({ error: error.message || 'Internal database error.' }, { status: 500 });
  }
}
