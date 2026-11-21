'use client';

import React, { useState } from 'react';
import { Users, Plus, Check, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DEMO_COMMUNITIES } from '@/lib/constants/demo-data';
import { formatNumber } from '@/lib/utils/formatters';

export default function CommunitiesPage() {
  const [joinedMap, setJoinedMap] = useState<Record<string, boolean>>({
    comm_01: true,
  });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Design & 3D', 'Music & Audio', 'Science'];

  const toggleJoin = (commId: string) => {
    setJoinedMap((prev) => ({
      ...prev,
      [commId]: !prev[commId],
    }));
  };

  const filteredCommunities = DEMO_COMMUNITIES.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-reelo-border">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-reelo-secondary" />
            <h1 className="text-xl sm:text-2xl font-black text-reelo-primary tracking-tight">
              REELO Communities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-reelo-muted mt-1">
            Discover and join niche creator guilds, developer pods, and collectives.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="self-start sm:self-auto rounded-lg font-bold"
          onClick={() => alert('Community creation studio is available for verified creators.')}
        >
          <Plus className="w-4 h-4 mr-1" />
          Create Community
        </Button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-reelo-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities by topic, domain, or keywords..."
            className="w-full bg-white border border-reelo-border text-xs text-reelo-text placeholder:text-reelo-muted rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-reelo-secondary focus:ring-2 focus:ring-reelo-secondary/20 shadow-subtle transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-reelo-primary text-white shadow-subtle'
                  : 'bg-white border border-reelo-border text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCommunities.map((comm) => {
          const isJoined = Boolean(joinedMap[comm.id]);

          return (
            <Card
              key={comm.id}
              className="flex flex-col justify-between p-5 bg-white border-reelo-border shadow-subtle hover:border-reelo-borderHover transition-all space-y-4"
            >
              {/* Community Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={comm.avatar_url}
                      alt={comm.name}
                      size="lg"
                      isVerified={comm.is_verified}
                      className="rounded-2xl"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-reelo-primary group-hover:text-reelo-secondary transition-all">
                          {comm.name}
                        </h3>
                      </div>
                      <span className="text-[11px] text-reelo-muted font-medium">
                        {formatNumber(comm.members_count + (isJoined ? 1 : 0))} members
                      </span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="text-[10px]">
                    {comm.category}
                  </Badge>
                </div>

                <p className="text-xs text-reelo-text leading-relaxed line-clamp-2">
                  {comm.description}
                </p>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-reelo-border flex items-center justify-between">
                <span className="text-[11px] text-reelo-muted font-mono">
                  c/{comm.slug}
                </span>

                <Button
                  size="sm"
                  variant={isJoined ? 'secondary' : 'primary'}
                  onClick={() => toggleJoin(comm.id)}
                  className="text-xs px-3 py-1 rounded-lg font-semibold"
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-reelo-secondary" />
                      Joined
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Join
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
