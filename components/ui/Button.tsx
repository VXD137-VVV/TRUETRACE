'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/effects/Magnetic';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  isMagnetic?: boolean;
  magneticStrength?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isMagnetic = false,
      magneticStrength = 0.2,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyber-cyan';

    const variants = {
      primary:
        'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 border border-white/20 dark:border-cyan-400/30',
      secondary:
        'bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-600',
      outline:
        'border border-cyan-500/40 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500 dark:border-cyan-400/40 dark:hover:border-cyan-400 backdrop-blur-sm',
      ghost:
        'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60',
      danger:
        'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25 border border-rose-400/30',
      glow:
        'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-glow-cyan backdrop-blur-md',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4.5 py-2.5 gap-2 h-10',
      lg: 'text-base px-6 py-3.5 gap-2.5 h-12',
      icon: 'p-2.5 h-10 w-10 justify-center',
    };

    const buttonContent = (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );

    if (isMagnetic && !disabled && !isLoading) {
      return <Magnetic strength={magneticStrength}>{buttonContent}</Magnetic>;
    }

    return buttonContent;
  }
);

Button.displayName = 'Button';
