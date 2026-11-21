'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReportModalProps {
  isOpen: boolean;
  targetType: 'post' | 'user' | 'comment';
  targetId: string;
  targetTitle?: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

const REPORT_REASONS = [
  { id: 'harassment', label: 'Harassment or bullying' },
  { id: 'spam', label: 'Spam, scam, or commercial abuse' },
  { id: 'inappropriate', label: 'Inappropriate or graphic content' },
  { id: 'misinformation', label: 'Harmful misinformation' },
  { id: 'hate_speech', label: 'Hate speech or discrimination' },
  { id: 'other', label: 'Other violation of community guidelines' },
];

export function ReportModal({
  isOpen,
  targetType,
  targetId,
  targetTitle,
  onClose,
  onSubmitted,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('harassment');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          reason: selectedReason,
          details: details.trim(),
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onSubmitted?.();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white border border-reelo-border rounded-2xl shadow-floating overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-reelo-border bg-reelo-surfaceMuted/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 text-reelo-danger">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-reelo-primary">
                  Report {targetType === 'post' ? 'Post' : targetType === 'user' ? 'Account' : 'Comment'}
                </h3>
                <p className="text-[11px] text-reelo-muted">
                  Help maintain a trusted and safe community
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-reelo-muted hover:text-reelo-text hover:bg-reelo-surfaceMuted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          {isSuccess ? (
            <div className="py-12 px-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-sm font-bold text-reelo-primary">Report Received</h4>
              <p className="text-xs text-reelo-muted max-w-xs mx-auto">
                Thank you for your report. Our moderation team has queued this item for priority review.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {targetTitle && (
                <div className="p-2.5 rounded-xl bg-reelo-surfaceMuted border border-reelo-border text-xs text-reelo-muted line-clamp-2">
                  <span className="font-semibold text-reelo-text mr-1">Target:</span>
                  &ldquo;{targetTitle}&rdquo;
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-bold text-reelo-primary">
                  Why are you reporting this?
                </label>
                <div className="space-y-1.5">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedReason === r.id
                          ? 'border-reelo-primary bg-reelo-primary/5 text-reelo-primary font-semibold'
                          : 'border-reelo-border text-reelo-text hover:bg-reelo-surfaceMuted'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={r.id}
                        checked={selectedReason === r.id}
                        onChange={() => setSelectedReason(r.id)}
                        className="text-reelo-primary focus:ring-reelo-primary"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-reelo-primary">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide context or specific details to help our review..."
                  rows={3}
                  className="w-full bg-white border border-reelo-border text-xs text-reelo-text placeholder:text-reelo-muted rounded-xl p-3 outline-none focus:border-reelo-secondary focus:ring-2 focus:ring-reelo-secondary/20 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-reelo-border">
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
                  type="submit"
                  variant="danger"
                  size="sm"
                  isLoading={isSubmitting}
                  className="font-bold px-4"
                >
                  Submit Report
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
