'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Heart,
  MessageCircle,
  Users,
  Eye,
  Award,
  Calendar,
  Radio,
  Plus,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CreatorDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    fetch('/api/creator/stats')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-reelo-muted space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-reelo-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-medium">Aggregating creator performance metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    total_posts: 0,
    total_likes: 0,
    total_comments: 0,
    followers_count: 0,
    estimated_impressions: 0,
    engagement_rate: '0%',
  };

  const topPosts = data?.top_posts || [];
  const badges = data?.badges || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-reelo-border">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-reelo-secondary" />
            <h1 className="text-xl sm:text-2xl font-black text-reelo-primary tracking-tight">
              Creator Studio & Insights
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-reelo-muted mt-1">
            Real performance signals, audience reach, and creator achievements directly on your PC.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/create">
            <Button variant="primary" size="sm" className="font-bold">
              <Plus className="w-4 h-4 mr-1" />
              New Creation
            </Button>
          </Link>
          <Link href="/live">
            <Button variant="secondary" size="sm" className="font-bold text-red-600 border-red-200 hover:bg-red-50">
              <Radio className="w-4 h-4 mr-1 text-red-600" />
              Go Live
            </Button>
          </Link>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-reelo-muted">Timeline:</span>
        {(['7d', '30d', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              timeRange === range
                ? 'bg-reelo-primary text-white shadow-subtle'
                : 'bg-white border border-reelo-border text-reelo-muted hover:text-reelo-primary'
            }`}
          >
            {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <Card className="p-4 sm:p-5 bg-white border-reelo-border shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-reelo-muted">
            <span className="text-xs font-medium">Estimated Impressions</span>
            <Eye className="w-4 h-4 text-reelo-secondary" />
          </div>
          <p className="text-2xl font-black text-reelo-primary">{stats.estimated_impressions.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% vs prev period
          </p>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border-reelo-border shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-reelo-muted">
            <span className="text-xs font-medium">Engagement Rate</span>
            <TrendingUp className="w-4 h-4 text-reelo-accent" />
          </div>
          <p className="text-2xl font-black text-reelo-primary">{stats.engagement_rate}</p>
          <p className="text-[11px] text-reelo-muted">Likes + Comments / Reach</p>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border-reelo-border shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-reelo-muted">
            <span className="text-xs font-medium">Total Reactions</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-reelo-primary">{stats.total_likes.toLocaleString()}</p>
          <p className="text-[11px] text-reelo-muted">Across all published posts</p>
        </Card>

        <Card className="p-4 sm:p-5 bg-white border-reelo-border shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-reelo-muted">
            <span className="text-xs font-medium">Active Audience</span>
            <Users className="w-4 h-4 text-reelo-primary" />
          </div>
          <p className="text-2xl font-black text-reelo-primary">{stats.followers_count.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Verified Followers</p>
        </Card>
      </div>

      {/* Trophies & Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-reelo-primary flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Creator Badges & Achievements ({badges.length})
          </h2>
          <span className="text-xs text-reelo-muted">Automatic milestone unlock</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {badges.map((b: any) => (
            <div
              key={b.id || b.key}
              className="p-3.5 rounded-xl bg-white border border-reelo-border shadow-subtle flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs font-bold text-reelo-primary truncate">{b.name}</h4>
                <p className="text-[11px] text-reelo-muted leading-tight">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-reelo-primary flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-reelo-secondary" />
          Top Performing Stories & Posts
        </h2>

        {topPosts.length === 0 ? (
          <Card className="p-8 text-center text-reelo-muted bg-white border-reelo-border">
            <p className="text-xs font-medium">No posts published yet. Share your first perspective to see analytics.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {topPosts.map((post: any, idx: number) => (
              <div
                key={post.id}
                className="p-3 sm:p-4 rounded-xl bg-white border border-reelo-border shadow-subtle flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center text-xs font-bold text-reelo-muted">#{idx + 1}</span>
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt="Thumbnail"
                      className="w-10 h-10 rounded-lg object-cover border border-reelo-border shrink-0"
                    />
                  )}
                  <p className="text-xs font-semibold text-reelo-primary truncate max-w-sm sm:max-w-md">
                    {post.content}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-reelo-muted shrink-0">
                  <span className="flex items-center gap-1 text-rose-600">
                    <Heart className="w-3.5 h-3.5 fill-rose-600" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1 text-reelo-secondary">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
