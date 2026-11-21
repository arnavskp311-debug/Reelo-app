import { PostWithAuthor, Comment } from '@/types';

export const postService = {
  /**
   * Fetch posts from local PC database API with author profile and interaction flags.
   */
  async getPosts(
    filter: 'for-you' | 'following' | 'reels' | 'trending' | 'saved' = 'for-you'
  ): Promise<PostWithAuthor[]> {
    try {
      const res = await fetch(`/api/posts?filter=${filter}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        console.error('Failed to fetch posts from local API:', res.statusText);
        return [];
      }
      const data = await res.json();
      return data.posts || [];
    } catch (err) {
      console.error('Error in postService.getPosts:', err);
      return [];
    }
  },

  /**
   * Create a new post in local PC SQLite database.
   */
  async createPost(params: {
    content: string;
    mediaUrls?: string[];
    mediaType?: 'image' | 'video' | 'reel' | 'none';
    tags?: string[];
    communityId?: string | null;
  }): Promise<{ post: PostWithAuthor | null; error: string | null }> {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) {
        return { post: null, error: data.error || 'Failed to create post.' };
      }
      return { post: data.post, error: null };
    } catch (err: any) {
      return { post: null, error: err.message || 'Failed to create post.' };
    }
  },

  /**
   * Toggle a like on a post in local PC SQLite database.
   */
  async toggleLike(postId: string): Promise<{ liked: boolean; newCount: number }> {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
      const data = await res.json();
      return { liked: Boolean(data.liked), newCount: data.newCount || 0 };
    } catch (err) {
      console.error('Local PC toggleLike error:', err);
      return { liked: false, newCount: 0 };
    }
  },

  /**
   * Toggle a bookmark on a post in local PC SQLite database.
   */
  async toggleBookmark(postId: string): Promise<{ bookmarked: boolean }> {
    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
      });
      const data = await res.json();
      return { bookmarked: Boolean(data.bookmarked) };
    } catch (err) {
      console.error('Local PC toggleBookmark error:', err);
      return { bookmarked: false };
    }
  },

  /**
   * Fetch comments for a post from local PC database.
   */
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, { cache: 'no-store' });
      if (!res.ok) return [];
      const data = await res.json();
      return data.comments || [];
    } catch (err) {
      console.error('Error in postService.getComments:', err);
      return [];
    }
  },

  /**
   * Add a comment to a post in local PC database.
   */
  async addComment(
    postId: string,
    content: string,
    parentId?: string
  ): Promise<{ comment: Comment | null; error: string | null }> {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId }),
      });
      const data = await res.json();
      if (!res.ok) return { comment: null, error: data.error || 'Failed to post comment.' };
      return { comment: data.comment, error: null };
    } catch (err: any) {
      return { comment: null, error: err.message || 'Failed to post comment.' };
    }
  },
};
