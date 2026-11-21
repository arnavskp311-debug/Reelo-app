import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(request);

    const rows = db
      .prepare('SELECT blocked_id FROM blocks WHERE blocker_id = ?')
      .all(currentUserId) as any[];

    const blockedIds = rows.map((r) => r.blocked_id);
    return NextResponse.json({ blocked_ids: blockedIds });
  } catch (error: any) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(req);
    const body = await req.json();
    const { blocked_id, reason } = body;

    if (!blocked_id) {
      return NextResponse.json({ error: 'Missing blocked_id' }, { status: 400 });
    }

    if (blocked_id === currentUserId) {
      return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT OR IGNORE INTO blocks (id, blocker_id, blocked_id, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, currentUserId, blocked_id, reason || null, now);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error creating block:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(req);
    const body = await req.json();
    const { blocked_id } = body;

    if (!blocked_id) {
      return NextResponse.json({ error: 'Missing blocked_id' }, { status: 400 });
    }

    db.prepare('DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?').run(
      currentUserId,
      blocked_id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error unblocking user:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
