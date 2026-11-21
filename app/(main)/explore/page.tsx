'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Flame, Heart, Play } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ReelsTheaterModal, ReelData } from '@/components/feed/ReelsTheaterModal';
import { TRENDING_TAGS } from '@/lib/constants/navigation';
import { DEMO_USERS } from '@/lib/constants/demo-data';

const EXPLORE_CATEGORIES = ['All', 'Technology', '3D & VFX', 'Sound Lab', 'AI & Code', 'Cosmos'];

const EXPLORE_ITEMS = [
  {
    id: 'exp_01',
    title: 'Procedural Megacity Simulation in UE 5.5',
    category: '3D & VFX',
    mediaUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
    type: 'reel',
    likes: 4800,
    comments: 240,
    audioTitle: 'Neon Resonance • Elena Rostova',
    creator: DEMO_USERS.usr_01,
    tags: ['UnrealEngine', 'VFX', '3D'],
  },
  {
    id: 'exp_02',
    title: 'Aurora Borealis Over Volcanic Caldera',
    category: 'Cosmos',
    mediaUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop&q=80',
    type: 'reel',
    likes: 9200,
    comments: 512,
    audioTitle: 'Sub-Zero Wind Ambience • Maya Chen',
    creator: DEMO_USERS.usr_04,
    tags: ['Cosmos', 'Iceland', 'Astrophotography'],
  },
  {
    id: 'exp_03',
    title: 'Analog Modular Synthesizer Patch Matrix',
    category: 'Sound Lab',
    mediaUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    type: 'reel',
    likes: 2100,
    comments: 118,
    audioTitle: 'Tokyo Rainy Skyline • Kai Zenith',
    creator: DEMO_USERS.usr_02,
    tags: ['ModularSynth', 'SoundDesign', 'Tokyo'],
  },
  {
    id: 'exp_04',
    title: 'Neural Latent Diffusion Space Mapping',
    category: 'AI & Code',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    type: 'reel',
    likes: 6400,
    comments: 380,
    audioTitle: 'Machine Learning Pulse • Marcus Vance',
    creator: DEMO_USERS.usr_03,
    tags: ['NeuralNet', 'AIArt', 'Research'],
  },
  {
    id: 'exp_05',
    title: 'Deep Sky Nebula Stacking at 4200m Altitude',
    category: 'Cosmos',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    type: 'reel',
    likes: 3700,
    comments: 184,
    audioTitle: 'Stargazer Drone Suite • Maya Chen',
    creator: DEMO_USERS.usr_04,
    tags: ['DeepSky', 'Nebula', 'Astrophotography'],
  },
  {
    id: 'exp_06',
    title: 'Realtime Raytraced Glass Caustics',
    category: '3D & VFX',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    type: 'reel',
    likes: 5100,
    comments: 295,
    audioTitle: 'Optical Reflection Waves • Elena Rostova',
    creator: DEMO_USERS.usr_01,
    tags: ['Raytracing', 'CGI', 'Materials'],
  },
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [theaterReelIndex, setTheaterReelIndex] = useState<number | null>(null);

  const filteredItems = EXPLORE_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const reelList: ReelData[] = filteredItems.map((item) => ({
    id: item.id,
    title: item.title,
    mediaUrl: item.mediaUrl,
    audioTitle: item.audioTitle,
    creator: item.creator,
    likes: item.likes,
    comments: item.comments,
    tags: item.tags,
  }));

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-reelo-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search creators, reels, perspectives, or topics..."
          className="w-full bg-white border border-reelo-border text-sm text-reelo-text placeholder:text-reelo-muted rounded-xl pl-11 pr-4 py-3 outline-none focus:border-reelo-secondary focus:ring-2 focus:ring-reelo-secondary/20 shadow-subtle transition-all"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {EXPLORE_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all select-none ${
                isActive
                  ? 'bg-reelo-primary text-white shadow-subtle'
                  : 'bg-white border border-reelo-border text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Trending Tags Carousel Banner */}
      <Card className="p-4 bg-white border-reelo-border shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-reelo-primary">
          <Flame className="w-4 h-4 text-reelo-accent" />
          <span>Hot Trending Discussions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TAGS.map((t) => (
            <button
              key={t.tag}
              onClick={() => setSearchTerm(t.tag.replace('#', ''))}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-reelo-surfaceMuted border border-reelo-border text-xs text-reelo-text hover:border-reelo-primary hover:bg-white transition-colors"
            >
              <span className="font-semibold text-reelo-primary">{t.tag}</span>
              <span className="text-[10px] text-reelo-muted font-medium">{t.postsCount}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Visual Media Discovery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setTheaterReelIndex(idx)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-reelo-border bg-reelo-surfaceMuted cursor-pointer shadow-subtle hover:border-reelo-borderHover transition-all"
          >
            <Image
              src={item.mediaUrl}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 400px"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            {/* Top Badge */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <Badge variant="primary" className="text-[10px] bg-white/90 text-reelo-primary border-none shadow-sm backdrop-blur-xs font-bold">
                {item.category}
              </Badge>
              <span className="p-1.5 rounded-full bg-black/50 text-white backdrop-blur-xs">
                <Play className="w-3.5 h-3.5 fill-white" />
              </span>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-3 left-3 right-3 space-y-1">
              <h4 className="text-sm font-bold text-white group-hover:underline transition-all line-clamp-1">
                {item.title}
              </h4>
              <div className="flex items-center justify-between pt-1">
                <Link
                  href={`/profile/${item.creator.username}`}
                  className="flex items-center gap-2 hover:opacity-90"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar
                    src={item.creator.avatar_url}
                    alt={item.creator.full_name}
                    size="xs"
                    isVerified={item.creator.is_verified}
                  />
                  <span className="text-xs text-slate-200 font-medium">
                    @{item.creator.username}
                  </span>
                </Link>

                <div className="flex items-center gap-1 text-xs text-slate-200 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span className="tabular-nums">{item.likes.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Reels Theater Modal */}
      {theaterReelIndex !== null && (
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
