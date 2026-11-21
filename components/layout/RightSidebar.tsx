'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Check, ArrowRight, UserPlus } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TRENDING_TAGS } from '@/lib/constants/navigation';
import { DEMO_USERS, DEMO_COMMUNITIES } from '@/lib/constants/demo-data';

export function RightSidebar() {
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFollow = (userId: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const creators = Object.values(DEMO_USERS).slice(0, 3);
  const spotlightCommunity = DEMO_COMMUNITIES[0];

  return (
    <aside className="hidden xl:flex flex-col w-80 2xl:w-88 h-screen sticky top-0 border-l border-reelo-border bg-reelo-surface px-5 py-6 space-y-5 overflow-y-auto no-scrollbar z-20 shadow-subtle">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-reelo-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search REELO..."
          className="w-full bg-reelo-surfaceMuted border border-reelo-border text-xs text-reelo-text placeholder:text-reelo-muted rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-reelo-secondary focus:ring-1 focus:ring-reelo-secondary/20 transition-all shadow-subtle"
        />
      </div>

      {/* Trending Topics */}
      <Card className="p-4 space-y-3 bg-white border-reelo-border shadow-subtle">
        <div className="flex items-center justify-between pb-1 border-b border-reelo-border">
          <div className="flex items-center gap-2 text-reelo-primary font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-reelo-secondary" />
            <span>Trending for you</span>
          </div>
          <Link href="/explore" className="text-xs text-reelo-muted hover:text-reelo-primary transition-colors">
            Show more
          </Link>
        </div>

        <div className="space-y-2 pt-1">
          {TRENDING_TAGS.slice(0, 4).map((item) => (
            <Link
              key={item.tag}
              href={`/explore?q=${encodeURIComponent(item.tag)}`}
              className="flex items-center justify-between group p-1.5 rounded-lg hover:bg-reelo-surfaceMuted transition-colors"
            >
              <div>
                <span className="text-[10px] text-reelo-muted font-medium">
                  {item.category}
                </span>
                <p className="text-xs font-semibold text-reelo-text group-hover:text-reelo-primary transition-colors">
                  {item.tag}
                </p>
              </div>
              <span className="text-[11px] text-reelo-muted font-medium">{item.postsCount}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Creators to Follow */}
      <Card className="p-4 space-y-3 bg-white border-reelo-border shadow-subtle">
        <div className="pb-1 border-b border-reelo-border">
          <span className="text-reelo-primary font-bold text-xs uppercase tracking-wider">
            Suggested Creators
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {creators.map((creator) => {
            const isFollowing = followingMap[creator.id];

            return (
              <div key={creator.id} className="flex items-center justify-between">
                <Link
                  href={`/profile/${creator.username}`}
                  className="flex items-center gap-2.5 group overflow-hidden"
                >
                  <Avatar
                    src={creator.avatar_url}
                    alt={creator.full_name}
                    size="sm"
                    isVerified={creator.is_verified}
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-reelo-text group-hover:text-reelo-primary truncate max-w-[110px]">
                      {creator.full_name}
                    </p>
                    <p className="text-[11px] text-reelo-muted truncate max-w-[110px]">
                      @{creator.username}
                    </p>
                  </div>
                </Link>

                <Button
                  size="sm"
                  variant={isFollowing ? 'secondary' : 'primary'}
                  className="text-xs px-2.5 py-1 rounded-lg h-7 font-medium"
                  onClick={() => toggleFollow(creator.id)}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-reelo-muted" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3 mr-1" /> Follow
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Featured Community */}
      {spotlightCommunity && (
        <Card className="p-4 space-y-2.5 bg-white border-reelo-border shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-reelo-muted">
              Community Spotlight
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-reelo-primary mb-1">{spotlightCommunity.name}</h4>
            <p className="text-[11px] text-reelo-muted line-clamp-2 leading-relaxed">
              {spotlightCommunity.description}
            </p>
          </div>

          <Link
            href="/communities"
            className="flex items-center justify-between text-xs font-semibold text-reelo-secondary hover:text-reelo-primary pt-1"
          >
            <span>View Community</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>
      )}

      {/* Footer */}
      <div className="text-[11px] text-reelo-muted space-y-1.5 pt-2 px-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-reelo-muted">
          <Link href="/docs/architecture" className="hover:text-reelo-primary">Architecture</Link>
          <Link href="/docs/features" className="hover:text-reelo-primary">Features</Link>
          <Link href="/moderation" className="hover:text-reelo-primary">Moderation</Link>
          <a href="#" className="hover:text-reelo-primary">Privacy</a>
          <a href="#" className="hover:text-reelo-primary">Terms</a>
        </div>
        <p>© 2026 REELO Platform Inc.</p>
      </div>
    </aside>
  );
}
