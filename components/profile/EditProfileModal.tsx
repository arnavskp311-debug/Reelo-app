'use client';

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Profile } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EditProfileModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<Profile>) => Promise<any>;
}

export function EditProfileModal({ profile, isOpen, onClose, onSave }: EditProfileModalProps) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [bio, setBio] = useState(profile.bio || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [location, setLocation] = useState(profile.location || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        full_name: fullName,
        bio,
        website,
        location,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-reelo-primary/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-reelo-surface border border-reelo-border p-6 shadow-floating space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-reelo-border">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-reelo-text font-serif">Edit Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="text-reelo-muted hover:text-reelo-text p-1 rounded-lg hover:bg-reelo-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-reelo-text uppercase tracking-wider">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell other creators about your craft and passions..."
              className="w-full bg-reelo-surface border border-reelo-border text-reelo-text placeholder:text-reelo-subtle text-sm rounded-xl p-3 outline-none focus:border-reelo-primary transition-colors resize-none shadow-subtle"
            />
          </div>

          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, CA"
          />

          <Input
            label="Website or Portfolio"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourportfolio.com"
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-reelo-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving} className="font-bold">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
