'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { StoryTray } from '@/components/feed/StoryTray';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { CreatePostPrompt } from '@/components/feed/CreatePostPrompt';
import { PostCard } from '@/components/feed/PostCard';
import { ReelsTheaterModal, ReelData } from '@/components/feed/ReelsTheaterModal';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const {
    posts,
    loading,
    filter,
    setFilter,
    handleLike,
    handleBookmark,
    handleCreatePost,
  } = usePosts('for-you');

  const [isTheaterOpen, setIsTheaterOpen] = useState(false);

  const mediaPosts = posts.filter((p) => p.media_urls && p.media_urls.length > 0);
  const reelList: ReelData[] = mediaPosts.map((p) => ({
    id: p.id,
    title: p.content,
    mediaUrl: p.media_urls[0],
    creator: p.author,
    likes: p.likes_count,
    comments: p.comments_count,
    tags: p.tags,
  }));

  return (
    <div className="space-y-6">
      {/* Top Reel & Story Highlights */}
      <section className="bg-white p-3.5 sm:p-4 rounded-2xl border border-reelo-border shadow-subtle">
        <StoryTray />
      </section>

      {/* Inline Post Trigger Box */}
      <CreatePostPrompt
        onPostCreated={async (content) => {
          return await handleCreatePost({ content });
        }}
      />

      {/* Feed Filter Tabs */}
      <FeedTabs activeTab={filter} onTabChange={setFilter} />

      {/* Reels Fullscreen Theater Launcher banner when viewing Reels */}
      {filter === 'reels' && reelList.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-reelo-border shadow-subtle flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-reelo-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-reelo-secondary animate-pulse" />
              9:16 Vertical Reels Theater
            </h4>
            <p className="text-xs text-reelo-muted">
              Immerse yourself in full-screen creator clips with gesture controls.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsTheaterOpen(true)}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Theater</span>
          </Button>
        </div>
      )}

      {/* Feed Stream */}
      <div className="space-y-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white border border-reelo-border shadow-subtle animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-reelo-border shadow-subtle space-y-2">
            <p className="text-base font-bold text-reelo-primary">No posts found in this feed.</p>
            <p className="text-xs text-reelo-muted">
              Be the first to share an insight or explore trending communities.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))
        )}
      </div>

      {/* Theater Modal */}
      {isTheaterOpen && reelList.length > 0 && (
        <ReelsTheaterModal
          isOpen={isTheaterOpen}
          initialIndex={0}
          reels={reelList}
          onClose={() => setIsTheaterOpen(false)}
        />
      )}
    </div>
  );
}
