'use client';

import { useEffect, useRef, useState } from 'react';

export function useAnimatedNumber(target: number, duration = 380) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      prevRef.current = target;
      return;
    }

    const from = prevRef.current;
    if (from === target) return;

    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // Exponential ease-out
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        prevRef.current = target;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return value;
}
