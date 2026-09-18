'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Top Bar with Back Link & Theme Toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
        
        {/* Left Side: Branding & Futuristic Visual */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left pr-0 lg:pr-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              True<span className="gradient-text">Trace</span>
            </span>
          </Link>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Trust starts with <span className="gradient-text">verification.</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Access your centralized enterprise portal to inspect product journeys, manage cryptographic tokens, and defend against supply-chain counterfeits.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 flex-shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <span>Decentralized Proof-of-Authenticity Protocol</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 flex-shrink-0">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <span>Real-time Geolocation Anomaly Detection</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 flex-shrink-0">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span>Zero-Knowledge Anti-Counterfeiting Ledger</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="lg:col-span-6 flex justify-center">
          <LoginForm />
        </div>

      </div>
    </div>
  );
}
