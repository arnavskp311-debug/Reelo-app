import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUser } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const postId = params.id;

    const query = `
      SELECT 
        c.*,
        p.username as author_username,
        p.full_name as author_full_name,
        p.avatar_url as author_avatar_url,
        p.is_verified as author_is_verified
      FROM comments c
      LEFT JOIN profiles p ON c.user_id = p.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;

    const rows = db.prepare(query).all(postId) as any[];

    const comments = rows.map((r) => ({
      id: r.id,
      post_id: r.post_id,
      user_id: r.user_id,
      content: r.content,
      parent_id: r.parent_id || null,
      likes_count: r.likes_count || 0,
      created_at: r.created_at,
      updated_at: r.updated_at,
      author: {
        id: r.user_id,
        username: r.author_username || 'user',
        full_name: r.author_full_name || 'REELO User',
        avatar_url: r.author_avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user_id}`,
        is_verified: Boolean(r.author_is_verified),
      },
    }));

    return NextResponse.json({ comments });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const postId = params.id;
    const currentUser = getServerSessionUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required to comment.' }, { status: 401 });
    }

    const body = await request.json();
    const { content, parentId } = body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Comment content cannot be empty.' }, { status: 400 });
    }

    const commentId = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO comments (id, user_id, post_id, content, parent_id, likes_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    `).run(
      commentId,
      currentUser.id,
      postId,
      content.trim(),
      parentId || null,
      now,
      now
    );

    // Update comments count on post
    db.prepare('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?').run(postId);

    const newComment = {
      id: commentId,
      post_id: postId,
      user_id: currentUser.id,
      content: content.trim(),
      parent_id: parentId || null,
      likes_count: 0,
      created_at: now,
      updated_at: now,
      author: {
        id: currentUser.id,
        username: currentUser.username,
        full_name: currentUser.full_name,
        avatar_url: currentUser.avatar_url,
        is_verified: currentUser.is_verified,
      },
    };

    return NextResponse.json({ comment: newComment });
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
