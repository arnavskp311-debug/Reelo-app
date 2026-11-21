import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ blocked_ids: [] });
    }

    const { data: blocks, error } = await supabase
      .from('blocks')
      .select('blocked_id')
      .eq('blocker_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const blockedIds = (blocks || []).map((b: any) => b.blocked_id);
    return NextResponse.json({ blocked_ids: blockedIds });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { blocked_id } = body;

    if (!blocked_id) {
      return NextResponse.json({ error: 'Missing blocked_id' }, { status: 400 });
    }

    if (blocked_id === user.id) {
      return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blocks')
      .insert({
        blocker_id: user.id,
        blocked_id,
      } as any)
      .select()
      .single();

    if (error && error.code !== '23505') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, block: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { blocked_id } = body;

    if (!blocked_id) {
      return NextResponse.json({ error: 'Missing blocked_id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('blocks')
      .delete()
      .eq('blocker_id', user.id)
      .eq('blocked_id', blocked_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
