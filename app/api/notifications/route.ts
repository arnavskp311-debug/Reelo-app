import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const userId = DEMO_CURRENT_USER.id;

    const query = `
      SELECT n.*,
             a.id as actor_id, a.username as actor_username, a.full_name as actor_full_name,
             a.avatar_url as actor_avatar_url, a.is_verified as actor_is_verified
      FROM notifications n
      JOIN profiles a ON n.actor_id = a.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `;

    const rows = db.prepare(query).all(userId) as any[];

    const notifications = rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      actor_id: r.actor_id,
      type: r.type,
      post_id: r.post_id,
      is_read: Boolean(r.is_read),
      created_at: r.created_at,
      actor: {
        id: r.actor_id,
        username: r.actor_username,
        full_name: r.actor_full_name,
        avatar_url: r.actor_avatar_url,
        is_verified: Boolean(r.actor_is_verified),
      },
    }));

    return NextResponse.json({ notifications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const db = getDb();
    const userId = DEMO_CURRENT_USER.id;

    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
