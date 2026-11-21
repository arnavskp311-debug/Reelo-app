import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const postId = params.id;
    const userId = DEMO_CURRENT_USER.id;

    // Check if user already liked this post
    const existingLike = db
      .prepare('SELECT id FROM likes WHERE post_id = ? AND user_id = ?')
      .get(postId, userId);

    let liked = false;

    if (existingLike) {
      // Unlike
      db.prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?').run(postId, userId);
      db.prepare('UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(postId);
      liked = false;
    } else {
      // Like
      const likeId = `like_${Date.now()}`;
      db.prepare('INSERT INTO likes (id, user_id, post_id, created_at) VALUES (?, ?, ?, ?)').run(
        likeId,
        userId,
        postId,
        new Date().toISOString()
      );
      db.prepare('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?').run(postId);
      liked = true;
    }

    const postRow = db.prepare('SELECT likes_count FROM posts WHERE id = ?').get(postId) as any;
    const newCount = postRow?.likes_count ?? 0;

    return NextResponse.json({ liked, newCount });
  } catch (error: any) {
    console.error('Like toggle error in local SQLite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
