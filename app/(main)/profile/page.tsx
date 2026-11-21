'use client';

import React, { useState, useEffect } from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs, ProfileTab } from '@/components/profile/ProfileTabs';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { PostCard } from '@/components/feed/PostCard';
import { DEMO_CURRENT_USER, DEMO_POSTS } from '@/lib/constants/demo-data';
import { Profile, PostWithAuthor } from '@/types';
import { userService } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import { Bookmark, FolderPlus, Plus, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CurrentUserProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>(user || DEMO_CURRENT_USER);
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState<PostWithAuthor[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [newColName, setNewColName] = useState('');
  const [showColModal, setShowColModal] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const fetchProfilePosts = () => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          const myPosts = data.posts.filter((p: any) => p.user_id === (user?.id || DEMO_CURRENT_USER.id));
          setUserPosts(myPosts.length > 0 ? myPosts : data.posts);
        }
      })
      .catch(() => {});
  };

  const fetchCollections = () => {
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => setCollections(data.collections || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchProfilePosts();
    fetchCollections();
  }, [user]);

  const handleSaveProfile = async (updated: Partial<Profile>) => {
    const res = await userService.updateProfile(updated);
    if (res.profile) {
      setProfile(res.profile);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newColName.trim(), is_private: true }),
      });
      if (res.ok) {
        setNewColName('');
        setShowColModal(false);
        fetchCollections();
      }
    } catch (err) {
      console.error('Error creating collection:', err);
    }
  };

  const getFilteredTabPosts = () => {
    if (activeTab === 'reels') {
      return userPosts.filter((p) => p.media_type === 'reel' || (p.media_urls && p.media_urls.length > 0));
    }
    if (activeTab === 'likes') {
      return userPosts.filter((p) => p.user_has_liked);
    }
    if (activeTab === 'saved') {
      return userPosts.filter((p) => p.user_has_bookmarked);
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

      {/* Saved Collections Shelf (when on 'saved' tab) */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-reelo-primary flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-reelo-secondary" />
              Private Collections ({collections.length})
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowColModal(true)}
              className="text-xs font-semibold"
            >
              <FolderPlus className="w-3.5 h-3.5 mr-1 text-reelo-secondary" />
              New Collection
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {collections.map((col) => (
              <Card
                key={col.id}
                className="p-3.5 bg-white border border-reelo-border shadow-subtle hover:border-reelo-secondary transition-all space-y-1.5 cursor-pointer"
              >
                <div className="flex items-center justify-between text-reelo-muted">
                  <span className="text-xs font-bold text-reelo-primary truncate">{col.name}</span>
                  <Lock className="w-3 h-3 text-reelo-muted" />
                </div>
                <p className="text-[11px] text-reelo-muted">{col.items_count} saved items</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Posts Content Grid / List */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-reelo-border text-reelo-muted text-xs">
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

      {/* New Collection Modal */}
      {showColModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-reelo-border shadow-card space-y-3.5">
            <h3 className="text-sm font-black text-reelo-primary">Create New Collection</h3>
            <form onSubmit={handleCreateCollection} className="space-y-3">
              <input
                type="text"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="e.g. Design Inspiration, Sound Stems..."
                className="w-full p-2.5 rounded-xl border border-reelo-border text-xs text-reelo-text outline-none focus:border-reelo-secondary"
                required
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowColModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Collection
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
