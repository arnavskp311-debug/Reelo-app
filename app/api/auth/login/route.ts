import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Profile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanIdentifier = email.toLowerCase().trim();

    // Query local PC profiles table
    const userRow = db.prepare(`
      SELECT * FROM profiles 
      WHERE LOWER(email) = ? OR LOWER(username) = ?
    `).get(cleanIdentifier, cleanIdentifier) as any;

    if (!userRow) {
      return NextResponse.json({ error: 'No account found matching these credentials.' }, { status: 404 });
    }

    // Check password if set or accept demo password
    if (userRow.password_hash && userRow.password_hash !== password && password !== 'demo123456') {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
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

    const response = NextResponse.json({ user, error: null });
    response.cookies.set('reelo_session', user.id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Local PC login error:', error);
    return NextResponse.json({ error: error.message || 'Internal database error.' }, { status: 500 });
  }
}
