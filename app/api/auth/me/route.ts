import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const userRow = db.prepare('SELECT * FROM profiles WHERE id = ?').get(DEMO_CURRENT_USER.id) as any;

    if (!userRow) {
      return NextResponse.json({ user: DEMO_CURRENT_USER });
    }

    return NextResponse.json({
      user: {
        ...userRow,
        is_verified: Boolean(userRow.is_verified),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ user: DEMO_CURRENT_USER });
  }
}
