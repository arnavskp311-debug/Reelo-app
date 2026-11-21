'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reelo-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-reelo-bg';

    const variants = {
      // Natural Premium Primary CTA (#243746)
      primary: 'bg-reelo-primary hover:bg-reelo-primary-hover text-white font-semibold shadow-subtle',
      // Terracotta Accent CTA (#C87952)
      gradient: 'bg-reelo-accent hover:bg-reelo-accent-hover text-white font-semibold shadow-subtle',
      // White Surface Card Button (#FFFFFF)
      secondary: 'bg-white hover:bg-reelo-surfaceMuted border border-reelo-border text-reelo-text font-medium shadow-subtle',
      // Clean Outline
      outline: 'border border-reelo-border hover:border-reelo-borderHover text-reelo-text bg-transparent hover:bg-reelo-surfaceMuted',
      ghost: 'hover:bg-reelo-surfaceMuted text-reelo-muted hover:text-reelo-text',
      danger: 'bg-red-50 hover:bg-red-100 text-reelo-danger border border-red-200',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
      md: 'text-sm px-4 py-2 rounded-xl gap-2',
      lg: 'text-sm sm:text-base px-5 py-2.5 rounded-xl gap-2 font-semibold',
      icon: 'h-9 w-9 p-0 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
