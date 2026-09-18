'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface MagneticOptions {
  strength?: number; // 0.1 to 0.4 (default 0.2)
  maxDisplacement?: number; // max pixels (default 8)
  disabled?: boolean;
}

export function useMagnetic<T extends HTMLElement = HTMLElement>({
  strength = 0.2,
  maxDisplacement = 8,
  disabled = false,
}: MagneticOptions = {}) {
  const ref = useRef<T | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (disabled || !ref.current) return;

      // Check if user prefers reduced motion or is on mobile
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !window.matchMedia('(pointer: fine)').matches
      ) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      // Trigger radius: 1.5x element width or 80px
      const triggerRadius = Math.max(rect.width, rect.height) * 0.8;

      if (distance < triggerRadius) {
        const pullX = Math.min(Math.max(deltaX * strength, -maxDisplacement), maxDisplacement);
        const pullY = Math.min(Math.max(deltaY * strength, -maxDisplacement), maxDisplacement);
        setPosition({ x: pullX, y: pullY });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    },
    [disabled, strength, maxDisplacement]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, disabled]);

  return { ref, position, style: { transform: `translate3d(${position.x}px, ${position.y}px, 0)` } };
}
