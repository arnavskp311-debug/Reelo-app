import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const db = getDb();
    const userId = getServerSessionUserId(request);
    const targetUsername = params.username.toLowerCase().trim();

    const targetProfile = db
      .prepare('SELECT id, followers_count FROM profiles WHERE lower(username) = lower(?)')
      .get(targetUsername) as any;

    if (!targetProfile || !targetProfile.id) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    const targetId = targetProfile.id;

    if (targetId === userId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const existingFollow = db
      .prepare('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?')
      .get(userId, targetId) as any;

    if (existingFollow && existingFollow.id) {
      db.prepare('DELETE FROM follows WHERE id = ?').run(existingFollow.id);
      db.prepare('UPDATE profiles SET followers_count = MAX(0, followers_count - 1) WHERE id = ?').run(targetId);
      db.prepare('UPDATE profiles SET following_count = MAX(0, following_count - 1) WHERE id = ?').run(userId);
      return NextResponse.json({ following: false });
    } else {
      const followId = crypto.randomUUID();
      const now = new Date().toISOString();
      db.prepare('INSERT INTO follows (id, follower_id, following_id, created_at) VALUES (?, ?, ?, ?)').run(
        followId,
        userId,
        targetId,
        now
      );
      db.prepare('UPDATE profiles SET followers_count = followers_count + 1 WHERE id = ?').run(targetId);
      db.prepare('UPDATE profiles SET following_count = following_count + 1 WHERE id = ?').run(userId);
      return NextResponse.json({ following: true });
    }
  } catch (error: any) {
    console.error('Error in follow toggle:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
