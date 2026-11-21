import React from 'react';
import { BrandLogo } from '@/components/navigation/BrandLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-reelo-bg flex flex-col justify-between p-4 sm:p-6 relative">
      {/* Header */}
      <header className="relative z-10 flex justify-center py-6">
        <BrandLogo size="md" showTagline />
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex items-center justify-center py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-reelo-muted py-6">
        <p>REELO Platform — Connect. Create. Discover.</p>
      </footer>
    </div>
  );
}
