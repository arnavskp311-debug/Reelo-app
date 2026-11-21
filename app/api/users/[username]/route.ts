import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Profile } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const db = getDb();
    const username = params.username.toLowerCase();

    const row = db
      .prepare('SELECT * FROM profiles WHERE LOWER(username) = ?')
      .get(username) as any;

    if (!row) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile: Profile = {
      ...row,
      is_verified: Boolean(row.is_verified),
    };

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const db = getDb();
    const username = params.username.toLowerCase();
    const body = await request.json();
    const { full_name, bio, website, location, avatar_url, banner_url } = body;

    const row = db
      .prepare('SELECT id FROM profiles WHERE LOWER(username) = ?')
      .get(username) as any;

    if (!row) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE profiles
      SET full_name = COALESCE(?, full_name),
          bio = COALESCE(?, bio),
          website = COALESCE(?, website),
          location = COALESCE(?, location),
          avatar_url = COALESCE(?, avatar_url),
          banner_url = COALESCE(?, banner_url),
          updated_at = ?
      WHERE id = ?
    `).run(
      full_name ?? null,
      bio ?? null,
      website ?? null,
      location ?? null,
      avatar_url ?? null,
      banner_url ?? null,
      now,
      row.id
    );

    const updated = db.prepare('SELECT * FROM profiles WHERE id = ?').get(row.id) as any;

    return NextResponse.json({
      profile: {
        ...updated,
        is_verified: Boolean(updated.is_verified),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
