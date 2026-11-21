'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit3,
  UserPlus,
  Check,
  Share2,
  ShieldAlert,
  UserX,
  MoreHorizontal,
} from 'lucide-react';
import { Profile } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ReportModal } from '@/components/moderation/ReportModal';
import { BlockModal } from '@/components/moderation/BlockModal';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { userService } from '@/services/userService';

interface ProfileHeaderProps {
  profile: Profile;
  isSelf?: boolean;
  onEditProfile?: () => void;
}

export function ProfileHeader({ profile, isSelf = false, onEditProfile }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const followersTarget = profile.followers_count + (isFollowing ? 1 : 0);
  const animatedFollowers = useAnimatedNumber(followersTarget);
  const animatedPosts = useAnimatedNumber(profile.posts_count);
  const animatedFollowing = useAnimatedNumber(profile.following_count);

  const handleToggleFollow = async () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    await userService.toggleFollow(profile.username);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  return (
    <>
      <div className="w-full rounded-2xl overflow-hidden bg-white border border-reelo-border shadow-subtle relative">
        {/* Toast */}
        <AnimatePresence>
          {showCopiedToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 z-40 bg-reelo-primary text-white text-xs px-3.5 py-1.5 rounded-full border border-reelo-primary/20 shadow-floating flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Profile link copied</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Banner */}
        <div className="relative w-full h-36 sm:h-52 bg-gradient-to-r from-reelo-primary/10 via-reelo-surfaceMuted to-reelo-secondary/15">
          {profile.banner_url ? (
            <Image
              src={profile.banner_url}
              alt={`${profile.full_name}'s banner`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-reelo-surfaceMuted" />
          )}
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Floating Avatar & Header Actions */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-16 mb-4">
            <Avatar
              src={profile.avatar_url}
              alt={profile.full_name}
              size="xl"
              isVerified={profile.is_verified}
              className="border-4 border-white rounded-full shadow-subtle"
            />

            <div className="flex items-center gap-2 pt-2">
              {isSelf ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onEditProfile}
                  className="rounded-lg text-xs sm:text-sm font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={handleToggleFollow}
                  className="rounded-lg text-xs sm:text-sm font-bold"
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-reelo-muted" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      Follow
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl"
                onClick={handleShare}
                aria-label="Share Profile"
              >
                <Share2 className="w-4 h-4 text-reelo-muted" />
              </Button>

              {!isSelf && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    aria-label="More user options"
                  >
                    <MoreHorizontal className="w-4 h-4 text-reelo-muted" />
                  </Button>

                  <AnimatePresence>
                    {showMoreMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-11 z-30 w-44 bg-white border border-reelo-border rounded-xl shadow-floating py-1 text-xs select-none"
                      >
                        <button
                          onClick={() => {
                            setShowMoreMenu(false);
                            setShowReportModal(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-reelo-danger hover:bg-rose-50 transition-colors text-left font-medium"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Report Account</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowMoreMenu(false);
                            setShowBlockModal(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-reelo-danger hover:bg-rose-50 transition-colors text-left border-t border-reelo-border font-medium"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Block User</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Name and Handle */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-reelo-primary tracking-tight">
                {profile.full_name}
              </h1>
            </div>
            <p className="text-sm text-reelo-muted font-medium">@{profile.username}</p>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-reelo-text leading-relaxed max-w-2xl mb-4">
              {profile.bio}
            </p>
          )}

          {/* Metadata info: Website, Location, Joined */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-reelo-muted mb-5">
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-reelo-secondary" />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-reelo-secondary" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-reelo-secondary font-medium hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-reelo-muted" />
              <span>
                Joined{' '}
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Stats Row with Tabular Nums & Animation */}
          <div className="flex items-center gap-6 pt-4 border-t border-reelo-border text-sm">
            <div>
              <span className="font-bold text-reelo-primary mr-1.5 tabular-nums">
                {animatedPosts.toLocaleString()}
              </span>
              <span className="text-reelo-muted">Posts</span>
            </div>

            <div>
              <span className="font-bold text-reelo-primary mr-1.5 tabular-nums">
                {animatedFollowers.toLocaleString()}
              </span>
              <span className="text-reelo-muted">Followers</span>
            </div>

            <div>
              <span className="font-bold text-reelo-primary mr-1.5 tabular-nums">
                {animatedFollowing.toLocaleString()}
              </span>
              <span className="text-reelo-muted">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          targetType="user"
          targetId={profile.id}
          targetTitle={`@${profile.username} (${profile.full_name})`}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <BlockModal
          isOpen={showBlockModal}
          userId={profile.id}
          username={profile.username}
          onClose={() => setShowBlockModal(false)}
        />
      )}
    </>
  );
}
