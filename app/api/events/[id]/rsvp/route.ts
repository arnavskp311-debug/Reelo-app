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
    const eventId = params.id;
    const userId = getServerSessionUserId(request);
    const body = await request.json().catch(() => ({ status: 'going' }));
    const rsvpStatus = body.status || 'going';

    const existing = db.prepare(`
      SELECT id, status FROM event_rsvps 
      WHERE event_id = ? AND user_id = ?
    `).get(eventId, userId) as any;

    if (existing) {
      db.prepare('DELETE FROM event_rsvps WHERE id = ?').run(existing.id);
      db.prepare('UPDATE events SET attendees_count = MAX(0, attendees_count - 1) WHERE id = ?').run(eventId);
      return NextResponse.json({ rsvp: null });
    } else {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO event_rsvps (id, event_id, user_id, status, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, eventId, userId, rsvpStatus, now);
      db.prepare('UPDATE events SET attendees_count = attendees_count + 1 WHERE id = ?').run(eventId);
      return NextResponse.json({ rsvp: rsvpStatus });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
