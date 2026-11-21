import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';
import { Profile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { email, password } = body;

    // Check if profile exists matching username or default to current user
    const userRow = db.prepare('SELECT * FROM profiles WHERE id = ?').get(DEMO_CURRENT_USER.id) as any;

    if (!userRow) {
      return NextResponse.json({ user: DEMO_CURRENT_USER });
    }

    const user: Profile = {
      ...userRow,
      is_verified: Boolean(userRow.is_verified),
    };

    return NextResponse.json({ user, error: null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
