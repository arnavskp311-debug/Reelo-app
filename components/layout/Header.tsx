'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, MessageSquare, Database, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/navigation/BrandLogo';
import { Avatar } from '@/components/ui/Avatar';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-reelo-surface/90 backdrop-blur-md border-b border-reelo-border px-4 sm:px-6 py-3 flex items-center justify-between shadow-subtle">
      {/* Mobile / Tablet Logo */}
      <div className="flex items-center gap-3">
        <BrandLogo size="sm" className="lg:hidden" />
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-reelo-surfaceMuted text-reelo-text border border-reelo-border">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-[11px] text-reelo-primary font-semibold">Local PC Database (SQLite)</span>
          </span>
        </div>
      </div>

      {/* Quick Actions & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/moderation"
          className="p-2 text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-lg transition-colors relative"
          title="Moderation Center"
        >
          <ShieldCheck className="w-4 h-4 text-reelo-secondary" />
        </Link>

        <Link
          href="/messages"
          className="p-2 text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-lg transition-colors relative"
          aria-label="Messages"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-reelo-accent" />
        </Link>

        <Link
          href="/notifications"
          className="p-2 text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted rounded-lg transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-reelo-accent" />
        </Link>

        <Link href="/profile" className="pl-1">
          <Avatar
            src={DEMO_CURRENT_USER.avatar_url}
            alt={DEMO_CURRENT_USER.full_name}
            size="sm"
            isVerified={DEMO_CURRENT_USER.is_verified}
          />
        </Link>
      </div>
    </header>
  );
}
