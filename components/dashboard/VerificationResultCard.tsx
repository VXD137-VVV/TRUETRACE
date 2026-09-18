'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Lock,
  Activity,
  ArrowRight,
  RotateCcw,
  FileCheck,
  ExternalLink,
  MapPin,
  Calendar,
  Building2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';

interface VerificationResultProps {
  result: {
    id: string;
    title: string;
    category: string;
    brand: string;
    status: 'authentic' | 'suspicious' | 'failed';
    manufacturer: string;
    batch: string;
    manufacturedDate: string;
    originLocation: string;
    currentLocation: string;
    securityScore: number;
    signature: string;
    confidence: string;
    summary: string;
    details: { label: string; value: string; status: string }[];
  };
  onReset: () => void;
}

export function VerificationResultCard({ result, onReset }: VerificationResultProps) {
  useEffect(() => {
    if (result.status === 'authentic') {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#6366F1', '#10B981', '#9D00FF'],
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [result]);

  const isAuthentic = result.status === 'authentic';
  const isSuspicious = result.status === 'suspicious';
  const isFailed = result.status === 'failed';

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl animate-scaleIn max-w-3xl mx-auto">
      
      {/* Top Banner Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
              isAuthentic
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/20'
                : isSuspicious
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-amber-500/20'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-rose-500/20'
            }`}
          >
            {isAuthentic ? (
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            ) : isSuspicious ? (
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            ) : (
              <XCircle className="h-8 w-8 text-rose-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isAuthentic
                  ? 'Genuine Product Verified'
                  : isSuspicious
                  ? 'Suspicious Activity Detected'
                  : 'Verification Check Failed'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Protocol Token: <span className="font-mono font-semibold">{result.id}</span>
            </p>
          </div>
        </div>

        <Badge status={result.status} withIcon className="text-sm px-3 py-1 self-start sm:self-auto" />
      </div>

      {/* Summary Alert */}
      <div
        className={`mt-6 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
          isAuthentic
            ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30'
            : isSuspicious
            ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/30'
            : 'bg-rose-500/10 text-rose-900 dark:text-rose-300 border border-rose-500/30'
        }`}
      >
        {result.summary}
      </div>

      {/* Product Metadata Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Product Profile
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{result.title}</div>
          <div className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-cyan-500" />
            <span>{result.brand}</span>
          </div>
          <div className="text-slate-500 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
            <span>Manufactured: {result.manufacturedDate}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Trust & Security Metrics
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-slate-500">Security Score</span>
            <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400">
              {result.securityScore} / 100
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-slate-500">Confidence Tier</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{result.confidence}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-slate-500">Origin Node</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
              {result.originLocation}
            </span>
          </div>
        </div>
      </div>

      {/* Cryptographic Proof & Details */}
      <div className="mt-6 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Cryptographic Integrity Audit
        </h4>
        <div className="space-y-2">
          {result.details.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 text-xs"
            >
              <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
              <span
                className={`font-semibold ${
                  item.status === 'success'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : item.status === 'warning'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Fingerprint */}
      <div className="mt-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-cyan-400" />
          Ledger Signature:
        </span>
        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
          {result.signature}
        </span>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" size="md" onClick={onReset} leftIcon={<RotateCcw className="h-4 w-4" />}>
          Verify Another Product
        </Button>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/products/prod-001">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View Complete Supply Chain Journey
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
