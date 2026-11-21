import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ user: null });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      return NextResponse.json({ user: profile });
    }

    const meta = user.user_metadata || {};
    return NextResponse.json({
      user: {
        id: user.id,
        username: meta.username || user.email?.split('@')[0] || 'user',
        full_name: meta.full_name || 'REELO Member',
        avatar_url: meta.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        created_at: user.created_at,
        updated_at: user.created_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
