import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const postId = params.id;
    const userId = getServerSessionUserId(request);

    const existingLike = db
      .prepare('SELECT id FROM likes WHERE post_id = ? AND user_id = ?')
      .get(postId, userId) as any;

    if (existingLike && existingLike.id) {
      db.prepare('DELETE FROM likes WHERE id = ?').run(existingLike.id);
      db.prepare('UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(postId);
      const post = db.prepare('SELECT likes_count FROM posts WHERE id = ?').get(postId) as any;
      return NextResponse.json({ liked: false, newCount: post?.likes_count || 0 });
    } else {
      const likeId = crypto.randomUUID();
      const now = new Date().toISOString();
      db.prepare('INSERT INTO likes (id, user_id, post_id, created_at) VALUES (?, ?, ?, ?)').run(
        likeId,
        userId,
        postId,
        now
      );
      db.prepare('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?').run(postId);
      const post = db.prepare('SELECT likes_count FROM posts WHERE id = ?').get(postId) as any;
      return NextResponse.json({ liked: true, newCount: post?.likes_count || 1 });
    }
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
