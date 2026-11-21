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
    const body = await request.json();
    const { emoji = '❤️' } = body;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT OR REPLACE INTO story_reactions (id, story_id, user_id, emoji, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, storyId, userId, emoji, now);

    return NextResponse.json({ success: true, emoji });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
