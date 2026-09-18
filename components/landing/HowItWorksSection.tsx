'use client';

import React from 'react';
import { ShieldCheck, QrCode, Smartphone, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Register Product',
      description:
        'Manufacturers issue a cryptographically secured digital passport with immutable serial credentials at factory inception.',
      icon: ShieldCheck,
      gradient: 'from-cyan-500 to-blue-600',
      badge: 'Genesis Phase',
    },
    {
      number: '02',
      title: 'Create Product Identity',
      description:
        'Generate dynamic, anti-clone QR micro-matrices and hardware NFC seals with rotational cryptographic tokens.',
      icon: QrCode,
      gradient: 'from-blue-600 to-indigo-600',
      badge: 'Identity Binding',
    },
    {
      number: '03',
      title: 'Scan & Verify',
      description:
        'Supply chain partners and end customers scan the product with any camera or terminal to instantly validate origin and custody.',
      icon: Smartphone,
      gradient: 'from-indigo-600 to-purple-600',
      badge: 'Live Verification',
    },
    {
      number: '04',
      title: 'Build Trust',
      description:
        'Eliminate counterfeits, monitor real-time distribution anomalies, and guarantee 100% genuine buyer satisfaction.',
      icon: Sparkles,
      gradient: 'from-purple-600 to-pink-600',
      badge: 'Provenance Locked',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Seamless 4-Step Verification Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How <span className="gradient-text">TrueTrace</span> Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            From factory assembly to the end consumer’s hands, our zero-trust protocol ensures absolute authenticity at every touchpoint.
          </p>
        </div>

        {/* Steps Grid with Connecting Line */}
        <div className="relative">
          {/* Desktop connecting horizontal line */}
          <div
            className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 -translate-y-12 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-20 dark:opacity-40"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="glass-card rounded-2xl p-6 relative group transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40"
                  data-cursor="card"
                >
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-black tracking-tighter text-slate-300 dark:text-slate-700 group-hover:text-cyan-500 transition-colors">
                      {step.number}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {step.badge}
                    </span>
                  </div>

                  {/* Step Icon */}
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${step.gradient} flex items-center justify-center text-white shadow-md mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
