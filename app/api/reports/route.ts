import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';

    const stmt = db.prepare(`
      SELECT 
        r.*,
        p.username as reporter_username,
        p.full_name as reporter_name
      FROM reports r
      LEFT JOIN profiles p ON r.reporter_id = p.id
      WHERE r.status = ?
      ORDER BY r.created_at DESC
    `);

    const reports = stmt.all(status);
    return NextResponse.json({ reports });
  } catch (error: any) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target_type, target_id, reason, details } = body;

    if (!target_type || !target_id || !reason) {
      return NextResponse.json(
        { error: 'Missing required report fields (target_type, target_id, reason)' },
        { status: 400 }
      );
    }

    const db = getDb();
    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO reports (
        id, reporter_id, target_type, target_id, reason, details, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
    `);

    insertStmt.run(
      reportId,
      DEMO_CURRENT_USER.id,
      target_type,
      target_id,
      reason,
      details || '',
      now
    );

    return NextResponse.json({
      success: true,
      report: {
        id: reportId,
        target_type,
        target_id,
        reason,
        status: 'pending',
        created_at: now,
      },
    });
  } catch (error: any) {
    console.error('Failed to submit report:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { report_id, status, action } = body;

    if (!report_id || !status) {
      return NextResponse.json({ error: 'Missing report_id or status' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    // If moderator chose to remove content, delete post
    if (action === 'delete_content') {
      const reportStmt = db.prepare('SELECT target_type, target_id FROM reports WHERE id = ?');
      const report = reportStmt.get(report_id) as any;

      if (report && report.target_type === 'post') {
        const deletePostStmt = db.prepare('DELETE FROM posts WHERE id = ?');
        deletePostStmt.run(report.target_id);
      }
    }

    const updateStmt = db.prepare(`
      UPDATE reports
      SET status = ?, resolved_at = ?, resolved_by = ?
      WHERE id = ?
    `);

    updateStmt.run(status, now, DEMO_CURRENT_USER.id, report_id);

    return NextResponse.json({ success: true, report_id, status });
  } catch (error: any) {
    console.error('Failed to update report:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
