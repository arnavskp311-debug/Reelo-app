import { PostWithAuthor } from '@/types';
import { DEMO_POSTS } from '@/lib/constants/demo-data';

let memoryPosts: PostWithAuthor[] = [...DEMO_POSTS];

export const postService = {
  async getPosts(filter: 'for-you' | 'following' | 'reels' | 'trending' = 'for-you'): Promise<PostWithAuthor[]> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/posts?filter=${filter}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.posts && Array.isArray(data.posts)) {
            memoryPosts = data.posts;
            return data.posts;
          }
        }
      } catch (err) {
        console.warn('Local API fetch failed, falling back to local memory store:', err);
      }
    }

    if (filter === 'reels') {
      return memoryPosts.filter((p) => p.media_type === 'reel' || (p.media_urls && p.media_urls.length > 0));
    }
    if (filter === 'trending') {
      return [...memoryPosts].sort((a, b) => b.likes_count - a.likes_count);
    }
    return memoryPosts;
  },

  async createPost(params: {
    content: string;
    mediaUrls?: string[];
    mediaType?: 'image' | 'video' | 'reel' | 'none';
    tags?: string[];
    communityId?: string | null;
  }): Promise<{ post: PostWithAuthor | null; error: string | null }> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        if (res.ok && data.post) {
          memoryPosts = [data.post, ...memoryPosts];
          return { post: data.post, error: null };
        }
        return { post: null, error: data.error || 'Failed to create post.' };
      } catch (err: any) {
        console.error('Local SQLite post creation error:', err);
      }
    }

    return { post: null, error: 'Database service unavailable.' };
  },

  async toggleLike(postId: string): Promise<{ liked: boolean; newCount: number }> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          return { liked: data.liked, newCount: data.newCount };
        }
      } catch (err) {
        console.error('Local like toggle error:', err);
      }
    }

    return { liked: true, newCount: 1 };
  },

  async toggleBookmark(postId: string): Promise<{ bookmarked: boolean }> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/posts/${postId}/bookmark`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          return { bookmarked: data.bookmarked };
        }
      } catch (err) {
        console.error('Local bookmark toggle error:', err);
      }
    }

    return { bookmarked: true };
  },
};
