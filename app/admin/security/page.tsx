'use client';

import React from 'react';
import { Lock, Shield, Key, FileCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminSecurityPage() {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
          <Lock className="h-3.5 w-3.5" />
          <span>Cryptographic Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Security Administration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Root of Trust certificates, cryptographic signature policies, and threat isolation rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Master Genesis Key Status</h3>
              <p className="text-[11px] text-emerald-500 font-semibold">Active & Valid</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All tenant products are sealed with 256-bit elliptic-curve cryptography and rotated periodically.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] font-mono text-slate-600 dark:text-slate-300">
            FINGERPRINT: 4A8B:99F0:11C2:88E4:77A1:0021
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Anti-Replay Protection</h3>
              <p className="text-[11px] text-cyan-500 font-semibold">Enforced</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Duplicate QR attempts trigger anomaly detection scoring and mark conflicting tokens as suspicious.
          </p>
          <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => alert('Certificate authority refreshed.')}>
            Rotate Ephemeral Keys
          </Button>
        </div>
      </div>
    </div>
  );
}
