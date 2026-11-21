'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  User,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatTimeAgo } from '@/lib/utils/formatters';

interface ReportItem {
  id: string;
  reporter_id: string;
  reporter_username: string;
  reporter_name: string;
  target_type: 'post' | 'user' | 'comment';
  target_id: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved' | 'dismissed'>('pending');
  const [loading, setLoading] = useState(true);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchReports = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Failed to load moderation reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(activeTab);
  }, [activeTab]);

  const handleAction = async (reportId: string, status: 'resolved' | 'dismissed', action?: string) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_id: reportId,
          status,
          action,
        }),
      });

      if (res.ok) {
        setActionSuccessMessage(
          action === 'delete_content'
            ? 'Report resolved: Content removed from platform.'
            : status === 'dismissed'
            ? 'Report dismissed.'
            : 'Report resolved.'
        );

        setTimeout(() => setActionSuccessMessage(null), 3000);
        setReports((prev) => prev.filter((r) => r.id !== reportId));
      }
    } catch (err) {
      console.error('Failed to action report:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {actionSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-subtle"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-reelo-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-reelo-primary text-white shadow-subtle">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-reelo-primary">Content Moderation Queue</h1>
            <p className="text-xs text-reelo-muted">
              Review flagged posts, policy violations, and community safety reports
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-reelo-surfaceMuted border border-reelo-border text-reelo-primary font-bold">
            Role: Authorized Admin
          </span>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-reelo-border pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'pending'
              ? 'bg-reelo-primary text-white shadow-subtle'
              : 'text-reelo-muted hover:text-reelo-text hover:bg-reelo-surfaceMuted'
          }`}
        >
          Pending Review ({activeTab === 'pending' ? reports.length : '...'})
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'resolved'
              ? 'bg-reelo-primary text-white shadow-subtle'
              : 'text-reelo-muted hover:text-reelo-text hover:bg-reelo-surfaceMuted'
          }`}
        >
          Resolved
        </button>

        <button
          onClick={() => setActiveTab('dismissed')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'dismissed'
              ? 'bg-reelo-primary text-white shadow-subtle'
              : 'text-reelo-muted hover:text-reelo-text hover:bg-reelo-surfaceMuted'
          }`}
        >
          Dismissed
        </button>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-white border border-reelo-border animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <Card className="p-12 text-center bg-white border-reelo-border space-y-2">
            <CheckCircle className="w-8 h-8 text-reelo-secondary mx-auto" />
            <h3 className="text-sm font-bold text-reelo-primary">
              Queue Clean — No {activeTab} reports
            </h3>
            <p className="text-xs text-reelo-muted">
              All community submissions have been reviewed and resolved.
            </p>
          </Card>
        ) : (
          reports.map((report) => (
            <Card
              key={report.id}
              className="p-5 bg-white border-reelo-border shadow-subtle space-y-4 hover:border-reelo-borderHover transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-rose-50 text-reelo-danger">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-reelo-primary uppercase tracking-wider">
                        {report.target_type} Report
                      </span>
                      <Badge variant="danger" className="text-[10px] uppercase">
                        {report.reason.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-reelo-muted flex items-center gap-1 pt-0.5">
                      <Clock className="w-3 h-3" />
                      Reported {formatTimeAgo(report.created_at)} by @{report.reporter_username || 'anonymous'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-reelo-muted">
                  ID: {report.target_id}
                </span>
              </div>

              {/* Report Context / Description */}
              {report.details && (
                <div className="p-3 rounded-xl bg-reelo-surfaceMuted border border-reelo-border text-xs text-reelo-text space-y-1">
                  <p className="font-semibold text-reelo-primary">Reporter statement:</p>
                  <p className="text-reelo-muted italic">&ldquo;{report.details}&rdquo;</p>
                </div>
              )}

              {/* Action Buttons */}
              {activeTab === 'pending' && (
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-reelo-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(report.id, 'dismissed')}
                    className="text-xs"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Dismiss Report
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleAction(report.id, 'resolved', 'delete_content')}
                    className="text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove Content
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
