'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Send, ChevronLeft, ChevronRight, Check, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { StoryGroup, StoryItem } from '@/lib/constants/demo-data';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
}

interface StoryViewerModalProps {
  isOpen: boolean;
  initialGroupIndex?: number;
  stories: StoryGroup[];
  onClose: () => void;
}

const STORY_DURATION = 5000; // 5 seconds per story

export function StoryViewerModal({
  isOpen,
  initialGroupIndex = 0,
  stories,
  onClose,
}: StoryViewerModalProps) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  // Sync initial index
  useEffect(() => {
    if (isOpen) {
      setGroupIndex(initialGroupIndex);
      setItemIndex(0);
      setProgress(0);
      setHasLiked(false);
      elapsedBeforePauseRef.current = 0;
    }
  }, [isOpen, initialGroupIndex]);

  const currentGroup = stories[groupIndex] || stories[0];
  const items = currentGroup?.items || [];
  const currentItem: StoryItem | undefined = items[itemIndex] || items[0];

  const handleNext = useCallback(() => {
    if (!currentGroup) return;
    if (itemIndex < items.length - 1) {
      setItemIndex((prev) => prev + 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
    } else if (groupIndex < stories.length - 1) {
      setGroupIndex((prev) => prev + 1);
      setItemIndex(0);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
    } else {
      onClose();
    }
  }, [currentGroup, itemIndex, items.length, groupIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
    } else if (groupIndex > 0) {
      const prevGroup = stories[groupIndex - 1];
      setGroupIndex((prev) => prev - 1);
      setItemIndex((prevGroup?.items?.length || 1) - 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
    }
  }, [itemIndex, groupIndex, stories]);

  // Story Timer
  useEffect(() => {
    if (!isOpen || isPaused || !currentItem) return;

    const intervalStep = 50; // update every 50ms
    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(currentProgress);

      if (elapsed >= STORY_DURATION) {
        clearInterval(progressIntervalRef.current!);
        handleNext();
      }
    }, intervalStep);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isOpen, isPaused, itemIndex, groupIndex, currentItem, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  const handlePauseHold = () => {
    elapsedBeforePauseRef.current = (progress / 100) * STORY_DURATION;
    setIsPaused(true);
  };

  const handleResumeRelease = () => {
    setIsPaused(false);
  };

  const spawnReaction = (emoji: string) => {
    const newReaction: FloatingReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 35 + Math.random() * 30, // random x percentage between 35% and 65%
    };
    setFloatingReactions((prev) => [...prev, newReaction]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 1800);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    spawnReaction('💬');
    setReplyText('');
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  if (!isOpen || !currentGroup || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center select-none"
      >
        {/* Navigation Arrows for Desktop */}
        {groupIndex > 0 || itemIndex > 0 ? (
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white backdrop-blur-md transition-all active:scale-90 z-20"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : null}

        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center text-white backdrop-blur-md transition-all active:scale-90 z-20"
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Story Container (Phone Ratio 9:16) */}
        <div
          className="relative w-full h-full md:h-[92vh] md:max-w-[420px] md:rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-slate-800/80"
          onMouseDown={handlePauseHold}
          onMouseUp={handleResumeRelease}
          onTouchStart={handlePauseHold}
          onTouchEnd={handleResumeRelease}
        >
          {/* Progress Indicators */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5 pointer-events-none">
            {items.map((item, idx) => {
              let fillPercent = 0;
              if (idx < itemIndex) fillPercent = 100;
              else if (idx === itemIndex) fillPercent = progress;

              return (
                <div
                  key={item.id}
                  className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-xs"
                >
                  <div
                    className="h-full bg-white transition-all ease-linear"
                    style={{
                      width: `${fillPercent}%`,
                      transitionDuration: idx === itemIndex ? '50ms' : '0ms',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Top Header */}
          <div className="relative z-30 pt-7 px-4 pb-3 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-2.5">
              <Avatar
                src={currentGroup.user.avatar_url}
                alt={currentGroup.user.full_name}
                size="sm"
                className="ring-2 ring-blue-500 ring-offset-1 ring-offset-black"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-xs font-semibold leading-none drop-shadow">
                    {currentGroup.user.username}
                  </span>
                  {currentGroup.user.is_verified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold">
                      ✓
                    </span>
                  )}
                  <span className="text-white/60 text-[11px] leading-none">
                    • {currentItem.timeAgo}
                  </span>
                </div>
                <span className="text-white/70 text-[11px] truncate max-w-[140px]">
                  {currentGroup.user.full_name}
                </span>
              </div>

              {!currentGroup.isSelf && (
                <Button
                  size="sm"
                  variant={isFollowing ? 'secondary' : 'primary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFollowing(!isFollowing);
                  }}
                  className="ml-1 h-6 px-2.5 text-[11px] rounded-full"
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 text-white/90">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Left / Right Tap Zones */}
          <div className="absolute inset-0 z-20 flex">
            <div
              className="w-1/3 h-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              title="Previous story"
            />
            <div className="w-1/3 h-full" />
            <div
              className="w-1/3 h-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              title="Next story"
            />
          </div>

          {/* Story Visual Media */}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            {/* Ambient Background Glow */}
            <div
              className="absolute inset-0 opacity-40 blur-3xl scale-125"
              style={{
                backgroundImage: `url(${currentItem.mediaUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Main Visual */}
            <img
              src={currentItem.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover relative z-10 transition-transform duration-300"
            />
          </div>

          {/* Floating Emoji Reactions */}
          <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
            <AnimatePresence>
              {floatingReactions.map((reaction) => (
                <motion.div
                  key={reaction.id}
                  initial={{ opacity: 0, y: '80%', x: `${reaction.x}%`, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: '20%',
                    scale: [0.5, 1.5, 1.2, 0.8],
                    rotate: [-10, 10, -5, 5],
                  }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                  className="absolute text-4xl select-none"
                >
                  {reaction.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Toast feedback */}
          <AnimatePresence>
            {showCopiedToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 text-white text-xs px-3.5 py-1.5 rounded-full border border-slate-700 shadow-lg backdrop-blur-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link copied to clipboard</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Caption & Engagement Dock */}
          <div className="relative z-30 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-3">
            {/* Story Caption */}
            {currentItem.caption && (
              <p className="text-white text-sm font-medium leading-snug drop-shadow-md">
                {currentItem.caption}
              </p>
            )}

            {/* Quick Reactions Bar */}
            <div className="flex items-center justify-between px-1">
              {['🔥', '❤️', '👏', '🚀', '🤯'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    spawnReaction(emoji);
                  }}
                  className="text-2xl p-1 hover:scale-125 active:scale-95 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Reply Input & Like */}
            <div className="flex items-center gap-2">
              <form
                onSubmit={handleSendReply}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center bg-white/10 hover:bg-white/15 focus-within:bg-white/20 rounded-full border border-white/20 px-3.5 py-1.5 backdrop-blur-md transition-all"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${currentGroup.user.username}...`}
                  className="flex-1 bg-transparent text-white text-xs placeholder:text-white/50 focus:outline-none"
                />
                {replyText.trim() && (
                  <button
                    type="submit"
                    className="ml-1 text-blue-400 hover:text-blue-300 font-semibold text-xs active:scale-90 transition-transform"
                  >
                    Send
                  </button>
                )}
              </form>

              {/* Like Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setHasLiked(!hasLiked);
                  if (!hasLiked) spawnReaction('❤️');
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md active:scale-90 transition-all"
                title="Like story"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    hasLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                  }`}
                />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyLink();
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md active:scale-90 transition-all"
                title="Share story link"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
