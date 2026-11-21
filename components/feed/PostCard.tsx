'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
  MoreHorizontal,
  Send,
  Pin,
  Check,
  ShieldAlert,
  UserX,
  Copy,
} from 'lucide-react';
import { PostWithAuthor } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { TiltCard } from '@/components/ui/TiltCard';
import { AudioWaveformPlayer } from '@/components/feed/AudioWaveformPlayer';
import { ReportModal } from '@/components/moderation/ReportModal';
import { BlockModal } from '@/components/moderation/BlockModal';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { formatTimeAgo } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

interface PostCardProps {
  post: PostWithAuthor;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onPostHidden?: (postId: string) => void;
}

export function PostCard({ post, onLike, onBookmark, onPostHidden }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.user_has_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isBookmarked, setIsBookmarked] = useState(post.user_has_bookmarked || false);
  const [isReposted, setIsReposted] = useState(post.user_has_reposted || false);
  const [repostsCount, setRepostsCount] = useState(post.reposts_count);

  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const lastTapRef = useRef<number>(0);

  const [comments, setComments] = useState<
    { id: string; authorName: string; handle: string; text: string; timeAgo: string }[]
  >([
    {
      id: 'c1',
      authorName: 'Elena Rostova',
      handle: 'elena_vfx',
      text: 'Insane detail and lighting composition! Absolutely loving this aesthetic.',
      timeAgo: '15m ago',
    },
  ]);

  const animatedLikes = useAnimatedNumber(likesCount);
  const animatedReposts = useAnimatedNumber(repostsCount);

  if (isDismissed) return null;

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
    onLike?.(post.id);
  };

  const handleMediaDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);

      if (!isLiked) {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
        onLike?.(post.id);
      }
    }
    lastTapRef.current = now;
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post.id);
  };

  const handleToggleRepost = () => {
    if (isReposted) {
      setIsReposted(false);
      setRepostsCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsReposted(true);
      setRepostsCount((prev) => prev + 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        authorName: 'Alex Rivera',
        handle: 'alexrivera',
        text: newComment.trim(),
        timeAgo: 'just now',
      },
    ]);
    setNewComment('');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  const isAudioPost =
    post.tags?.some((t) =>
      ['modularsynth', 'electronicmusic', 'sounddesign', 'audio', 'music'].includes(
        t.toLowerCase()
      )
    ) || post.id === 'post_03';

  return (
    <>
      <Card className="p-4 sm:p-5 space-y-3.5 bg-white border border-reelo-border hover:border-reelo-borderHover transition-all relative overflow-visible shadow-subtle">
        {/* Toast Feedback */}
        <AnimatePresence>
          {showCopiedToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 right-4 z-20 bg-reelo-primary text-white text-xs px-3 py-1 rounded-full border border-reelo-primary/20 shadow-subtle flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Link copied!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pinned Indicator */}
        {post.is_pinned && (
          <div className="flex items-center gap-1.5 text-xs text-reelo-secondary font-semibold pb-2 border-b border-reelo-border">
            <Pin className="w-3.5 h-3.5" />
            <span>Pinned Post</span>
          </div>
        )}

        {/* Post Header */}
        <div className="flex items-start justify-between">
          <Link
            href={`/profile/${post.author.username}`}
            className="flex items-center gap-3 group"
          >
            <Avatar
              src={post.author.avatar_url}
              alt={post.author.full_name}
              size="md"
              isVerified={post.author.is_verified}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-reelo-primary group-hover:text-reelo-secondary transition-colors">
                  {post.author.full_name}
                </span>
                <span className="text-xs text-reelo-muted font-normal">
                  @{post.author.username}
                </span>
              </div>
              <span className="text-[11px] text-reelo-muted">
                {formatTimeAgo(post.created_at)}
              </span>
            </div>
          </Link>

          {/* Options Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="text-reelo-muted hover:text-reelo-text p-1.5 rounded-lg hover:bg-reelo-surfaceMuted transition-colors"
              aria-label="Post options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Options Dropdown Menu */}
            <AnimatePresence>
              {showOptionsMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-8 z-30 w-48 bg-white border border-reelo-border rounded-xl shadow-floating py-1 text-xs select-none"
                >
                  <button
                    onClick={() => {
                      handleShare();
                      setShowOptionsMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-reelo-text hover:bg-reelo-surfaceMuted transition-colors text-left"
                  >
                    <Copy className="w-3.5 h-3.5 text-reelo-muted" />
                    <span>Copy Link</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowOptionsMenu(false);
                      setShowReportModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-reelo-danger hover:bg-rose-50 transition-colors text-left font-medium"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Report Post</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowOptionsMenu(false);
                      setShowBlockModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-reelo-danger hover:bg-rose-50 transition-colors text-left border-t border-reelo-border font-medium"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Block @{post.author.username}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Post Text Content */}
        <div className="text-sm text-reelo-text leading-relaxed space-y-2">
          <p className="whitespace-pre-line">{post.content}</p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/explore?q=${encodeURIComponent(tag)}`}
                  className="text-xs text-reelo-secondary hover:text-reelo-primary font-medium hover:underline transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Audio Waveform Player for Audio Posts */}
        {isAudioPost && (
          <div className="pt-1">
            <AudioWaveformPlayer
              title={post.content.slice(0, 42) + '...'}
              artist={post.author.full_name}
              duration="1:24"
            />
          </div>
        )}

        {/* Post Media Attachment: Video or Image with 3D Tilt & Double-Tap Heart Burst */}
        {post.media_urls && post.media_urls.length > 0 && (
          post.media_type === 'video' || post.media_type === 'reel' || post.media_urls[0].match(/\.(mp4|webm|mov)$/i) ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-reelo-border bg-black shadow-subtle">
              <video
                src={post.media_urls[0]}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <TiltCard
              maxTilt={4}
              scale={1.01}
              className="relative w-full aspect-video sm:aspect-[16/10] rounded-xl overflow-hidden border border-reelo-border bg-reelo-surfaceMuted cursor-pointer select-none"
              onClick={handleMediaDoubleTap}
            >
              <Image
                src={post.media_urls[0]}
                alt="Post media"
                fill
                className="object-cover transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 640px"
              />

              {/* Double Tap Heart Burst Animation */}
              <AnimatePresence>
                {showHeartBurst && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                  >
                    <Heart className="w-24 h-24 fill-rose-500 text-rose-500 drop-shadow-md" />
                  </motion.div>
                )}
              </AnimatePresence>
            </TiltCard>
          )
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-reelo-border text-reelo-muted text-xs sm:text-sm">
          {/* Like Button with animated counter */}
          <motion.button
            onClick={handleToggleLike}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors group select-none',
              isLiked ? 'text-rose-600 font-semibold' : ''
            )}
            aria-label="Like post"
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-transform group-active:scale-125',
                isLiked && 'fill-rose-500 text-rose-500'
              )}
            />
            <span className="font-medium tabular-nums">{animatedLikes.toLocaleString()}</span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            onClick={() => setShowComments(!showComments)}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-reelo-surfaceMuted hover:text-reelo-text transition-colors select-none',
              showComments && 'text-reelo-primary font-bold'
            )}
            aria-label="Comment on post"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium tabular-nums">
              {(post.comments_count + comments.length - 1).toLocaleString()}
            </span>
          </motion.button>

          {/* Repost Button */}
          <motion.button
            onClick={handleToggleRepost}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors select-none',
              isReposted && 'text-emerald-700 font-semibold'
            )}
            aria-label="Repost"
          >
            <Repeat2 className="w-4 h-4" />
            <span className="font-medium tabular-nums">{animatedReposts.toLocaleString()}</span>
          </motion.button>

          {/* Bookmark Button */}
          <motion.button
            onClick={handleToggleBookmark}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-reelo-surfaceMuted hover:text-reelo-text transition-colors select-none',
              isBookmarked ? 'text-reelo-accent font-semibold' : ''
            )}
            aria-label="Bookmark post"
          >
            <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-reelo-accent text-reelo-accent')} />
          </motion.button>

          {/* Share Button */}
          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.92 }}
            className="flex items-center py-1.5 px-2.5 rounded-lg hover:bg-reelo-surfaceMuted hover:text-reelo-text transition-colors select-none"
            aria-label="Share post"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Expandable Comments Drawer with AnimatePresence */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="pt-3 mt-2 border-t border-reelo-border space-y-3 overflow-hidden"
            >
              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-1">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-2.5 rounded-lg bg-reelo-surfaceMuted/70 border border-reelo-border text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-reelo-muted">
                      <span className="font-semibold text-reelo-text">
                        {comment.authorName}{' '}
                        <span className="text-[10px] text-reelo-muted font-normal">
                          @{comment.handle}
                        </span>
                      </span>
                      <span className="text-[10px] text-reelo-muted">{comment.timeAgo}</span>
                    </div>
                    <p className="text-reelo-text">{comment.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a thoughtful comment..."
                  className="flex-1 bg-white border border-reelo-border text-xs text-reelo-text placeholder:text-reelo-muted rounded-lg px-3 py-2 outline-none focus:border-reelo-secondary focus:ring-1 focus:ring-reelo-secondary/30 transition-all"
                />
                <motion.button
                  type="submit"
                  disabled={!newComment.trim()}
                  whileTap={{ scale: 0.94 }}
                  className="p-2 bg-reelo-primary hover:bg-reelo-primary-hover text-white font-bold rounded-lg disabled:opacity-40 transition-colors shadow-subtle"
                  aria-label="Submit comment"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          targetType="post"
          targetId={post.id}
          targetTitle={post.content.slice(0, 60)}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <BlockModal
          isOpen={showBlockModal}
          userId={post.author.id}
          username={post.author.username}
          onClose={() => setShowBlockModal(false)}
          onBlocked={() => {
            setIsDismissed(true);
            onPostHidden?.(post.id);
          }}
        />
      )}
    </>
  );
}
