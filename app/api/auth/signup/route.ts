import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { email, password, username, fullName } = body;

    if (!email || !password || !username || !fullName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().trim();
    const cleanFullName = fullName.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: cleanUsername,
          full_name: cleanFullName,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'User registration failed.' }, { status: 400 });
    }

    // Ensure profile row exists in Supabase
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!existingProfile) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        username: cleanUsername,
        full_name: cleanFullName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      } as any);
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
