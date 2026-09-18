'use client';

import React from 'react';
import { Package, ShieldCheck, AlertTriangle, Percent, ArrowUpRight } from 'lucide-react';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { useUserData } from '@/lib/data/user-data-context';

export function StatCardsGrid() {
  const { stats } = useUserData();

  const cards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      change: stats.totalProducts > 0 ? `${stats.totalProducts} active in inventory` : 'No products registered yet',
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
      glow: 'hover:shadow-glow-blue',
    },
    {
      label: 'Verified Products',
      value: stats.verifiedProducts,
      change: stats.verifiedProducts > 0 ? `${stats.verifiedProducts} authentic passes` : '0 authentic records',
      icon: ShieldCheck,
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'hover:shadow-glow-emerald',
    },
    {
      label: 'Flagged Products',
      value: stats.flaggedProducts,
      change: stats.flaggedProducts > 0 ? `${stats.flaggedProducts} anomalies intercepted` : '0 risk anomalies',
      icon: AlertTriangle,
      gradient: 'from-amber-500 to-rose-600',
      glow: 'hover:shadow-glow-rose',
    },
    {
      label: 'Verification Rate',
      value: stats.verificationRate,
      decimals: stats.totalAttempts > 0 ? 1 : 0,
      suffix: '%',
      change: stats.totalAttempts > 0 ? `${stats.totalAttempts} total validation scans` : 'Awaiting first verification',
      icon: Percent,
      gradient: 'from-cyan-500 to-blue-600',
      glow: 'hover:shadow-glow-cyan',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`glass-card rounded-2xl p-5 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 ${stat.glow}`}
            data-cursor="card"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${stat.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Dynamic Value */}
            <div className="mt-4 flex items-baseline gap-2">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                <AnimatedCounter
                  value={stat.value}
                  decimals={stat.decimals || 0}
                  suffix={stat.suffix || ''}
                />
              </div>
            </div>

            {/* User-specific dynamic subtext */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{stat.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
