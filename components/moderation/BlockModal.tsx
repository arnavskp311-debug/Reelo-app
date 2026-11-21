'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserX, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BlockModalProps {
  isOpen: boolean;
  username: string;
  userId: string;
  onClose: () => void;
  onBlocked?: () => void;
}

export function BlockModal({
  isOpen,
  username,
  userId,
  onClose,
  onBlocked,
}: BlockModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleBlock = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocked_id: userId,
          reason: 'User initiated block',
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onBlocked?.();
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to block user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-white border border-reelo-border rounded-2xl shadow-floating p-6 space-y-4"
        >
          {isSuccess ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-sm font-bold text-reelo-primary">@{username} Blocked</h4>
              <p className="text-xs text-reelo-muted">
                You will no longer see content from this account.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-reelo-danger">
                  <UserX className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-reelo-primary">Block @{username}?</h3>
                  <p className="text-[11px] text-reelo-muted">They will not be notified</p>
                </div>
              </div>

              <p className="text-xs text-reelo-muted leading-relaxed">
                Posts, comments, and messages from @{username} will be hidden from your feeds. You can unblock them anytime in settings.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-reelo-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  isLoading={isSubmitting}
                  onClick={handleBlock}
                  className="font-bold px-4"
                >
                  Block Account
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
