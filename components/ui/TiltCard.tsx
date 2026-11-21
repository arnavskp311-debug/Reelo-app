'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
  className?: string;
  enableSheen?: boolean;
}

export function TiltCard({
  children,
  maxTilt = 8,
  scale = 1.015,
  className,
  enableSheen = true,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return; // Touch devices

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateX = (-y * maxTilt * 2).toFixed(2);
    const rotateY = (x * maxTilt * 2).toFixed(2);

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 80ms cubic-bezier(0.22, 1, 0.36, 1)',
    });

    if (enableSheen) {
      setSheenPosition({
        x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
        y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
        opacity: 0.15,
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
    });
    setSheenPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn('relative transform-gpu will-change-transform rounded-xl overflow-hidden', className)}
      {...props}
    >
      {children}
      {enableSheen && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-xl"
          style={{
            opacity: sheenPosition.opacity,
            background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`,
          }}
        />
      )}
    </div>
  );
}
