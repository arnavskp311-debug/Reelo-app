import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const postId = params.id;
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: existingBookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingBookmark && (existingBookmark as any).id) {
      await supabase.from('bookmarks').delete().eq('id', (existingBookmark as any).id);
      return NextResponse.json({ bookmarked: false });
    } else {
      await supabase.from('bookmarks').insert({ post_id: postId, user_id: user.id } as any);
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
