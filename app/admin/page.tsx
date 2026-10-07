'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { calculateGlobalAdminStats, getAllUsers, DATA_CHANGED_EVENT } from '@/lib/data/store';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  Users,
  Package,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  ArrowUpRight,
  Sparkles,
  Lock,
  Plus,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const rawUsername = user?.username || 'Alex';
  const uppercaseUsername = rawUsername.toUpperCase();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    totalVerifications: 0,
    flaggedVerifications: 0,
    verifiedProducts: 0,
    verificationRate: '0',
  });

  const [usersList, setUsersList] = useState<any[]>([]);

  const loadAdminData = () => {
    const s = calculateGlobalAdminStats();
    setStats(s);
    setUsersList(getAllUsers());
  };

  useEffect(() => {
    loadAdminData();

    const handleDataChange = () => {
      loadAdminData();
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Admin Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
            <Shield className="h-3.5 w-3.5" />
            <span>Master Administrative Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            WELCOME TO TRUETRACE, ADMIN{' '}
            <span className="gradient-text">{uppercaseUsername}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global multi-tenant system overview, platform controls, and user directory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/approvals">
            <Button variant="primary" size="sm" isMagnetic leftIcon={<ShieldCheck className="h-4 w-4" />} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold">
              Vendor Approvals (MetaMask)
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="secondary" size="sm" leftIcon={<Users className="h-4 w-4" />}>
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="secondary" size="sm" leftIcon={<Sliders className="h-4 w-4" />}>
              Platform Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Global KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 space-y-2 border border-purple-500/20 shadow-glow-purple/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Total Registered Users</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            <AnimatedCounter value={stats.totalUsers} />
          </div>
          <div className="text-xs text-slate-500">
            {stats.activeUsers} active accounts
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Global Products</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            <AnimatedCounter value={stats.totalProducts} />
          </div>
          <div className="text-xs text-slate-500">Across all user accounts</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Total Verifications</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            <AnimatedCounter value={stats.totalVerifications} />
          </div>
          <div className="text-xs text-slate-500">{stats.verifiedProducts} authentic verified</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Flagged Anomaly Scans</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            <AnimatedCounter value={stats.flaggedVerifications} />
          </div>
          <div className="text-xs text-slate-500">Global anomaly count</div>
        </div>
      </div>

      {/* Quick Admin Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/admin/approvals"
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/40 transition-all duration-300 group space-y-3 bg-gradient-to-b from-purple-500/5 to-transparent"
          data-cursor="card"
        >
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors flex items-center justify-between">
            <span>MetaMask Approvals</span>
            <ArrowUpRight className="h-4 w-4 text-purple-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Review vendor batches, sign cryptographic approvals via MetaMask, and anchor records on-chain.
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/40 transition-all duration-300 group space-y-3"
          data-cursor="card"
        >
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors flex items-center justify-between">
            <span>User Management</span>
            <ArrowUpRight className="h-4 w-4 text-purple-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Create users, modify account statuses, assign roles (User ↔ Admin), and manage access privileges.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group space-y-3"
          data-cursor="card"
        >
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sliders className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors flex items-center justify-between">
            <span>Platform Configuration</span>
            <ArrowUpRight className="h-4 w-4 text-cyan-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Toggle public registration, configure UI cursor animations, manage themes, and adjust security timeouts.
          </p>
        </Link>

        <Link
          href="/admin/security"
          className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group space-y-3"
          data-cursor="card"
        >
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors flex items-center justify-between">
            <span>Security Governance</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Review Root of Trust certificates, audit cryptographic enforcement, and monitor threat intercepts.
          </p>
        </Link>
      </div>

      {/* User Directory Preview */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active User Accounts</h3>
            <p className="text-xs text-slate-500">Recent registered tenants on TrueTrace Platform</p>
          </div>
          <Link href="/admin/users">
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
              View All ({usersList.length})
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Username</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">{u.username}</td>
                  <td className="py-3.5 px-3 text-slate-500">{u.email}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        u.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-500 border-purple-500/30'
                          : 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {u.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">{u.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
