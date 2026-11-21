'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Play, Heart } from 'lucide-react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs, ProfileTab } from '@/components/profile/ProfileTabs';
import { PostCard } from '@/components/feed/PostCard';
import { ReelsTheaterModal, ReelData } from '@/components/feed/ReelsTheaterModal';
import { userService } from '@/services/userService';
import { DEMO_POSTS, DEMO_CURRENT_USER } from '@/lib/constants/demo-data';
import { Profile, PostWithAuthor } from '@/types';

export default function UserPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [theaterReelIndex, setTheaterReelIndex] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      if (!username) return;
      setLoading(true);
      const user = await userService.getProfileByUsername(username);
      if (user) {
        setProfile(user);
        // Find posts authored by this user
        const authorPosts = DEMO_POSTS.filter(
          (p) => p.author.username.toLowerCase() === username.toLowerCase()
        );
        setPosts(authorPosts.length > 0 ? authorPosts : [DEMO_POSTS[0]]);
      }
      setLoading(false);
    }
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-64 rounded-2xl bg-reelo-card/50" />
        <div className="h-40 rounded-2xl bg-reelo-card/30" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 bg-reelo-card/40 rounded-2xl border border-reelo-border space-y-3">
        <h2 className="text-lg font-bold text-white">Creator Not Found</h2>
        <p className="text-xs text-slate-400">
          The handle @{username} does not exist or has moved.
        </p>
        <button
          onClick={() => router.push('/explore')}
          className="text-xs text-blue-400 hover:underline"
        >
          Explore Creators
        </button>
      </div>
    );
  }

  const isSelf = profile.id === DEMO_CURRENT_USER.id;

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
      <ProfileHeader profile={profile} isSelf={isSelf} />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'reels' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mediaPosts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-xs text-slate-400">
              No reels or visual media uploaded yet.
            </div>
          ) : (
            mediaPosts.map((post, idx) => (
              <div
                key={post.id}
                onClick={() => setTheaterReelIndex(idx)}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden border border-reelo-border bg-slate-900 cursor-pointer shadow-sm hover:border-slate-600 transition-all"
              >
                <Image
                  src={post.media_urls[0]}
                  alt="Reel thumbnail"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-2.5 right-2.5 p-1 rounded-full bg-black/60 text-white backdrop-blur-xs">
                  <Play className="w-3 h-3 fill-white" />
                </span>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1 font-semibold text-[11px]">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{post.likes_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-reelo-card/40 rounded-2xl border border-reelo-border/50 text-slate-400 text-xs">
              No posts found for this user.
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {theaterReelIndex !== null && reelList.length > 0 && (
        <ReelsTheaterModal
          isOpen={theaterReelIndex !== null}
          initialIndex={theaterReelIndex}
          reels={reelList}
          onClose={() => setTheaterReelIndex(null)}
        />
      )}
    </div>
  );
}
