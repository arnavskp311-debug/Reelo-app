import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const userId = getServerSessionUserId(request);

    const rows = db.prepare(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM collection_items ci WHERE ci.collection_id = c.id) as items_count,
        (SELECT p.media_urls FROM collection_items ci JOIN posts p ON ci.post_id = p.id WHERE ci.collection_id = c.id LIMIT 1) as preview_media
      FROM collections c
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `).all(userId) as any[];

    const collections = rows.map((r) => {
      let cover = null;
      try {
        const parsed = JSON.parse(r.preview_media || '[]');
        if (parsed.length > 0) cover = parsed[0];
      } catch {}

      return {
        id: r.id,
        user_id: r.user_id,
        name: r.name,
        description: r.description || '',
        is_private: Boolean(r.is_private),
        items_count: r.items_count || 0,
        cover_url: cover,
        created_at: r.created_at,
      };
    });

    return NextResponse.json({ collections });
  } catch (error: any) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const userId = getServerSessionUserId(request);
    const body = await request.json();
    const { name, description, is_private = true } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    const id = `col_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO collections (id, user_id, name, description, is_private, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, userId, name.trim(), description || null, is_private ? 1 : 0, now);

    const newCollection = {
      id,
      user_id: userId,
      name: name.trim(),
      description: description || '',
      is_private: Boolean(is_private),
      items_count: 0,
      cover_url: null,
      created_at: now,
    };

    return NextResponse.json({ collection: newCollection });
  } catch (error: any) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
