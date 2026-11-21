'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, Users, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/home', icon: Home },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Create', href: '/create', icon: Plus, isCreate: true },
    { label: 'Hubs', href: '/communities', icon: Users },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-reelo-surface/95 backdrop-blur-lg border-t border-reelo-border px-4 py-2 select-none shadow-floating">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isCreate) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center -mt-6 w-11 h-11 rounded-full bg-reelo-primary text-white border-4 border-reelo-surface shadow-subtle transition-transform active:scale-95"
                aria-label="Create Post"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 text-xs font-medium transition-colors',
                isActive ? 'text-reelo-primary font-bold' : 'text-reelo-muted hover:text-reelo-text'
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
