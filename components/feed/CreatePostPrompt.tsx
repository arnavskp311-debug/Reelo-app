'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Image, Video, Tag } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

interface CreatePostPromptProps {
  onPostCreated?: (content: string) => Promise<any>;
}

export function CreatePostPrompt({ onPostCreated }: CreatePostPromptProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onPostCreated) {
        await onPostCreated(content);
        setContent('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 sm:p-5 bg-white border-reelo-border shadow-subtle">
      <div className="flex items-start gap-3.5">
        <Avatar
          src={DEMO_CURRENT_USER.avatar_url}
          alt={DEMO_CURRENT_USER.full_name}
          size="md"
          isVerified={DEMO_CURRENT_USER.is_verified}
        />
        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an insight, breakdown, or perspective..."
            rows={2}
            className="w-full bg-transparent text-reelo-text placeholder:text-reelo-muted text-sm resize-none outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2.5 border-t border-reelo-border">
            <div className="flex items-center gap-1">
              <Link
                href="/create?type=media"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted transition-colors"
              >
                <Image className="w-4 h-4 text-reelo-secondary" />
                <span className="hidden sm:inline font-medium">Photo</span>
              </Link>

              <Link
                href="/create?type=reel"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted transition-colors"
              >
                <Video className="w-4 h-4 text-reelo-secondary" />
                <span className="hidden sm:inline font-medium">Video</span>
              </Link>

              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-reelo-muted hover:text-reelo-primary hover:bg-reelo-surfaceMuted transition-colors"
              >
                <Tag className="w-4 h-4 text-reelo-accent" />
                <span className="hidden sm:inline font-medium">Topic</span>
              </Link>
            </div>

            <Button
              size="sm"
              variant="primary"
              disabled={!content.trim() || isSubmitting}
              isLoading={isSubmitting}
              onClick={handleSubmit}
              className="px-4 py-1.5 text-xs font-bold rounded-lg"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
