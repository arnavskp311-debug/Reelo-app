import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({
  children,
  className,
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-reelo-surface border border-reelo-border rounded-xl p-5 shadow-subtle transition-all duration-150',
        interactive && 'hover:border-reelo-borderHover hover:shadow-card cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
