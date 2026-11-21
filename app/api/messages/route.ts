import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(request);
    const { searchParams } = new URL(request.url);
    const peerId = searchParams.get('peer_id');

    let rows: any[] = [];
    if (peerId) {
      rows = db.prepare(`
        SELECT * FROM messages 
        WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?)
        ORDER BY created_at ASC
      `).all(currentUserId, peerId, peerId, currentUserId) as any[];
    } else {
      rows = db.prepare(`
        SELECT * FROM messages 
        WHERE sender_id = ? OR recipient_id = ?
        ORDER BY created_at ASC
      `).all(currentUserId, currentUserId) as any[];
    }

    const messages = rows.map((r) => ({
      id: r.id,
      sender_id: r.sender_id,
      recipient_id: r.recipient_id,
      content: r.content,
      is_read: Boolean(r.is_read),
      created_at: r.created_at,
    }));

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Error fetching messages from local DB:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(request);
    const body = await request.json();
    const { recipient_id, content } = body;

    if (!recipient_id || !content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'recipient_id and valid content are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO messages (id, sender_id, recipient_id, content, is_read, created_at)
      VALUES (?, ?, ?, ?, 0, ?)
    `).run(id, currentUserId, recipient_id, content.trim(), now);

    const newMessage = {
      id,
      sender_id: currentUserId,
      recipient_id,
      content: content.trim(),
      is_read: false,
      created_at: now,
    };

    return NextResponse.json({ message: newMessage });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
