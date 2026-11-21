import { PostWithAuthor } from '@/types';
import { supabase } from '@/lib/supabase/client';

export const postService = {
  /**
   * Fetch posts from Supabase PostgreSQL with author profile and interaction flags.
   */
  async getPosts(filter: 'for-you' | 'following' | 'reels' | 'trending' = 'for-you'): Promise<PostWithAuthor[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_user_id_fkey(*)
        `);

      if (filter === 'reels') {
        query = query.in('media_type', ['video', 'reel']);
      } else if (filter === 'trending') {
        query = query.order('likes_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: postsData, error } = await query;

      if (error || !postsData) {
        console.error('Failed to fetch posts from Supabase:', error);
        return [];
      }

      // If user is authenticated, query their likes and bookmarks to set flags
      let userLikedIds = new Set<string>();
      let userBookmarkedIds = new Set<string>();

      if (user) {
        const [likesRes, bookmarksRes] = await Promise.all([
          supabase.from('likes').select('post_id').eq('user_id', user.id),
          supabase.from('bookmarks').select('post_id').eq('user_id', user.id),
        ]);

        if (likesRes.data) {
          userLikedIds = new Set(likesRes.data.map((l: any) => l.post_id));
        }
        if (bookmarksRes.data) {
          userBookmarkedIds = new Set(bookmarksRes.data.map((b: any) => b.post_id));
        }
      }

      return postsData.map((post: any) => ({
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
          full_name: 'REELO Creator',
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
    } catch (err) {
      console.error('Error in postService.getPosts:', err);
      return [];
    }
  },

  /**
   * Create a new post in Supabase PostgreSQL for the current authenticated user.
   */
  async createPost(params: {
    content: string;
    mediaUrls?: string[];
    mediaType?: 'image' | 'video' | 'reel' | 'none';
    tags?: string[];
    communityId?: string | null;
  }): Promise<{ post: PostWithAuthor | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { post: null, error: 'You must be signed in to create a post.' };
      }

      const newPostPayload = {
        user_id: user.id,
        content: params.content,
        media_urls: params.mediaUrls || [],
        media_type: params.mediaType || 'none',
        tags: params.tags || [],
        community_id: params.communityId || null,
        likes_count: 0,
        comments_count: 0,
        reposts_count: 0,
        is_pinned: false,
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(newPostPayload as any)
        .select(`
          *,
          author:profiles!posts_user_id_fkey(*)
        `)
        .single();

      if (error) {
        return { post: null, error: error.message };
      }

      const postWithAuthor: PostWithAuthor = {
        ...(data as any),
        author: (data as any)?.author || {
          id: user.id,
          username: 'you',
          full_name: 'You',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        },
        user_has_liked: false,
        user_has_bookmarked: false,
      };

      return { post: postWithAuthor, error: null };
    } catch (err: any) {
      return { post: null, error: err.message || 'Failed to create post.' };
    }
  },

  /**
   * Toggle a like on a post in Supabase.
   */
  async toggleLike(postId: string): Promise<{ liked: boolean; newCount: number }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { liked: false, newCount: 0 };
      }

      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike && (existingLike as any).id) {
        await supabase
          .from('likes')
          .delete()
          .eq('id', (existingLike as any).id);

        return { liked: false, newCount: 0 };
      } else {
        await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id } as any);

        return { liked: true, newCount: 1 };
      }
    } catch (err) {
      console.error('Supabase toggleLike error:', err);
      return { liked: false, newCount: 0 };
    }
  },

  /**
   * Toggle a bookmark on a post in Supabase.
   */
  async toggleBookmark(postId: string): Promise<{ bookmarked: boolean }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { bookmarked: false };
      }

      const { data: existingBookmark } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingBookmark && (existingBookmark as any).id) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('id', (existingBookmark as any).id);

        return { bookmarked: false };
      } else {
        await supabase
          .from('bookmarks')
          .insert({ post_id: postId, user_id: user.id } as any);

        return { bookmarked: true };
      }
    } catch (err) {
      console.error('Supabase toggleBookmark error:', err);
      return { bookmarked: false };
    }
  },
};
