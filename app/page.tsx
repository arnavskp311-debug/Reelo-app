import React from 'react';
import Link from 'next/link';
import {
  Users,
  ArrowRight,
  ShieldCheck,
  Video,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '@/components/navigation/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-reelo-bg text-reelo-text overflow-hidden">
      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-reelo-border bg-white/70 backdrop-blur-md">
        <BrandLogo size="md" showTagline />

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-reelo-muted hover:text-reelo-primary px-3 py-2 rounded-xl transition-colors"
          >
            Sign In
          </Link>
          <Link href="/home">
            <Button variant="primary" size="md">
              Launch App
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-reelo-border text-xs text-reelo-primary font-semibold shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-reelo-secondary" />
            <span>Your Social Universe. Natural. Premium. Authentic.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-reelo-primary">
            Connect.{' '}
            <span className="text-reelo-accent">
              Create.
            </span>{' '}
            Discover.
          </h1>

          <p className="text-base sm:text-lg text-reelo-muted font-normal leading-relaxed max-w-2xl mx-auto">
            An original all-in-one social networking platform designed for meaningful human connection, creator stories, vertical reels, and sovereign communities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link href="/home" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-base">
                <span>Enter REELO Feed</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
          <Card className="p-6 space-y-3 bg-white border-reelo-border shadow-subtle hover:border-reelo-borderHover transition-all">
            <div className="w-10 h-10 rounded-xl bg-reelo-surfaceMuted flex items-center justify-center text-reelo-secondary">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-reelo-primary">Multi-Format Creation</h3>
            <p className="text-xs sm:text-sm text-reelo-muted leading-relaxed">
              Share high-res photography, vertical 9:16 reels, audio stems, and long-form perspectives with zero compression degradation.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border-reelo-border shadow-subtle hover:border-reelo-borderHover transition-all">
            <div className="w-10 h-10 rounded-xl bg-reelo-surfaceMuted flex items-center justify-center text-reelo-secondary">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-reelo-primary">Sovereign Communities</h3>
            <p className="text-xs sm:text-sm text-reelo-muted leading-relaxed">
              Connect in focused guilds organized by discipline: technology, design systems, sound labs, and cosmic explorations.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-white border-reelo-border shadow-subtle hover:border-reelo-borderHover transition-all">
            <div className="w-10 h-10 rounded-xl bg-reelo-surfaceMuted flex items-center justify-center text-reelo-secondary">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-reelo-primary">Transparent Feeds</h3>
            <p className="text-xs sm:text-sm text-reelo-muted leading-relaxed">
              Full control over your universe: pure chronological following feeds, high-signal creator reels, or trending community discussions.
            </p>
          </Card>
        </div>

        {/* Metrics Banner */}
        <div className="mt-14 rounded-2xl p-6 bg-white border border-reelo-border shadow-subtle flex flex-col md:flex-row items-center justify-around gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-reelo-primary">TypeScript</p>
            <p className="text-xs text-reelo-muted">Strict Type Safety</p>
          </div>
          <div className="h-8 w-px bg-reelo-border hidden md:block" />
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-reelo-primary">Local SQLite DB</p>
            <p className="text-xs text-reelo-muted">Node.js Native & Private</p>
          </div>
          <div className="h-8 w-px bg-reelo-border hidden md:block" />
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-reelo-primary">Mobile Ready</p>
            <p className="text-xs text-reelo-muted">PWA Homescreen Installable</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-reelo-border py-8 text-center text-xs text-reelo-muted bg-white">
        <p>© 2026 REELO. Connect. Create. Discover.</p>
      </footer>
    </div>
  );
}
