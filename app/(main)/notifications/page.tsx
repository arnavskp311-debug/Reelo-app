'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Heart,
  MessageCircle,
  Repeat2,
  UserPlus,
  CheckCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { DEMO_NOTIFICATIONS } from '@/lib/constants/demo-data';
import { formatTimeAgo } from '@/lib/utils/formatters';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'likes') return n.type === 'like';
    if (filter === 'comments') return n.type === 'comment';
    if (filter === 'follows') return n.type === 'follow';
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-reelo-secondary" />;
      case 'repost':
        return <Repeat2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-reelo-accent" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-reelo-muted" />;
    }
  };

  const getNotifMessage = (type: string) => {
    switch (type) {
      case 'like':
        return 'liked your procedural rendering breakdown';
      case 'comment':
        return 'commented on your REELO dev hub release';
      case 'repost':
        return 'shared your latest aurora photograph to their network';
      case 'follow':
        return 'started following your creative stream';
      default:
        return 'interacted with your content';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-reelo-border">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-reelo-secondary" />
            <h1 className="text-xl sm:text-2xl font-black text-reelo-primary tracking-tight">
              Activity & Notifications
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-reelo-muted mt-1">
            Stay updated with comments, reposts, and new community connections.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={markAllRead}
          className="self-start sm:self-auto text-xs rounded-lg font-semibold"
        >
          <CheckCheck className="w-3.5 h-3.5 mr-1 text-reelo-secondary" />
          Mark all as read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5">
        {(['all', 'likes', 'comments', 'follows'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-reelo-primary text-white shadow-subtle'
                : 'bg-white border border-reelo-border text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-reelo-border shadow-subtle text-reelo-muted text-xs">
            No notifications in this filter category.
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <Card
              key={notif.id}
              className={`flex items-center justify-between p-4 transition-all shadow-subtle ${
                !notif.is_read
                  ? 'bg-white border-reelo-border hover:border-reelo-borderHover'
                  : 'bg-reelo-surfaceMuted/40 border-reelo-border opacity-80'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <Avatar
                    src={notif.actor?.avatar_url}
                    alt={notif.actor?.full_name || 'User'}
                    size="md"
                    isVerified={notif.actor?.is_verified}
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white border border-reelo-border shadow-xs">
                    {getNotifIcon(notif.type)}
                  </div>
                </div>

                <div className="text-xs sm:text-sm">
                  <p className="text-reelo-text">
                    <Link
                      href={`/profile/${notif.actor?.username || ''}`}
                      className="font-bold text-reelo-primary hover:text-reelo-secondary mr-1"
                    >
                      {notif.actor?.full_name}
                    </Link>
                    <span className="text-reelo-muted">{getNotifMessage(notif.type)}</span>
                  </p>
                  <span className="text-[11px] text-reelo-muted font-medium mt-0.5 block">
                    {formatTimeAgo(notif.created_at)}
                  </span>
                </div>
              </div>

              {!notif.is_read && (
                <div className="w-2 h-2 rounded-full bg-reelo-accent" />
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
