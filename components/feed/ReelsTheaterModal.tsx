'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music2,
  ChevronUp,
  ChevronDown,
  Check,
  Send,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Profile } from '@/types';

export interface ReelData {
  id: string;
  title: string;
  mediaUrl: string;
  audioTitle?: string;
  creator: Profile;
  likes: number;
  comments: number;
  tags?: string[];
}

interface ReelsTheaterModalProps {
  isOpen: boolean;
  initialIndex?: number;
  reels: ReelData[];
  onClose: () => void;
}

export function ReelsTheaterModal({
  isOpen,
  initialIndex = 0,
  reels,
  onClose,
}: ReelsTheaterModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [isBookmarked, setIsBookmarked] = useState<Record<string, boolean>>({});
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [progress, setProgress] = useState(0);

  const [reelComments, setReelComments] = useState<
    Record<string, { id: string; user: string; text: string; time: string }[]>
  >({});

  const lastTapRef = useRef<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [isOpen, initialIndex]);

  const currentReel = reels[currentIndex] || reels[0];

  // Initialize like counts if needed
  useEffect(() => {
    if (currentReel && likeCounts[currentReel.id] === undefined) {
      setLikeCounts((prev) => ({ ...prev, [currentReel.id]: currentReel.likes }));
    }
  }, [currentReel, likeCounts]);

  // Reel video playback progress simulation
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    setProgress(0);
    const duration = 12000; // 12 seconds per reel loop
    const step = 60;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (step / duration) * 100;
      });
    }, step);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isOpen, isPlaying, currentIndex]);

  // Keyboard navigation (ArrowUp, ArrowDown, Space, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
      if (e.key === 'm' || e.key === 'M') {
        setIsMuted((m) => !m);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, reels.length, onClose]);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowComments(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowComments(false);
    }
  };

  const handleToggleLike = () => {
    if (!currentReel) return;
    const currentLiked = !!isLiked[currentReel.id];
    setIsLiked((prev) => ({ ...prev, [currentReel.id]: !currentLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [currentReel.id]: (prev[currentReel.id] ?? currentReel.likes) + (currentLiked ? -1 : 1),
    }));
  };

  const handleMediaTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap heart burst
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
      if (!isLiked[currentReel.id]) {
        handleToggleLike();
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
    lastTapRef.current = now;
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentReel) return;

    setReelComments((prev) => ({
      ...prev,
      [currentReel.id]: [
        ...(prev[currentReel.id] || []),
        {
          id: `rc_${Date.now()}`,
          user: 'Alex Rivera',
          text: commentText.trim(),
          time: 'Just now',
        },
      ],
    }));
    setCommentText('');
  };

  if (!isOpen || !currentReel) return null;

  const currentReelLiked = !!isLiked[currentReel.id];
  const currentLikes = likeCounts[currentReel.id] ?? currentReel.likes;
  const currentComments = (reelComments[currentReel.id] || []).length + currentReel.comments;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center select-none"
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md active:scale-95 transition-all"
          aria-label="Close reels player"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Up / Down Navigation Controls for Desktop */}
        <div className="hidden lg:flex flex-col items-center gap-4 absolute right-10 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all shadow-lg"
            title="Previous reel"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className="text-xs font-mono text-white/70">
            {currentIndex + 1} / {reels.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === reels.length - 1}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all shadow-lg"
            title="Next reel"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Toast Copied Notice */}
        <AnimatePresence>
          {showCopiedToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full border border-slate-700 shadow-xl backdrop-blur-md flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Reel link copied to clipboard</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Reel Container (9:16 vertical ratio) */}
        <div className="relative w-full h-full md:h-[92vh] md:max-w-[430px] md:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Ambient Video Glow */}
          <div
            className="absolute inset-0 opacity-30 blur-3xl scale-125 pointer-events-none"
            style={{
              backgroundImage: `url(${currentReel.mediaUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Reel Media / Video Simulation with Tap Zone */}
          <div
            onClick={handleMediaTap}
            className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center bg-black"
          >
            <Image
              src={currentReel.mediaUrl}
              alt={currentReel.title}
              fill
              className="object-cover transition-transform duration-300"
              priority
            />

            {/* Play/Pause Center Overlay */}
            {!isPlaying && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white pointer-events-none z-20"
              >
                <Play className="w-8 h-8 fill-white ml-1" />
              </motion.div>
            )}

            {/* Double Tap Heart Burst */}
            <AnimatePresence>
              {showHeartBurst && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.4, 1.1], opacity: [0, 1, 0] }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  className="absolute pointer-events-none z-30"
                >
                  <Heart className="w-28 h-28 fill-rose-500 text-rose-500 drop-shadow-[0_0_24px_rgba(244,63,94,0.9)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Top Controls Bar */}
          <div className="relative z-30 p-4 pt-5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
              Reels
            </span>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md active:scale-95 transition-all"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Right Floating Engagement Bar */}
          <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 text-white">
            {/* Creator Avatar with Follow Badge */}
            <div className="relative">
              <Avatar
                src={currentReel.creator.avatar_url}
                alt={currentReel.creator.full_name}
                size="md"
                isVerified={currentReel.creator.is_verified}
                className="ring-2 ring-blue-500"
              />
            </div>

            {/* Like Action */}
            <button
              onClick={handleToggleLike}
              className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
              title="Like reel"
            >
              <div
                className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                  currentReelLiked ? 'bg-rose-500/30 text-rose-500' : 'bg-black/40 text-white'
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${currentReelLiked ? 'fill-rose-500' : 'group-hover:scale-110'}`}
                />
              </div>
              <span className="text-[11px] font-semibold tabular-nums drop-shadow">
                {currentLikes.toLocaleString()}
              </span>
            </button>

            {/* Comments Action */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
              title="Comments"
            >
              <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors">
                <MessageCircle className="w-6 h-6 group-hover:scale-110" />
              </div>
              <span className="text-[11px] font-semibold tabular-nums drop-shadow">
                {currentComments.toLocaleString()}
              </span>
            </button>

            {/* Bookmark Action */}
            <button
              onClick={() =>
                setIsBookmarked((prev) => ({ ...prev, [currentReel.id]: !prev[currentReel.id] }))
              }
              className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
              title="Save reel"
            >
              <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors">
                <Bookmark
                  className={`w-6 h-6 ${
                    isBookmarked[currentReel.id] ? 'fill-white text-white' : ''
                  }`}
                />
              </div>
            </button>

            {/* Share Action */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
              title="Share reel"
            >
              <div className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors">
                <Share2 className="w-6 h-6 group-hover:scale-110" />
              </div>
            </button>
          </div>

          {/* Bottom Info & Audio Marquee */}
          <div className="relative z-30 p-4 pb-5 bg-gradient-to-t from-black/95 via-black/75 to-transparent space-y-2.5 max-w-[80%]">
            {/* Creator details */}
            <Link
              href={`/profile/${currentReel.creator.username}`}
              className="flex items-center gap-2 group w-fit"
            >
              <span className="text-sm font-bold text-white group-hover:underline drop-shadow">
                @{currentReel.creator.username}
              </span>
              {currentReel.creator.is_verified && (
                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold">
                  ✓
                </span>
              )}
            </Link>

            {/* Reel Caption */}
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed drop-shadow line-clamp-2">
              {currentReel.title}
            </p>

            {/* Tags */}
            {currentReel.tags && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {currentReel.tags.map((t) => (
                  <span key={t} className="text-xs text-blue-400 font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Audio attribution marquee */}
            <div className="flex items-center gap-2 text-[11px] text-white/80 pt-1">
              <Music2 className="w-3.5 h-3.5 flex-shrink-0 animate-spin text-blue-400" />
              <div className="overflow-hidden w-full whitespace-nowrap">
                <p className="truncate">
                  {currentReel.audioTitle || `Original Sound • ${currentReel.creator.full_name}`}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Playback Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30 pointer-events-none">
            <div
              className="h-full bg-blue-500 transition-all ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Expandable Slide-Up Comments Drawer */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 350 }}
                className="absolute inset-x-0 bottom-0 z-40 bg-slate-900/95 border-t border-slate-800 rounded-t-3xl p-4 max-h-[65%] flex flex-col backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Comments ({currentComments})
                  </h4>
                  <button
                    onClick={() => setShowComments(false)}
                    className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Comment List */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 py-3">
                  {(reelComments[currentReel.id] || []).length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No comments yet. Start the conversation!
                    </div>
                  ) : (
                    reelComments[currentReel.id].map((c) => (
                      <div key={c.id} className="text-xs space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-semibold text-white">{c.user}</span>
                          <span className="text-[10px] text-slate-500">{c.time}</span>
                        </div>
                        <p className="text-slate-300">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-40 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
