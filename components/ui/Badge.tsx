import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'default' | 'success' | 'danger' | 'slate' | 'blue' | 'purple' | 'cyan' | 'pink';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-reelo-surfaceMuted text-reelo-text border-reelo-border font-medium',
    primary: 'bg-reelo-primary/10 text-reelo-primary border-reelo-primary/20 font-semibold',
    secondary: 'bg-reelo-secondary/15 text-reelo-secondary border-reelo-secondary/30 font-semibold',
    accent: 'bg-reelo-accent-soft text-reelo-accent border-reelo-accent-border font-semibold',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium',
    danger: 'bg-rose-50 text-rose-800 border-rose-200 font-medium',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-sky-50 text-sky-800 border-sky-200',
    purple: 'bg-slate-100 text-slate-800 border-slate-200',
    cyan: 'bg-teal-50 text-teal-800 border-teal-200',
    pink: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] border tracking-wide select-none',
        selectedVariant,
        className
      )}
    >
      {children}
    </span>
  );
}
