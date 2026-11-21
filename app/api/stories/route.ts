import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId, getServerSessionUser } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(request);
    const nowIso = new Date().toISOString();

    const rows = db.prepare(`
      SELECT 
        s.*,
        p.username as author_username,
        p.full_name as author_full_name,
        p.avatar_url as author_avatar_url,
        p.is_verified as author_is_verified,
        (SELECT COUNT(*) FROM story_views sv WHERE sv.story_id = s.id AND sv.viewer_id = ?) as is_viewed
      FROM stories s
      JOIN profiles p ON s.user_id = p.id
      WHERE s.expires_at > ?
      ORDER BY s.created_at DESC
    `).all(currentUserId, nowIso) as any[];

    const stories = rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      media_url: r.media_url,
      media_type: r.media_type,
      text_overlay: r.text_overlay,
      background_color: r.background_color,
      expires_at: r.expires_at,
      created_at: r.created_at,
      is_viewed: Boolean(r.is_viewed),
      author: {
        id: r.user_id,
        username: r.author_username,
        full_name: r.author_full_name,
        avatar_url: r.author_avatar_url,
        is_verified: Boolean(r.author_is_verified),
      },
    }));

    return NextResponse.json({ stories });
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const user = getServerSessionUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Authentication required to post a story' }, { status: 401 });
    }

    const body = await request.json();
    const { media_url, media_type = 'image', text_overlay, background_color = '#243746' } = body;

    if (!media_url && !text_overlay) {
      return NextResponse.json({ error: 'Story requires an image/video or text' }, { status: 400 });
    }

    const id = `sty_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const now = new Date();
    const createdAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO stories (id, user_id, media_url, media_type, text_overlay, background_color, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      user.id,
      media_url || '',
      media_type,
      text_overlay || null,
      background_color,
      expiresAt,
      createdAt
    );

    const newStory = {
      id,
      user_id: user.id,
      media_url: media_url || '',
      media_type,
      text_overlay,
      background_color,
      expires_at: expiresAt,
      created_at: createdAt,
      author: user,
    };

    return NextResponse.json({ story: newStory });
  } catch (error: any) {
    console.error('Error creating story:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
