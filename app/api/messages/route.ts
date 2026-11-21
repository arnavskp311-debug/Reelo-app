import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const peerId = searchParams.get('peerId');
    const myId = DEMO_CURRENT_USER.id;

    let query = `
      SELECT m.*, 
             s.full_name as sender_name, s.avatar_url as sender_avatar,
             r.full_name as recipient_name, r.avatar_url as recipient_avatar
      FROM messages m
      JOIN profiles s ON m.sender_id = s.id
      JOIN profiles r ON m.recipient_id = r.id
    `;

    let rows: any[] = [];
    if (peerId) {
      query += ` WHERE (m.sender_id = ? AND m.recipient_id = ?) OR (m.sender_id = ? AND m.recipient_id = ?) ORDER BY m.created_at ASC`;
      rows = db.prepare(query).all(myId, peerId, peerId, myId);
    } else {
      query += ` WHERE m.sender_id = ? OR m.recipient_id = ? ORDER BY m.created_at DESC`;
      rows = db.prepare(query).all(myId, myId);
    }

    return NextResponse.json({ messages: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { recipientId, content } = body;
    const senderId = DEMO_CURRENT_USER.id;

    if (!content || !content.trim() || !recipientId) {
      return NextResponse.json({ error: 'Recipient and content are required' }, { status: 400 });
    }

    const msgId = `msg_${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO messages (id, sender_id, recipient_id, content, is_read, created_at)
      VALUES (?, ?, ?, ?, 0, ?)
    `).run(msgId, senderId, recipientId, content.trim(), now);

    return NextResponse.json({
      message: {
        id: msgId,
        sender_id: senderId,
        recipient_id: recipientId,
        content: content.trim(),
        is_read: false,
        created_at: now,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
