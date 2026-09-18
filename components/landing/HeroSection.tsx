'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, QrCode, Cpu, Lock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-300 shadow-glow-cyan/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
              <span>Next-Gen Cryptographic Product Authentication</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Verify Every Product.{' '}
              <span className="gradient-text block">Trust Every Purchase.</span>
            </h1>

            {/* Supporting Subtext */}
            <p className="max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              TrueTrace helps businesses and customers verify product authenticity and build transparent product journeys with tamper-proof cryptographic identity.
            </p>

            {/* CTA Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="primary"
                  isMagnetic
                  magneticStrength={0.25}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" isMagnetic magneticStrength={0.15}>
                  Explore Dashboard
                </Button>
              </Link>
            </div>

            {/* Micro Highlights Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 w-full max-w-lg">
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">99.9%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Detection Accuracy</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">&lt; 150ms</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Verification Latency</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">Zero Trust</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Cryptographic Seal</div>
              </div>
            </div>
          </div>

          {/* Right Column: Impressive Interactive Verification Mockup Visual */}
          <div className="lg:col-span-5 relative">
            {/* Background glowing halo */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-2xl dark:from-cyan-500/30 dark:to-purple-500/30 -z-10" />

            {/* Main Interactive Product Verification Card */}
            <div
              className="glass-card rounded-3xl p-6 relative overflow-hidden border border-slate-200/80 dark:border-cyan-500/30 shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              data-cursor="card"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Live Scan Simulator
                  </span>
                </div>
                <Badge variant="authentic" withIcon>
                  Authentic Verified
                </Badge>
              </div>

              {/* Product Preview Body */}
              <div className="mt-4 relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&auto=format&fit=crop&q=80"
                      alt="Aethel Tourbillon"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Luxury Timepiece
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      Aethel Chrono Tourbillon
                    </h4>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                      ID: TT-LUX-9941
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Zero Counterfeit Risk (99/100)</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Scanning Laser Bar */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#00F0FF] animate-scan-line" />
              </div>

              {/* Security Metrics Breakdown */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-cyan-400" />
                    Cryptographic Proof
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">RSA-4096 VALID</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-indigo-400" />
                    Custody Pipeline
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">6 of 6 Verified</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <QrCode className="h-3.5 w-3.5 text-purple-400" />
                    Dynamic QR Micro-Seal
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-medium">Active (Single Token)</span>
                </div>
              </div>

              {/* Floating Satellite Card 1: Origin Verified */}
              <div className="absolute -left-6 -bottom-4 glass-panel rounded-xl p-3 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 flex items-center gap-2.5 animate-float-slow">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white">Geneva Atelier</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Origin Certified</div>
                </div>
              </div>

              {/* Floating Satellite Card 2: Security Score */}
              <div className="absolute -right-4 top-8 glass-panel rounded-xl p-3 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 flex items-center gap-2.5 animate-float-slow [animation-delay:2s]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">99.9% Score</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Anti-Clone Shield</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
