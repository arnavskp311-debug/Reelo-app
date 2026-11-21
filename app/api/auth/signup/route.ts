import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Profile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { email, password, username, fullName } = body;

    if (!email || !password || !username || !fullName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanFullName = fullName.trim();

    if (cleanUsername.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Check if username or email already exists in local database
    const existing = db.prepare('SELECT id, username, email FROM profiles WHERE username = ? OR email = ?').get(cleanUsername, cleanEmail) as any;

    if (existing) {
      if (existing.username === cleanUsername) {
        return NextResponse.json({ error: 'Username is already taken. Please choose another.' }, { status: 400 });
      }
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;

    db.prepare(`
      INSERT INTO profiles (
        id, username, full_name, email, password_hash, avatar_url,
        followers_count, following_count, posts_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?)
    `).run(userId, cleanUsername, cleanFullName, cleanEmail, password, avatarUrl, now, now);

    const user: Profile = {
      id: userId,
      username: cleanUsername,
      full_name: cleanFullName,
      avatar_url: avatarUrl,
      banner_url: null,
      bio: '',
      website: '',
      location: '',
      is_verified: false,
      followers_count: 0,
      following_count: 0,
      posts_count: 0,
      created_at: now,
      updated_at: now,
    };

    const response = NextResponse.json({ user, error: null });
    response.cookies.set('reelo_session', userId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Local PC signup error:', error);
    return NextResponse.json({ error: error.message || 'Internal database error.' }, { status: 500 });
  }
}
