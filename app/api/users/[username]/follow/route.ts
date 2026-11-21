import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const targetUsername = params.username.toLowerCase().trim();

    const { data: targetProfile } = await supabase
      .from('profiles')
      .select('id, followers_count')
      .eq('username', targetUsername)
      .maybeSingle();

    if (!targetProfile || !(targetProfile as any).id) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    const targetId = (targetProfile as any).id;

    if (targetId === user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetId)
      .maybeSingle();

    if (existingFollow && (existingFollow as any).id) {
      await supabase.from('follows').delete().eq('id', (existingFollow as any).id);
      return NextResponse.json({ following: false });
    } else {
      await supabase.from('follows').insert({
        follower_id: user.id,
        following_id: targetId,
      } as any);

      return NextResponse.json({ following: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
