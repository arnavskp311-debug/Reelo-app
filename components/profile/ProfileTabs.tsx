'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Video, Heart, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ProfileTab = 'posts' | 'reels' | 'likes' | 'saved';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: 'posts' as ProfileTab, label: 'Posts', icon: Grid },
    { id: 'reels' as ProfileTab, label: 'Reels & Media', icon: Video },
    { id: 'likes' as ProfileTab, label: 'Likes', icon: Heart },
    { id: 'saved' as ProfileTab, label: 'Saved', icon: Bookmark },
  ];

  return (
    <div className="flex items-center justify-around border-b border-reelo-border mt-6 relative">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-colors select-none',
              isActive
                ? 'text-reelo-primary font-bold'
                : 'text-reelo-muted hover:text-reelo-text'
            )}
          >
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeProfileTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-reelo-primary"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
