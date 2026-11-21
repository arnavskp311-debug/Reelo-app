'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Upload, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { DEMO_STORIES, StoryGroup } from '@/lib/constants/demo-data';
import { Avatar } from '@/components/ui/Avatar';
import { StoryViewerModal } from '@/components/feed/StoryViewerModal';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export function StoryTray() {
  const { user } = useAuth();
  const [stories, setStories] = useState<StoryGroup[]>(DEMO_STORIES);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [textOverlay, setTextOverlay] = useState('');
  const [bgColor, setBgColor] = useState('#243746');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLiveStories = () => {
    fetch('/api/stories')
      .then((res) => res.json())
      .then((data) => {
        if (data.stories && data.stories.length > 0) {
          // Format live stories into StoryGroup structure
          const liveGroups: StoryGroup[] = data.stories.map((s: any, idx: number) => ({
            id: s.id,
            user: s.author,
            hasUnseen: !s.is_viewed,
            isSelf: user ? s.user_id === user.id : idx === 0,
            items: [
              {
                id: s.id,
                mediaUrl: s.media_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
                type: s.media_type || 'image',
                createdAt: 'Just now',
                caption: s.text_overlay || '',
              },
            ],
          }));

          // Merge live groups with demo groups
          setStories([...liveGroups, ...DEMO_STORIES.slice(1)]);
        }
      })
      .catch((err) => console.warn('Could not load live stories:', err));
  };

  useEffect(() => {
    fetchLiveStories();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setMediaUrl(data.url);
      } else {
        alert(data.error || 'Failed to upload story media');
      }
    } catch (err: any) {
      alert(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl && !textOverlay.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_url: mediaUrl,
          media_type: mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') ? 'video' : 'image',
          text_overlay: textOverlay.trim(),
          background_color: bgColor,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setMediaUrl('');
        setTextOverlay('');
        fetchLiveStories();
      }
    } catch (err) {
      console.error('Failed to post story:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-4 min-w-max">
          {/* Create / Self Story Trigger */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center gap-1.5 group select-none active:scale-95 transition-transform"
          >
            <div className="relative">
              <Avatar
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={user?.full_name || 'You'}
                size="lg"
                className="group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-reelo-secondary flex items-center justify-center text-white border-2 border-white shadow-sm">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] text-reelo-muted font-medium max-w-[64px] truncate">
              Add Story
            </span>
          </button>

          {/* Stories List */}
          {stories.map((story, index) => {
            return (
              <button
                key={`${story.id}-${index}`}
                onClick={() => setSelectedStoryIndex(index)}
                className="flex flex-col items-center gap-1.5 group select-none active:scale-95 transition-transform"
              >
                <Avatar
                  src={story.user.avatar_url}
                  alt={story.user.full_name}
                  size="lg"
                  hasStoryRing={story.hasUnseen}
                  className="group-hover:scale-105 transition-transform duration-150"
                />
                <span className="text-[11px] text-reelo-text font-medium max-w-[64px] truncate">
                  {story.user.username}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Story Viewer */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          isOpen={selectedStoryIndex !== null}
          initialGroupIndex={selectedStoryIndex}
          stories={stories}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-reelo-border shadow-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-reelo-border">
              <h3 className="text-sm font-black text-reelo-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-reelo-secondary" />
                Create 24-Hour Story
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-reelo-muted hover:text-reelo-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="space-y-3.5">
              {/* Media Preview or Color Box */}
              <div
                style={{ backgroundColor: bgColor }}
                className="relative aspect-[9/14] w-full rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-center border border-reelo-border shadow-inner"
              >
                {mediaUrl ? (
                  <img src={mediaUrl} alt="Story Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="space-y-2 z-10">
                    <ImageIcon className="w-8 h-8 text-white/60 mx-auto" />
                    <p className="text-xs text-white/80 font-medium">Upload photo or enter caption</p>
                  </div>
                )}

                {textOverlay && (
                  <div className="z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-bold text-xs max-w-[85%] break-words">
                    {textOverlay}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-reelo-surfaceMuted hover:bg-reelo-border border border-reelo-border text-reelo-primary text-xs font-semibold cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Choose Media from PC'}</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Caption Overlay */}
              <input
                type="text"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                placeholder="Add text sticker / caption..."
                className="w-full bg-white border border-reelo-border text-xs text-reelo-text placeholder:text-reelo-muted rounded-xl px-3 py-2 outline-none focus:border-reelo-secondary"
              />

              {/* Color Presets */}
              <div className="flex items-center justify-between text-xs text-reelo-muted">
                <span>Theme:</span>
                <div className="flex items-center gap-1.5">
                  {['#243746', '#4C7A78', '#C87952', '#0f172a', '#e11d48'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBgColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full border-2 transition-transform ${
                        bgColor === c ? 'scale-110 border-white shadow-sm' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting || (!mediaUrl && !textOverlay)}>
                  {isSubmitting ? 'Posting...' : 'Share to Story'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
