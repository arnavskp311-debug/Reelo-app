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

    const existingBookmark = db
      .prepare('SELECT id FROM bookmarks WHERE post_id = ? AND user_id = ?')
      .get(postId, userId);

    let bookmarked = false;

    if (existingBookmark) {
      db.prepare('DELETE FROM bookmarks WHERE post_id = ? AND user_id = ?').run(postId, userId);
      bookmarked = false;
    } else {
      const bId = `bm_${Date.now()}`;
      db.prepare('INSERT INTO bookmarks (id, user_id, post_id, created_at) VALUES (?, ?, ?, ?)').run(
        bId,
        userId,
        postId,
        new Date().toISOString()
      );
      bookmarked = true;
    }

    return NextResponse.json({ bookmarked });
  } catch (error: any) {
    console.error('Bookmark toggle error in local SQLite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
