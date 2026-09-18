'use client';

import React from 'react';

export function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Top Left Cyan Glow Orb */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyber-cyan/10 blur-[130px] transition-all duration-1000 dark:bg-cyber-cyan/15" />

      {/* Center Right Indigo/Blue Glow Orb */}
      <div className="absolute right-[-10%] top-[25%] h-[600px] w-[600px] rounded-full bg-brand-500/10 blur-[150px] transition-all duration-1000 dark:bg-brand-600/15" />

      {/* Bottom Center Purple Glow Orb */}
      <div className="absolute bottom-[-10%] left-[30%] h-[550px] w-[550px] rounded-full bg-cyber-purple/10 blur-[140px] transition-all duration-1000 dark:bg-cyber-purple/15" />
    </div>
  );
}

export function BackgroundGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-opacity duration-500 dark:opacity-25"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 40%, black 40%, transparent 100%)',
      }}
      aria-hidden="true"
    />
  );
}
