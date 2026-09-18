'use client';

import React, { ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  maxDisplacement?: number;
  className?: string;
  disabled?: boolean;
}

export function Magnetic({
  children,
  strength = 0.22,
  maxDisplacement = 8,
  className = '',
  disabled = false,
}: MagneticProps) {
  const { ref, style } = useMagnetic<HTMLDivElement>({
    strength,
    maxDisplacement,
    disabled,
  });

  return (
    <div
      ref={ref}
      style={style}
      className={`inline-block transition-transform duration-150 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
