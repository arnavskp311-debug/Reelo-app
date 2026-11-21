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

    const existingBookmark = db
      .prepare('SELECT id FROM bookmarks WHERE post_id = ? AND user_id = ?')
      .get(postId, userId) as any;

    if (existingBookmark && existingBookmark.id) {
      db.prepare('DELETE FROM bookmarks WHERE id = ?').run(existingBookmark.id);
      return NextResponse.json({ bookmarked: false });
    } else {
      const bookmarkId = crypto.randomUUID();
      const now = new Date().toISOString();
      db.prepare('INSERT INTO bookmarks (id, user_id, post_id, created_at) VALUES (?, ?, ?, ?)').run(
        bookmarkId,
        userId,
        postId,
        now
      );
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error: any) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
