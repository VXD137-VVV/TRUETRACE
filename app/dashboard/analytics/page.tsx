'use client';

import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle, Globe2, PieChart, Layers, ArrowUpRight, QrCode } from 'lucide-react';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUserData } from '@/lib/data/user-data-context';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();
  const { products, verifications, stats } = useUserData();

  const categoriesCount: Record<string, number> = {};
  products.forEach((p) => {
    categoriesCount[p.category] = (categoriesCount[p.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoriesCount).map(([category, count]) => ({
    category,
    count,
    percentage: products.length > 0 ? ((count / products.length) * 100).toFixed(1) : '0',
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Verification Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic metrics calculated from your personal product registry and verification activity.
          </p>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-500">Total Scans</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            <AnimatedCounter value={stats.totalAttempts} />
          </div>
          <div className="text-xs text-slate-500">Recorded in personal account</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-500">Authentic Passes</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            <AnimatedCounter value={stats.verifiedProducts} />
          </div>
          <div className="text-xs text-slate-500">Genuine cryptographic matches</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-500">Flagged / Not Found</span>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            <AnimatedCounter value={stats.flaggedProducts} />
          </div>
          <div className="text-xs text-slate-500">Anomalies & unregistered tokens</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-500">Verification Rate</span>
          <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
            <AnimatedCounter value={stats.verificationRate} decimals={stats.totalAttempts > 0 ? 1 : 0} suffix="%" />
          </div>
          <div className="text-xs text-slate-500">Overall confidence index</div>
        </div>
      </div>

      {/* Zero State if No Activity Yet */}
      {verifications.length === 0 && products.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Your analytics will appear here"
          description="Not enough verification data yet. As you add products and perform verification scans, live trend graphs and category distributions will calculate automatically."
          actionLabel="Verify a Product"
          actionIcon={<QrCode className="h-4 w-4" />}
          onAction={() => router.push('/dashboard/verify')}
        />
      ) : (
        /* Real Dynamic Analytics Distribution */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Categories Chart */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Registered Product Categories
              </h3>
              <p className="text-xs text-slate-500">Inventory proportion by product category</p>
            </div>

            {categoryData.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No products registered yet</p>
            ) : (
              <div className="space-y-4">
                {categoryData.map((cat) => (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.category}</span>
                      <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        {cat.count} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${cat.percentage}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification Status Breakdown */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Verification Verdict Breakdown
              </h3>
              <p className="text-xs text-slate-500">Audit results across all scans</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Authentic Passes</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{stats.verifiedProducts}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <span className="font-semibold text-amber-800 dark:text-amber-300">Flagged / Not Found</span>
                <span className="font-bold font-mono text-amber-600 dark:text-amber-400">{stats.flaggedProducts}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Total Scans Executed</span>
                <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{stats.totalAttempts}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
