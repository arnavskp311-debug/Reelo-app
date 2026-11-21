import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId } from '@/lib/db';
import { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const db = getDb();
    const username = params.username.toLowerCase().trim();

    const row = db
      .prepare('SELECT * FROM profiles WHERE lower(username) = lower(?)')
      .get(username) as any;

    if (!row) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile: Profile = {
      id: row.id,
      username: row.username,
      full_name: row.full_name,
      avatar_url: row.avatar_url,
      banner_url: row.banner_url || null,
      bio: row.bio || '',
      website: row.website || '',
      location: row.location || '',
      is_verified: Boolean(row.is_verified),
      followers_count: row.followers_count || 0,
      following_count: row.following_count || 0,
      posts_count: row.posts_count || 0,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(request);
    const body = await request.json();
    const { full_name, bio, location, website, avatar_url, banner_url } = body;

    const existing = db.prepare('SELECT * FROM profiles WHERE id = ?').get(currentUserId) as any;
    if (!existing) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const updatedFullName = full_name ? full_name.trim() : existing.full_name;
    const updatedBio = bio !== undefined ? bio : existing.bio;
    const updatedLocation = location !== undefined ? location : existing.location;
    const updatedWebsite = website !== undefined ? website : existing.website;
    const updatedAvatar = avatar_url || existing.avatar_url;
    const updatedBanner = banner_url !== undefined ? banner_url : existing.banner_url;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE profiles
      SET full_name = ?, bio = ?, location = ?, website = ?, avatar_url = ?, banner_url = ?, updated_at = ?
      WHERE id = ?
    `).run(
      updatedFullName,
      updatedBio,
      updatedLocation,
      updatedWebsite,
      updatedAvatar,
      updatedBanner,
      now,
      currentUserId
    );

    const updatedRow = db.prepare('SELECT * FROM profiles WHERE id = ?').get(currentUserId) as any;

    const updatedProfile: Profile = {
      id: updatedRow.id,
      username: updatedRow.username,
      full_name: updatedRow.full_name,
      avatar_url: updatedRow.avatar_url,
      banner_url: updatedRow.banner_url || null,
      bio: updatedRow.bio || '',
      website: updatedRow.website || '',
      location: updatedRow.location || '',
      is_verified: Boolean(updatedRow.is_verified),
      followers_count: updatedRow.followers_count || 0,
      following_count: updatedRow.following_count || 0,
      posts_count: updatedRow.posts_count || 0,
      created_at: updatedRow.created_at,
      updated_at: updatedRow.updated_at,
    };

    return NextResponse.json({ profile: updatedProfile });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
