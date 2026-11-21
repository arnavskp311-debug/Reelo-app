import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export async function GET() {
  try {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT 
        b.*,
        p.username as blocked_username,
        p.full_name as blocked_name,
        p.avatar_url as blocked_avatar
      FROM blocks b
      LEFT JOIN profiles p ON b.blocked_id = p.id
      WHERE b.blocker_id = ?
      ORDER BY b.created_at DESC
    `);

    const blocks = stmt.all(DEMO_CURRENT_USER.id);
    return NextResponse.json({ blocks });
  } catch (error: any) {
    console.error('Failed to fetch blocked users:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blocked_id, reason } = body;

    if (!blocked_id) {
      return NextResponse.json({ error: 'Missing blocked_id' }, { status: 400 });
    }

    const db = getDb();
    const blockId = `blk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO blocks (id, blocker_id, blocked_id, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertStmt.run(blockId, DEMO_CURRENT_USER.id, blocked_id, reason || '', now);

    return NextResponse.json({ success: true, blockId, blocked_id });
  } catch (error: any) {
    console.error('Failed to block user:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blocked_id = searchParams.get('blocked_id');

    if (!blocked_id) {
      return NextResponse.json({ error: 'Missing blocked_id parameter' }, { status: 400 });
    }

    const db = getDb();
    const deleteStmt = db.prepare(`
      DELETE FROM blocks 
      WHERE blocker_id = ? AND blocked_id = ?
    `);

    deleteStmt.run(DEMO_CURRENT_USER.id, blocked_id);

    return NextResponse.json({ success: true, unblocked_id: blocked_id });
  } catch (error: any) {
    console.error('Failed to unblock user:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
