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
    const storyId = params.id;
    const userId = getServerSessionUserId(request);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT OR IGNORE INTO story_views (id, story_id, viewer_id, viewed_at)
      VALUES (?, ?, ?, ?)
    `).run(id, storyId, userId, now);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
