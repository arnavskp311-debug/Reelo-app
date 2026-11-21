'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FeedFilter } from '@/types';
import { Compass, Users, Video, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FeedTabsProps {
  activeTab: FeedFilter;
  onTabChange: (tab: FeedFilter) => void;
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  const tabs: { id: FeedFilter; label: string; icon: React.ReactNode }[] = [
    { id: 'for-you', label: 'For You', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'following', label: 'Following', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'reels', label: 'Media & Reels', icon: <Video className="w-3.5 h-3.5" /> },
    { id: 'trending', label: 'Trending', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-reelo-border pb-2 overflow-x-auto no-scrollbar relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors select-none whitespace-nowrap',
              isActive
                ? 'text-white font-semibold'
                : 'text-reelo-muted hover:text-reelo-text hover:bg-reelo-surfaceMuted'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeFeedTab"
                className="absolute inset-0 bg-reelo-primary rounded-lg shadow-subtle"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
