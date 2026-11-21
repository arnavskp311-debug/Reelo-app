import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';

    const rows = db.prepare(`
      SELECT 
        r.*,
        p.username as reporter_username,
        p.full_name as reporter_name
      FROM reports r
      LEFT JOIN profiles p ON r.reporter_id = p.id
      WHERE r.status = ?
      ORDER BY r.created_at DESC
    `).all(status) as any[];

    return NextResponse.json({ reports: rows });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const currentUserId = getServerSessionUserId(req);
    const body = await req.json();
    const { target_type, target_id, reason, details } = body;

    if (!target_type || !target_id || !reason) {
      return NextResponse.json({ error: 'Missing required report fields' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO reports (id, reporter_id, target_type, target_id, reason, details, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
    `).run(
      id,
      currentUserId,
      target_type,
      target_id,
      reason,
      details || null,
      now
    );

    return NextResponse.json({ success: true, report_id: id });
  } catch (error: any) {
    console.error('Error submitting report:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const db = getDb();
    const body = await req.json();
    const { report_id, status, notes } = body;

    if (!report_id || !status) {
      return NextResponse.json({ error: 'report_id and status are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE reports 
      SET status = ?, resolution_notes = ?, resolved_at = ?
      WHERE id = ?
    `).run(status, notes || null, now, report_id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
