import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Community } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare('SELECT * FROM communities ORDER BY members_count DESC')
      .all() as any[];

    const communities: Community[] = rows.map((r) => ({
      ...r,
      is_verified: Boolean(r.is_verified),
    }));

    return NextResponse.json({ communities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
