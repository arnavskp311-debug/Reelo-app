import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(request);

    const rows = db.prepare(`
      SELECT 
        n.*,
        p.username as actor_username,
        p.full_name as actor_name,
        p.avatar_url as actor_avatar
      FROM notifications n
      LEFT JOIN profiles p ON n.actor_id = p.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `).all(currentUserId) as any[];

    const notifications = rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      actor_id: r.actor_id,
      type: r.type,
      post_id: r.post_id || null,
      is_read: Boolean(r.is_read),
      created_at: r.created_at,
      actor: {
        id: r.actor_id,
        username: r.actor_username || 'user',
        name: r.actor_name || 'REELO User',
        avatar: r.actor_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.actor_id}`,
      },
    }));

    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(request);

    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(currentUserId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking notifications read:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
