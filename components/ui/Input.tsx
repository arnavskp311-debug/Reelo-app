'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-reelo-text">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-reelo-muted pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'w-full bg-white border border-reelo-border text-reelo-text placeholder:text-reelo-muted text-sm rounded-xl px-3.5 py-2.5 transition-all outline-none shadow-subtle',
              'focus:border-reelo-secondary focus:ring-2 focus:ring-reelo-secondary/20',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-reelo-muted flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-reelo-danger font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
