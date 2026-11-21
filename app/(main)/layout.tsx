import React from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Header } from '@/components/layout/Header';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-reelo-bg flex justify-center">
      {/* Container to restrict extreme ultra-wide stretching while keeping perfect desktop 3-column balance */}
      <div className="w-full max-w-[1440px] flex">
        {/* Left Sidebar (Desktop) */}
        <Sidebar />

        {/* Center Content Column */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen border-r border-reelo-border/50 pb-20 lg:pb-8">
          <Header />
          <main className="flex-1 p-4 sm:p-6 max-w-3xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Right Sidebar (Desktop xl and above) */}
        <RightSidebar />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
