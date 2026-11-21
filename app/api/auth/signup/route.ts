import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Profile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { username, fullName, email } = body;

    if (!username || !fullName) {
      return NextResponse.json({ error: 'Username and Full Name are required.' }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const userId = `usr_${Date.now()}`;
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO profiles (
        id, username, full_name, avatar_url, banner_url, bio, website, location,
        is_verified, followers_count, following_count, posts_count, created_at, updated_at
      ) VALUES (?, ?, ?, null, null, '', null, null, 0, 0, 0, 0, ?, ?)
    `);

    insert.run(userId, cleanUsername, fullName, now, now);

    const user: Profile = {
      id: userId,
      username: cleanUsername,
      full_name: fullName,
      avatar_url: null,
      banner_url: null,
      bio: '',
      website: null,
      location: null,
      is_verified: false,
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
      created_at: now,
      updated_at: now,
    };

    return NextResponse.json({ user, error: null });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
