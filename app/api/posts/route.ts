import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PostWithAuthor } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'for-you';
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    const { data: { user } } = await supabase.auth.getUser();

    let blockedIds: string[] = [];
    let followingIds: string[] = [];
    let savedPostIds: string[] = [];
    let userLikedIds = new Set<string>();
    let userBookmarkedIds = new Set<string>();

    if (user) {
      const [blocksRes, followsRes, bookmarksRes, likesRes] = await Promise.all([
        supabase.from('blocks').select('blocked_id').eq('blocker_id', user.id),
        supabase.from('follows').select('following_id').eq('follower_id', user.id),
        supabase.from('bookmarks').select('post_id').eq('user_id', user.id),
        supabase.from('likes').select('post_id').eq('user_id', user.id),
      ]);

      if (blocksRes.data) blockedIds = blocksRes.data.map((b: any) => b.blocked_id);
      if (followsRes.data) followingIds = followsRes.data.map((f: any) => f.following_id);
      if (bookmarksRes.data) {
        savedPostIds = bookmarksRes.data.map((b: any) => b.post_id);
        userBookmarkedIds = new Set(savedPostIds);
      }
      if (likesRes.data) {
        userLikedIds = new Set(likesRes.data.map((l: any) => l.post_id));
      }
    }

    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_user_id_fkey(*)
      `)
      .limit(limit);

    if (blockedIds.length > 0) {
      query = query.not('user_id', 'in', `(${blockedIds.join(',')})`);
    }

    if (filter === 'reels') {
      query = query.in('media_type', ['video', 'reel']);
    } else if (filter === 'following' && user) {
      if (followingIds.length > 0) {
        query = query.in('user_id', followingIds);
      } else {
        return NextResponse.json({ posts: [] });
      }
    } else if (filter === 'saved' && user) {
      if (savedPostIds.length > 0) {
        query = query.in('id', savedPostIds);
      } else {
        return NextResponse.json({ posts: [] });
      }
    }

    if (filter === 'trending') {
      query = query.order('likes_count', { ascending: false }).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: postsData, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const posts: PostWithAuthor[] = (postsData || []).map((post: any) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      media_urls: post.media_urls || [],
      media_type: post.media_type || 'none',
      likes_count: post.likes_count || 0,
      comments_count: post.comments_count || 0,
      reposts_count: post.reposts_count || 0,
      community_id: post.community_id || null,
      tags: post.tags || [],
      is_pinned: Boolean(post.is_pinned),
      created_at: post.created_at,
      updated_at: post.updated_at,
      author: post.author || {
        id: post.user_id,
        username: 'creator',
        full_name: 'REELO Member',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user_id}`,
        is_verified: false,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        created_at: post.created_at,
        updated_at: post.created_at,
      },
      user_has_liked: userLikedIds.has(post.id),
      user_has_bookmarked: userBookmarkedIds.has(post.id),
    }));

    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required to post.' }, { status: 401 });
    }

    const body = await request.json();
    const { content, mediaUrls, mediaType, tags, communityId } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Post content cannot be empty.' }, { status: 400 });
    }

    const newPostPayload = {
      user_id: user.id,
      content: content.trim(),
      media_urls: mediaUrls || [],
      media_type: mediaType || 'none',
      tags: tags || [],
      community_id: communityId || null,
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
      is_pinned: false,
    };

    const { data: newPost, error: insertError } = await supabase
      .from('posts')
      .insert(newPostPayload as any)
      .select(`
        *,
        author:profiles!posts_user_id_fkey(*)
      `)
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const postWithAuthor: PostWithAuthor = {
      ...(newPost as any),
      author: (newPost as any)?.author || {
        id: user.id,
        username: 'you',
        full_name: 'You',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      },
      user_has_liked: false,
      user_has_bookmarked: false,
    };

    return NextResponse.json({ post: postWithAuthor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
