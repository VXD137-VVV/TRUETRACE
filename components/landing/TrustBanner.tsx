'use client';

import React from 'react';
import { Shield, Lock, Award, CheckCircle, Cpu, Globe2 } from 'lucide-react';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';

export function TrustBanner() {
  const metrics = [
    { label: 'Products Secured', value: 4800000, prefix: '', suffix: '+', decimals: 0 },
    { label: 'Counterfeits Prevented', value: 342000, prefix: '', suffix: '+', decimals: 0 },
    { label: 'Active Retail Nodes', value: 1850, prefix: '', suffix: '', decimals: 0 },
    { label: 'Global Confidence Score', value: 99.8, prefix: '', suffix: '%', decimals: 1 },
  ];

  const badges = [
    { name: 'SOC 2 Type II Certified', icon: Shield },
    { name: 'ISO/IEC 27001 Validated', icon: Lock },
    { name: 'FIPS 140-3 Hardware RoT', icon: Cpu },
    { name: 'Global GS1 Digital Link Compliant', icon: Globe2 },
  ];

  return (
    <section className="py-20 border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center pb-14 border-b border-slate-200/60 dark:border-slate-800/60">
          {metrics.map((metric, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                <AnimatedCounter
                  value={metric.value}
                  decimals={metric.decimals}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                />
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Security Standards Badges */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"
              >
                <Icon className="h-4 w-4 text-cyan-500" />
                <span>{b.name}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
