import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Community } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM communities ORDER BY members_count DESC').all() as any[];

    const communities: Community[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      avatar_url: r.avatar_url,
      banner_url: r.banner_url || null,
      creator_id: r.creator_id,
      members_count: r.members_count || 1,
      is_verified: Boolean(r.is_verified),
      category: r.category,
      created_at: r.created_at,
    }));

    return NextResponse.json({ communities });
  } catch (error: any) {
    console.error('Error fetching communities from local PC DB:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
