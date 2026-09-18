'use client';

import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  isInside: boolean;
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: -100,
    y: -100,
    isInside: false,
  });

  useEffect(() => {
    // Only track if pointer is fine (desktop mouse)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
        isInside: true,
      });
    };

    const handleMouseLeave = () => {
      setMousePosition((prev) => ({ ...prev, isInside: false }));
    };

    const handleMouseEnter = () => {
      setMousePosition((prev) => ({ ...prev, isInside: true }));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return mousePosition;
}
