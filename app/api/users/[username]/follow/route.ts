import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const db = getDb();
    const followerId = DEMO_CURRENT_USER.id;

    // Find target user by username
    const target = db.prepare('SELECT id FROM profiles WHERE username = ? COLLATE NOCASE').get(username) as any;
    if (!target) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const followingId = target.id;
    if (followerId === followingId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // Check existing follow
    const existing = db.prepare('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?').get(followerId, followingId);

    if (existing) {
      // Unfollow
      db.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?').run(followerId, followingId);
      db.prepare('UPDATE profiles SET following_count = MAX(0, following_count - 1) WHERE id = ?').run(followerId);
      db.prepare('UPDATE profiles SET followers_count = MAX(0, followers_count - 1) WHERE id = ?').run(followingId);

      return NextResponse.json({
        following: false,
        message: `Unfollowed @${username}`,
      });
    } else {
      // Follow
      const followId = `fol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();

      db.prepare('INSERT INTO follows (id, follower_id, following_id, created_at) VALUES (?, ?, ?, ?)').run(
        followId,
        followerId,
        followingId,
        now
      );

      db.prepare('UPDATE profiles SET following_count = following_count + 1 WHERE id = ?').run(followerId);
      db.prepare('UPDATE profiles SET followers_count = followers_count + 1 WHERE id = ?').run(followingId);

      // Create notification
      const notifId = `notif_${Date.now()}`;
      db.prepare(`
        INSERT INTO notifications (id, user_id, actor_id, type, post_id, is_read, created_at)
        VALUES (?, ?, ?, 'follow', NULL, 0, ?)
      `).run(notifId, followingId, followerId, now);

      return NextResponse.json({
        following: true,
        message: `Following @${username}`,
      });
    }
  } catch (error: any) {
    console.error('Failed to toggle follow:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
