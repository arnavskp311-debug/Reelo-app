'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Compass,
  Users,
  MessageSquare,
  Bell,
  User,
  Plus,
  Settings,
  ShieldCheck,
  LogOut,
  Bookmark,
} from 'lucide-react';
import { MAIN_NAV_ITEMS } from '@/lib/constants/navigation';
import { BrandLogo } from './BrandLogo';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/hooks/useAuth';

const iconMap: Record<string, any> = {
  Home,
  Compass,
  Users,
  MessageSquare,
  Bell,
  User,
  PlusSquare: Plus,
  Sparkles: Compass,
  Bookmark,
  Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 border-r border-reelo-border bg-reelo-surface px-5 py-6 justify-between select-none z-30 shadow-subtle">
      {/* Top Branding & Main Navigation */}
      <div className="space-y-6">
        <div className="px-2">
          <BrandLogo size="md" showTagline />
        </div>

        <nav className="space-y-1">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.iconName] || Home;
            const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 group',
                  isActive
                    ? 'text-reelo-primary bg-reelo-surfaceMuted font-bold border-l-2 border-reelo-primary'
                    : 'text-reelo-muted hover:text-reelo-text hover:bg-reelo-surfaceMuted/60 font-medium'
                )}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform duration-150',
                      isActive ? 'text-reelo-primary' : 'text-reelo-muted group-hover:text-reelo-text'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1.5 text-[10px] font-bold text-white bg-reelo-accent rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Phase 1 Moderation Queue link */}
          <Link
            href="/moderation"
            className={cn(
              'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 group',
              pathname.startsWith('/moderation')
                ? 'text-reelo-primary bg-reelo-surfaceMuted font-bold border-l-2 border-reelo-primary'
                : 'text-reelo-muted hover:text-reelo-text hover:bg-reelo-surfaceMuted/60 font-medium'
            )}
          >
            <div className="flex items-center gap-3.5">
              <ShieldCheck className="w-4 h-4 text-reelo-secondary group-hover:text-reelo-primary" />
              <span>Moderation</span>
            </div>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-reelo-secondary/15 text-reelo-secondary">
              Admin
            </span>
          </Link>
        </nav>

        {/* Quick Create Action */}
        <div className="pt-2 px-1">
          <Link
            href="/create"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-reelo-primary hover:bg-reelo-primary-hover transition-colors shadow-subtle active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      {/* User Footer Profile Pill & Sign Out */}
      <div className="pt-4 border-t border-reelo-border space-y-2">
        {user ? (
          <>
            <Link
              href="/profile"
              className="flex items-center justify-between p-2 rounded-xl hover:bg-reelo-surfaceMuted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.full_name}
                  size="sm"
                  isVerified={user.is_verified}
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-reelo-text group-hover:text-reelo-primary truncate max-w-[110px]">
                    {user.full_name}
                  </p>
                  <p className="text-[11px] text-reelo-muted truncate max-w-[110px]">
                    @{user.username}
                  </p>
                </div>
              </div>
              <Settings className="w-4 h-4 text-reelo-muted group-hover:text-reelo-text transition-colors" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium text-reelo-muted hover:text-reelo-danger hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out of REELO"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold text-reelo-primary bg-reelo-surfaceMuted hover:bg-reelo-border rounded-lg transition-colors"
          >
            <span>Sign In to REELO</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
