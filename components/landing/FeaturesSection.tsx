'use client';

import React from 'react';
import {
  ShieldCheck,
  QrCode,
  Truck,
  History,
  AlertOctagon,
  BarChart3,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      id: 'feat-1',
      title: 'Product Authentication',
      description:
        'Dual-layer cryptographic signatures and tamper-evident micro-seals verify authentic manufacturing origin with 99.9% certainty.',
      icon: ShieldCheck,
      color: 'from-cyan-500 to-blue-600',
      tag: 'Zero Counterfeits',
      accentGlow: 'hover:shadow-glow-cyan',
    },
    {
      id: 'feat-2',
      title: 'QR Verification',
      description:
        'Dynamic anti-clone QR matrices with rotational tokens prevent reproduction, screenshot re-use, or static replica attacks.',
      icon: QrCode,
      color: 'from-blue-600 to-indigo-600',
      tag: 'Anti-Clone Tech',
      accentGlow: 'hover:shadow-glow-blue',
    },
    {
      id: 'feat-3',
      title: 'Supply Chain Visibility',
      description:
        'End-to-end tracking across factories, international freight, customs clearance hubs, and regional distribution nodes.',
      icon: Truck,
      color: 'from-indigo-600 to-purple-600',
      tag: 'Real-Time Telemetry',
      accentGlow: 'hover:shadow-glow-purple',
    },
    {
      id: 'feat-4',
      title: 'Product History',
      description:
        'Full chronological audit trails documenting quality inspection passes, batch numbers, thermal logs, and ownership transfers.',
      icon: History,
      color: 'from-purple-600 to-pink-600',
      tag: 'Immutable Trail',
      accentGlow: 'hover:shadow-glow-rose',
    },
    {
      id: 'feat-5',
      title: 'Fraud Detection',
      description:
        'Automated geolocation anomaly engine immediately flags impossible travel velocities, unauthorized sales, and duplicate scans.',
      icon: AlertOctagon,
      color: 'from-rose-500 to-amber-500',
      tag: 'Risk Anomaly Shield',
      accentGlow: 'hover:shadow-glow-rose',
    },
    {
      id: 'feat-6',
      title: 'Verification Analytics',
      description:
        'Executive dashboards with regional heatmaps, trust confidence scores, product category distributions, and counterfeit trend charts.',
      icon: BarChart3,
      color: 'from-emerald-500 to-cyan-500',
      tag: 'BI & Intelligence',
      accentGlow: 'hover:shadow-glow-emerald',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Enterprise-Grade Security Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Comprehensive <span className="gradient-text">Verification Suite</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Purpose-built technology designed to safeguard brand reputation, protect high-value assets, and empower consumer trust.
          </p>
        </div>

        {/* Features 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={`glass-card rounded-2xl p-7 relative group transition-all duration-300 hover:-translate-y-2.5 ${feature.accentGlow}`}
                data-cursor="card"
              >
                {/* Top Row: Icon & Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                    {feature.tag}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>{feature.title}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-cyan-500" />
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
