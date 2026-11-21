'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Video,
  Code,
  Tag,
  Users,
  Send,
  X,
  ArrowLeft,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { DEMO_CURRENT_USER, DEMO_COMMUNITIES } from '@/lib/constants/demo-data';
import { postService } from '@/services/postService';

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video' | 'reel'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['REELO']);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setMediaUrl(data.url);
        setMediaType(data.mediaType === 'video' ? 'video' : 'image');
      } else {
        alert(data.error || 'Failed to upload media file');
      }
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Preset sample media for easy 1-click testing in demo mode
  const sampleMediaPresets = [
    {
      label: 'Concept Architecture',
      url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop&q=80',
      type: 'image' as const,
    },
    {
      label: 'Synthesizer Lab',
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&auto=format&fit=crop&q=80',
      type: 'image' as const,
    },
    {
      label: 'Nordic Highlands',
      url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1000&auto=format&fit=crop&q=80',
      type: 'image' as const,
    },
  ];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/^#/, '');
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await postService.createPost({
        content,
        mediaUrls: mediaUrl ? [mediaUrl] : [],
        mediaType: mediaUrl ? mediaType : 'none',
        tags,
        communityId: selectedCommunity || null,
      });

      router.push('/home');
    } catch (err) {
      console.error('Failed to publish post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-reelo-bg py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back and Title Header */}
        <div className="flex items-center justify-between pb-4 border-b border-reelo-border">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold text-reelo-muted hover:text-reelo-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-reelo-primary">Create New Post</h1>
          </div>

          <div className="w-12" /> {/* Spacer */}
        </div>

        {/* Composer Card */}
        <Card className="p-6 bg-white border border-reelo-border shadow-subtle space-y-6">
          {/* Author Header & Destination Selector */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Avatar
                src={DEMO_CURRENT_USER.avatar_url}
                alt={DEMO_CURRENT_USER.full_name}
                size="md"
                isVerified={DEMO_CURRENT_USER.is_verified}
              />
              <div>
                <p className="text-xs font-bold text-reelo-primary">{DEMO_CURRENT_USER.full_name}</p>
                <p className="text-[10px] text-reelo-muted">Publishing to Public Universe</p>
              </div>
            </div>

            {/* Destination Community Dropdown */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-reelo-secondary" />
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="bg-white border border-reelo-border text-xs text-reelo-text rounded-xl px-3 py-1.5 outline-none focus:border-reelo-secondary focus:ring-1 focus:ring-reelo-secondary/20 shadow-xs"
              >
                <option value="">Public Feed</option>
                {DEMO_COMMUNITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    c/{c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are you building or exploring today? Share an insight, breakdown, or findings..."
              rows={4}
              className="w-full bg-white border border-reelo-border text-sm text-reelo-text placeholder:text-reelo-muted rounded-2xl p-4 outline-none focus:border-reelo-secondary focus:ring-2 focus:ring-reelo-secondary/20 resize-none leading-relaxed shadow-subtle transition-all"
            />
          </div>

          {/* Media Attachment Preview & Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-reelo-muted">
              <span className="font-semibold text-reelo-primary">Attach Media (URL or Preset)</span>
              {mediaUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setMediaUrl('');
                    setMediaType('none');
                  }}
                  className="text-reelo-danger hover:underline flex items-center gap-1 font-medium"
                >
                  <X className="w-3.5 h-3.5" /> Remove Media
                </button>
              )}
            </div>

            {mediaUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-reelo-border bg-reelo-surfaceMuted">
                <Image
                  src={mediaUrl}
                  alt="Attached preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-reelo-primary text-white text-xs font-semibold cursor-pointer hover:bg-reelo-primary-hover shadow-subtle transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading file...' : 'Choose File from PC'}</span>
                    <input
                      type="file"
                      accept="image/*,video/*,audio/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-reelo-muted">Supports photos, 9:16 reels & video clips</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-reelo-border" />
                  <span className="text-[10px] text-reelo-muted uppercase tracking-wider font-semibold">Or link URL</span>
                  <div className="h-px flex-1 bg-reelo-border" />
                </div>

                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    if (e.target.value) setMediaType('image');
                  }}
                  placeholder="Paste direct image or video URL (https://...)"
                  className="w-full bg-white border border-reelo-border text-xs text-reelo-text placeholder:text-reelo-muted rounded-xl px-3 py-2.5 outline-none focus:border-reelo-secondary focus:ring-1 focus:ring-reelo-secondary/20 shadow-xs"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-reelo-muted font-medium">Quick Test Presets:</span>
                  {sampleMediaPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setMediaUrl(preset.url);
                        setMediaType(preset.type);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-reelo-surfaceMuted border border-reelo-border text-reelo-text hover:border-reelo-primary hover:bg-white transition-colors"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tag Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-reelo-primary">
              Hashtags & Topics
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-reelo-surfaceMuted border border-reelo-border">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs bg-white text-reelo-primary border border-reelo-border font-semibold shadow-xs"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-reelo-danger"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag & press Enter..."
                className="bg-transparent text-xs text-reelo-text placeholder:text-reelo-muted outline-none flex-1 min-w-[140px] px-2 py-1"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-reelo-border">
            <button
              type="button"
              onClick={() => router.push('/home')}
              className="text-xs text-reelo-muted hover:text-reelo-primary font-medium"
            >
              Discard Draft
            </button>

            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={!content.trim() || isSubmitting}
              isLoading={isSubmitting}
              onClick={handleSubmit}
              className="px-6 rounded-xl font-bold"
            >
              <Send className="w-4 h-4 mr-1.5" />
              Publish Post
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
