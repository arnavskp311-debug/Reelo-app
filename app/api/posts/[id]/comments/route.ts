import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const postId = params.id;

    const query = `
      SELECT c.*, u.username, u.full_name, u.avatar_url, u.is_verified
      FROM comments c
      JOIN profiles u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;

    const comments = db.prepare(query).all(postId);
    return NextResponse.json({ comments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const postId = params.id;
    const body = await request.json();
    const { content, userId = DEMO_CURRENT_USER.id } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content cannot be empty.' }, { status: 400 });
    }

    const commentId = `c_${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO comments (id, user_id, post_id, content, likes_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `).run(commentId, userId, postId, content.trim(), now, now);

    db.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?').run(postId);

    const user = db.prepare('SELECT username, full_name, avatar_url, is_verified FROM profiles WHERE id = ?').get(userId);

    return NextResponse.json({
      comment: {
        id: commentId,
        user_id: userId,
        post_id: postId,
        content: content.trim(),
        likes_count: 0,
        created_at: now,
        profile: user,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
