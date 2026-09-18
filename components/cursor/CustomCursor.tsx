'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCursor, CursorVariant } from '@/hooks/useCursor';
import { useTheme } from '@/lib/theme/theme-context';
import { getPlatformSettings, DATA_CHANGED_EVENT } from '@/lib/data/store';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const { cursorVariant, cursorText, setCursorVariant, resetCursor } = useCursor();
  const { resolvedTheme } = useTheme();

  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isEnabledByAdmin, setIsEnabledByAdmin] = useState(true);

  // Position references for lerp interpolation
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const checkSettings = () => {
      const settings = getPlatformSettings();
      setIsEnabledByAdmin(settings.enableCursorEffects);
    };

    checkSettings();
    window.addEventListener(DATA_CHANGED_EVENT, checkSettings);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, checkSettings);
  }, []);

  useEffect(() => {
    // Check if touch device or coarse pointer or disabled by admin
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (!window.matchMedia('(pointer: fine)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !isEnabledByAdmin);

    if (isTouchDevice) {
      setIsTouch(true);
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    setIsTouch(false);
    document.body.classList.add('custom-cursor-active');

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Instant update for dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth Lerp animation loop for the outer ring
    const render = () => {
      const ease = 0.16;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Auto-detect hover targets
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const buttonEl = target.closest('button, [role="button"]');
      const linkEl = target.closest('a');
      const inputEl = target.closest('input, textarea, [contenteditable="true"], select');
      const cardEl = target.closest('.glass-card, [data-cursor="card"]');
      const imageEl = target.closest('img, [data-cursor="image"]');
      const customCursorData = target.closest('[data-cursor]');

      if (inputEl) {
        setCursorVariant('text');
      } else if (customCursorData) {
        const val = customCursorData.getAttribute('data-cursor') as CursorVariant;
        const text = customCursorData.getAttribute('data-cursor-text') || '';
        setCursorVariant(val || 'button', text);
      } else if (buttonEl) {
        setCursorVariant('button');
      } else if (linkEl) {
        setCursorVariant('link');
      } else if (imageEl) {
        setCursorVariant('image', 'VIEW');
      } else if (cardEl) {
        setCursorVariant('card');
      } else {
        resetCursor();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, setCursorVariant, resetCursor, isEnabledByAdmin]);

  if (isTouch || !isEnabledByAdmin) return null;

  const isDark = resolvedTheme === 'dark';

  // Dynamic styling based on variant
  const getRingStyles = () => {
    switch (cursorVariant) {
      case 'button':
        return 'w-12 h-12 -mt-6 -ml-6 border-2 border-cyan-400/80 bg-cyan-400/15 scale-110 shadow-glow-cyan';
      case 'link':
        return 'w-10 h-10 -mt-5 -ml-5 border-2 border-purple-400/80 bg-purple-400/15 scale-125 shadow-glow-purple';
      case 'card':
        return 'w-14 h-14 -mt-7 -ml-7 border border-blue-400/60 bg-blue-500/10 shadow-glow-blue scale-105';
      case 'image':
        return 'w-16 h-16 -mt-8 -ml-8 border-2 border-cyan-400 bg-black/60 backdrop-blur-sm text-[10px] font-bold text-cyan-400';
      case 'text':
        return 'w-0 h-0 opacity-0';
      case 'hidden':
        return 'opacity-0 scale-0';
      default:
        return isDark
          ? 'w-8 h-8 -mt-4 -ml-4 border border-cyan-400/50 bg-cyan-400/10'
          : 'w-8 h-8 -mt-4 -ml-4 border border-blue-600/50 bg-blue-600/10';
    }
  };

  const getDotStyles = () => {
    if (cursorVariant === 'text' || cursorVariant === 'hidden') {
      return 'opacity-0 scale-0';
    }
    if (cursorVariant === 'image') {
      return 'opacity-0';
    }
    return isDark
      ? 'w-2 h-2 -mt-1 -ml-1 bg-cyan-400 shadow-[0_0_8px_#38BDF8]'
      : 'w-2 h-2 -mt-1 -ml-1 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]';
  };

  return (
    <>
      {/* Central exact dot */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] rounded-full transition-opacity duration-150 will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${getDotStyles()}`}
        aria-hidden="true"
      />

      {/* Smooth outer follower ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center rounded-full transition-[width,height,margin,border,background,transform,opacity] duration-200 ease-out will-change-transform ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${getRingStyles()}`}
        aria-hidden="true"
      >
        {cursorVariant === 'image' && (
          <span className="tracking-wider uppercase text-cyan-400">{cursorText || 'VIEW'}</span>
        )}
      </div>
    </>
  );
}
