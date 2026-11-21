'use client';

import React, { useState } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs, ProfileTab } from '@/components/profile/ProfileTabs';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { PostCard } from '@/components/feed/PostCard';
import { DEMO_CURRENT_USER, DEMO_POSTS } from '@/lib/constants/demo-data';
import { Profile, PostWithAuthor } from '@/types';
import { userService } from '@/services/userService';

export default function CurrentUserProfilePage() {
  const [profile, setProfile] = useState<Profile>(DEMO_CURRENT_USER);
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState<PostWithAuthor[]>(
    DEMO_POSTS.filter((p) => p.user_id === DEMO_CURRENT_USER.id || p.id === 'post_01')
  );

  const handleSaveProfile = async (updated: Partial<Profile>) => {
    const res = await userService.updateProfile(updated);
    if (res.profile) {
      setProfile(res.profile);
    }
  };

  const getFilteredTabPosts = () => {
    if (activeTab === 'reels') {
      return userPosts.filter((p) => p.media_type === 'reel' || p.media_urls.length > 0);
    }
    if (activeTab === 'likes') {
      return DEMO_POSTS.filter((p) => p.user_has_liked);
    }
    if (activeTab === 'saved') {
      return DEMO_POSTS.filter((p) => p.user_has_bookmarked);
    }
    return userPosts;
  };

  const filteredPosts = getFilteredTabPosts();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        isSelf={true}
        onEditProfile={() => setIsEditModalOpen(true)}
      />

      {/* Profile Tabs */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Posts Content Grid / List */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-reelo-card/40 rounded-2xl border border-reelo-border/50 text-slate-400 text-xs">
            No entries in {activeTab}.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileModal
        profile={profile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
