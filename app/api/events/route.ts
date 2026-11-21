import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId, getServerSessionUser } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(request);

    const rows = db.prepare(`
      SELECT 
        e.*,
        p.username as creator_username,
        p.full_name as creator_name,
        p.avatar_url as creator_avatar,
        (SELECT status FROM event_rsvps r WHERE r.event_id = e.id AND r.user_id = ?) as user_rsvp
      FROM events e
      JOIN profiles p ON e.creator_id = p.id
      ORDER BY e.start_time ASC
    `).all(currentUserId) as any[];

    const events = rows.map((r) => ({
      id: r.id,
      creator_id: r.creator_id,
      title: r.title,
      description: r.description,
      cover_url: r.cover_url,
      start_time: r.start_time,
      location_type: r.location_type,
      location_details: r.location_details,
      attendees_count: r.attendees_count || 1,
      user_rsvp: r.user_rsvp || null,
      creator: {
        id: r.creator_id,
        username: r.creator_username,
        full_name: r.creator_name,
        avatar_url: r.creator_avatar,
      },
    }));

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const user = getServerSessionUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, cover_url, start_time, location_type = 'online', location_details } = body;

    if (!title || !description || !start_time) {
      return NextResponse.json({ error: 'Title, description, and start time are required' }, { status: 400 });
    }

    const id = `evt_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO events (id, creator_id, title, description, cover_url, start_time, location_type, location_details, attendees_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      id,
      user.id,
      title.trim(),
      description.trim(),
      cover_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      start_time,
      location_type,
      location_details || 'Online Stage',
      now
    );

    // Auto RSVP creator as going
    db.prepare(`
      INSERT INTO event_rsvps (id, event_id, user_id, status, created_at)
      VALUES (?, ?, ?, 'going', ?)
    `).run(crypto.randomUUID(), id, user.id, now);

    return NextResponse.json({ success: true, event_id: id });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
