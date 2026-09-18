'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/lib/theme/theme-context';
import { getPlatformSettings, DATA_CHANGED_EVENT } from '@/lib/data/store';

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
}

export function CursorTrailCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();
  const [isEnabledByAdmin, setIsEnabledByAdmin] = useState(true);

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
    // Only run on desktop devices with fine pointer and no reduced motion preference and when enabled by admin
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !isEnabledByAdmin
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: TrailParticle[] = [];
    let lastX = -100;
    let lastY = -100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const isDark = resolvedTheme === 'dark';
    const primaryColor = isDark ? '56, 189, 248' : '59, 115, 232'; // cyan in dark, blue in light
    const secondaryColor = isDark ? '139, 124, 255' : '124, 92, 252'; // purple/indigo

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const dist = Math.hypot(x - lastX, y - lastY);

      // Only add particle if mouse has moved enough
      if (dist > 5) {
        lastX = x;
        lastY = y;

        // Add 1-2 small particles per movement step
        const useSecondary = Math.random() > 0.5;
        particles.push({
          x,
          y,
          size: Math.random() * 3 + 2,
          alpha: 0.45,
          color: useSecondary ? secondaryColor : primaryColor,
        });

        // Limit maximum particle count for 60fps safety
        if (particles.length > 25) {
          particles.shift();
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.alpha *= 0.92; // Gradual fade
        p.size *= 0.96; // Gradual shrink

        if (p.alpha > 0.02 && p.size > 0.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${p.color}, ${p.alpha * 0.8})`;
          ctx.fill();
        }
      }

      particles = particles.filter((p) => p.alpha > 0.02 && p.size > 0.5);

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme, isEnabledByAdmin]);

  if (!isEnabledByAdmin) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9990] h-full w-full"
      aria-hidden="true"
    />
  );
}
