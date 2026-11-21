'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DEMO_STORIES } from '@/lib/constants/demo-data';
import { Avatar } from '@/components/ui/Avatar';
import { StoryViewerModal } from '@/components/feed/StoryViewerModal';

export function StoryTray() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const handleOpenStory = (index: number) => {
    setSelectedStoryIndex(index);
  };

  const handleCloseStory = () => {
    setSelectedStoryIndex(null);
  };

  return (
    <>
      <div className="w-full overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-4 min-w-max">
          {DEMO_STORIES.map((story, index) => {
            if (story.isSelf) {
              return (
                <button
                  key={story.id}
                  onClick={() => handleOpenStory(index)}
                  className="flex flex-col items-center gap-1.5 group select-none active:scale-95 transition-transform"
                >
                  <div className="relative">
                    <Avatar
                      src={story.user.avatar_url}
                      alt={story.user.full_name}
                      size="lg"
                      className="group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white border-2 border-reelo-bg shadow-sm">
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium max-w-[64px] truncate">
                    Your Reel
                  </span>
                </button>
              );
            }

            return (
              <button
                key={story.id}
                onClick={() => handleOpenStory(index)}
                className="flex flex-col items-center gap-1.5 group select-none active:scale-95 transition-transform"
              >
                <Avatar
                  src={story.user.avatar_url}
                  alt={story.user.full_name}
                  size="lg"
                  hasStoryRing={story.hasUnseen}
                  className="group-hover:scale-105 transition-transform duration-150"
                />
                <span className="text-[11px] text-slate-300 font-medium max-w-[64px] truncate">
                  {story.user.username}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedStoryIndex !== null && (
        <StoryViewerModal
          isOpen={selectedStoryIndex !== null}
          initialGroupIndex={selectedStoryIndex}
          stories={DEMO_STORIES}
          onClose={handleCloseStory}
        />
      )}
    </>
  );
}
