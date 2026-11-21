'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
  hasStoryRing?: boolean;
  className?: string;
}

export function Avatar({
  src,
  alt,
  size = 'md',
  isVerified = false,
  hasStoryRing = false,
  className,
}: AvatarProps) {
  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-13 h-13 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden flex items-center justify-center font-semibold select-none bg-reelo-surfaceMuted text-reelo-text border border-reelo-border',
          sizeMap[size],
          hasStoryRing && 'ring-2 ring-reelo-accent ring-offset-2 ring-offset-reelo-bg'
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover rounded-full"
            sizes="80px"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-reelo-muted font-bold">
            {getInitials(alt || 'U')}
          </span>
        )}
      </div>

      {isVerified && (
        <span className="absolute -bottom-0.5 -right-0.5 bg-reelo-secondary text-white rounded-full p-0.5 shadow-subtle">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      )}
    </div>
  );
}
