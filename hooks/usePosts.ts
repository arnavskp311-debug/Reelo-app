'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostWithAuthor, FeedFilter } from '@/types';
import { postService } from '@/services/postService';

export function usePosts(initialFilter: FeedFilter = 'for-you') {
  const [filter, setFilter] = useState<FeedFilter>(initialFilter);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async (currentFilter: FeedFilter) => {
    setLoading(true);
    try {
      const data = await postService.getPosts(currentFilter);
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(filter);
  }, [filter, fetchPosts]);

  const handleLike = async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const currentlyLiked = Boolean(p.user_has_liked);
          return {
            ...p,
            user_has_liked: !currentlyLiked,
            likes_count: currentlyLiked ? Math.max(0, p.likes_count - 1) : p.likes_count + 1,
          };
        }
        return p;
      })
    );

    await postService.toggleLike(postId);
  };

  const handleBookmark = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            user_has_bookmarked: !p.user_has_bookmarked,
          };
        }
        return p;
      })
    );

    await postService.toggleBookmark(postId);
  };

  const handleCreatePost = async (params: {
    content: string;
    mediaUrls?: string[];
    mediaType?: 'image' | 'video' | 'reel' | 'none';
    tags?: string[];
    communityId?: string | null;
  }) => {
    const res = await postService.createPost(params);
    if (res.post) {
      setPosts((prev) => [res.post!, ...prev]);
    }
    return res;
  };

  return {
    posts,
    loading,
    filter,
    setFilter,
    handleLike,
    handleBookmark,
    handleCreatePost,
    refresh: () => fetchPosts(filter),
  };
}
