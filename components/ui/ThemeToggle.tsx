'use client';

import React from 'react';
import { useTheme, Theme } from '@/lib/theme/theme-context';
import { Sun, Moon, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-1 backdrop-blur-md shadow-sm',
        className
      )}
      role="radiogroup"
      aria-label="Theme selector"
    >
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all duration-200',
          theme === 'light'
            ? 'bg-amber-400/20 text-amber-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        )}
        title="Light Mode"
        aria-label="Light mode"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all duration-200',
          theme === 'dark'
            ? 'bg-cyan-500/20 text-cyan-400 shadow-glow-cyan/20'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        )}
        title="Dark Mode"
        aria-label="Dark mode"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all duration-200',
          theme === 'system'
            ? 'bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 shadow-sm'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        )}
        title="System Preference"
        aria-label="System theme"
      >
        <Laptop className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
