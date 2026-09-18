'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`glass-card rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-slate-200/80 dark:border-slate-800 ${className}`}
    >
      <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mb-4 shadow-glow-cyan/10">
        <Icon className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} leftIcon={actionIcon} isMagnetic>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
