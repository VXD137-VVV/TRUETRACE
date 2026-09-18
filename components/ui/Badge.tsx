'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { VerificationStatus } from '@/lib/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'authentic' | 'suspicious' | 'failed' | 'not_found' | 'neutral' | 'cyber' | 'info';
  status?: VerificationStatus;
  withIcon?: boolean;
  withDot?: boolean;
}

export function Badge({
  className,
  variant,
  status,
  withIcon = false,
  withDot = true,
  children,
  ...props
}: BadgeProps) {
  // If status is provided, map to variant
  const activeVariant: 'authentic' | 'suspicious' | 'failed' | 'not_found' | 'neutral' | 'cyber' | 'info' =
    status || variant || 'neutral';

  const variants: Record<string, string> = {
    authentic:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/40 shadow-sm shadow-emerald-500/10',
    suspicious:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/40 shadow-sm shadow-amber-500/10',
    failed:
      'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 dark:border-rose-500/40 shadow-sm shadow-rose-500/10',
    not_found:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/40 shadow-sm shadow-amber-500/10',
    cyber:
      'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 dark:border-cyan-400/40 shadow-glow-cyan/20',
    info:
      'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 dark:border-indigo-500/40',
    neutral:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const dots: Record<string, string> = {
    authentic: 'bg-emerald-500 shadow-[0_0_8px_#10B981]',
    suspicious: 'bg-amber-500 shadow-[0_0_8px_#F59E0B]',
    failed: 'bg-rose-500 shadow-[0_0_8px_#F43F5E]',
    not_found: 'bg-amber-500 shadow-[0_0_8px_#F59E0B]',
    cyber: 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]',
    info: 'bg-indigo-500 shadow-[0_0_8px_#6366F1]',
    neutral: 'bg-slate-400',
  };

  const renderIcon = () => {
    switch (activeVariant) {
      case 'authentic':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case 'suspicious':
      case 'not_found':
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
      case 'failed':
        return <XCircle className="h-3.5 w-3.5 text-rose-500" />;
      case 'cyber':
        return <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />;
      case 'info':
        return <Sparkles className="h-3.5 w-3.5 text-indigo-400" />;
      default:
        return null;
    }
  };

  const defaultLabels: Record<string, string> = {
    authentic: 'Authentic',
    suspicious: 'Suspicious',
    failed: 'Failed',
    not_found: 'Not Found',
    cyber: 'Secured',
    info: 'Verified',
    neutral: 'Standard',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide backdrop-blur-sm transition-all duration-200',
        variants[activeVariant] || variants.neutral,
        className
      )}
      {...props}
    >
      {withDot && !withIcon && (
        <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', dots[activeVariant] || dots.neutral)} />
      )}
      {withIcon && renderIcon()}
      <span>{children || defaultLabels[activeVariant] || 'Status'}</span>
    </span>
  );
}
