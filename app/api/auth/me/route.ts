import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Profile } from '@/types';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const sessionId = request.cookies.get('reelo_session')?.value;

    const targetId = sessionId || DEMO_CURRENT_USER.id;
    const userRow = db.prepare('SELECT * FROM profiles WHERE id = ?').get(targetId) as any;

    if (!userRow) {
      return NextResponse.json({ user: null });
    }

    const user: Profile = {
      id: userRow.id,
      username: userRow.username,
      full_name: userRow.full_name,
      avatar_url: userRow.avatar_url,
      banner_url: userRow.banner_url || null,
      bio: userRow.bio || '',
      website: userRow.website || '',
      location: userRow.location || '',
      is_verified: Boolean(userRow.is_verified),
      followers_count: userRow.followers_count || 0,
      following_count: userRow.following_count || 0,
      posts_count: userRow.posts_count || 0,
      created_at: userRow.created_at,
      updated_at: userRow.updated_at,
    };

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Local PC session error:', error);
    return NextResponse.json({ user: null });
  }
}
