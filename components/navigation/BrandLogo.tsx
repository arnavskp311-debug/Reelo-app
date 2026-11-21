import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function BrandLogo({ className, size = 'md', showTagline = false }: BrandLogoProps) {
  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl font-black',
  };

  const markSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <Link href="/" className={cn('inline-flex items-center gap-2.5 group select-none', className)}>
      {/* Bespoke REELO Natural Premium Monogram Mark */}
      <div
        className={cn(
          'relative rounded-xl bg-reelo-primary text-white flex items-center justify-center font-black tracking-tighter shadow-sm transition-transform duration-200 group-hover:scale-105',
          markSizes[size]
        )}
      >
        <span className="relative z-10 font-bold">R</span>
        {/* Warm Terracotta Accent Pip */}
        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-reelo-accent" />
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'tracking-tight text-reelo-primary font-black group-hover:text-reelo-primary-hover transition-colors',
              textSizes[size]
            )}
          >
            REELO
          </span>
        </div>
        {showTagline && (
          <p className="text-[10px] tracking-wider uppercase font-semibold text-reelo-muted">
            Connect. Create. Discover.
          </p>
        )}
      </div>
    </Link>
  );
}
