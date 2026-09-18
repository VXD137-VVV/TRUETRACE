'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle, Users, Package, Globe2 } from 'lucide-react';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { calculateGlobalAdminStats, getAllUsers, DATA_CHANGED_EVENT } from '@/lib/data/store';

export default function AdminGlobalAnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    totalVerifications: 0,
    flaggedVerifications: 0,
    verifiedProducts: 0,
    verificationRate: '0',
  });

  const loadData = () => {
    setStats(calculateGlobalAdminStats());
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Platform Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          System-Wide Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics aggregated across all active tenants and registered supply chains.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-500">Platform Tenants</span>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
            <AnimatedCounter value={stats.totalUsers} />
          </div>
          <div className="text-xs text-slate-500">{stats.activeUsers} active accounts</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-500">Total Products</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            <AnimatedCounter value={stats.totalProducts} />
          </div>
          <div className="text-xs text-slate-500">Across all registries</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-500">Global Scans</span>
          <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
            <AnimatedCounter value={stats.totalVerifications} />
          </div>
          <div className="text-xs text-slate-500">{stats.verifiedProducts} authentic</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2">
          <span className="text-xs font-semibold uppercase text-slate-500">System Accuracy</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            <AnimatedCounter
              value={parseFloat(stats.verificationRate)}
              decimals={stats.totalVerifications > 0 ? 1 : 0}
              suffix="%"
            />
          </div>
          <div className="text-xs text-slate-500">Global verification confidence</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Tenant Ratio Breakdown</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 flex justify-between">
              <span className="text-slate-500">Active Tenant Workspaces</span>
              <span className="font-bold">{stats.activeUsers}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 flex justify-between">
              <span className="text-slate-500">Average Assets Per Tenant</span>
              <span className="font-bold">
                {stats.totalUsers > 0 ? (stats.totalProducts / stats.totalUsers).toFixed(1) : '0'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Verification Threat Summary</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Authentic Proofs Issued</span>
              <span className="font-bold font-mono text-emerald-600">{stats.verifiedProducts}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex justify-between">
              <span className="font-semibold text-amber-700 dark:text-amber-300">Flagged Anomalies Intercepted</span>
              <span className="font-bold font-mono text-amber-600">{stats.flaggedVerifications}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
