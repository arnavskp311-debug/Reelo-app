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
    const collectionId = params.id;
    const body = await request.json();
    const { post_id } = body;

    if (!post_id) {
      return NextResponse.json({ error: 'post_id is required' }, { status: 400 });
    }

    const existing = db.prepare(`
      SELECT id FROM collection_items 
      WHERE collection_id = ? AND post_id = ?
    `).get(collectionId, post_id) as any;

    if (existing) {
      db.prepare('DELETE FROM collection_items WHERE id = ?').run(existing.id);
      return NextResponse.json({ saved: false });
    } else {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO collection_items (id, collection_id, post_id, created_at)
        VALUES (?, ?, ?, ?)
      `).run(id, collectionId, post_id, now);
      return NextResponse.json({ saved: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
