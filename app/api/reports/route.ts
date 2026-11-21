import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';

    const { data: reports, error } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles!reports_reporter_id_fkey(username, full_name)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (reports || []).map((r: any) => ({
      ...r,
      reporter_username: r.reporter?.username,
      reporter_name: r.reporter?.full_name,
    }));

    return NextResponse.json({ reports: formatted });
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
    const { target_type, target_id, reason, details } = body;

    if (!target_type || !target_id || !reason) {
      return NextResponse.json(
        { error: 'Missing required report fields (target_type, target_id, reason)' },
        { status: 400 }
      );
    }

    const { data: report, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        target_type,
        target_id,
        reason,
        details: details || '',
        status: 'pending',
      } as any)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { report_id, status, action } = body;

    if (!report_id || !status) {
      return NextResponse.json({ error: 'Missing report_id or status' }, { status: 400 });
    }

    const now = new Date().toISOString();

    // If moderator chose to remove content, delete post from Supabase
    if (action === 'delete_content') {
      const { data: report } = await supabase
        .from('reports')
        .select('target_type, target_id')
        .eq('id', report_id)
        .maybeSingle();

      if (report && (report as any).target_type === 'post') {
        await supabase
          .from('posts')
          .delete()
          .eq('id', (report as any).target_id);
      }
    }

    const { error: updateError } = await (supabase
      .from('reports') as any)
      .update({
        status,
        resolved_at: now,
        resolved_by: user.id,
      })
      .eq('id', report_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, report_id, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
