'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Menu,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/lib/auth/auth-context';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: HeaderProps) {
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const username = user?.username || 'Alex';
  const isAdmin = role === 'admin';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#101827]/85 px-4 sm:px-6 backdrop-blur-xl transition-colors">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={isAdmin ? 'Search users, platform logs, products... (⌘K)' : 'Search your products, verification IDs... (⌘K)'}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 py-2 pl-9 pr-12 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle className="hidden sm:inline-flex" />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
            </span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#151F32]/95 p-4 shadow-2xl backdrop-blur-xl animate-scaleIn z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Notifications
                </span>
                <span className="text-[10px] text-slate-500">Live Status</span>
              </div>
              <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                All systems synchronized and operational.
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 sm:px-3 sm:py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-xs ${
              isAdmin ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-gradient-to-tr from-cyan-500 to-blue-600'
            }`}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {username}
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                  isAdmin ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                }`}>
                  {isAdmin ? 'ADMIN' : 'USER'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate max-w-[130px]">
                {user?.email}
              </span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#151F32]/95 p-2 shadow-2xl backdrop-blur-xl animate-scaleIn z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{username}</span>
                  <span className="text-[9px] uppercase font-bold text-cyan-500">{role}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>
              <div className="mt-1 space-y-0.5">
                {isAdmin ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Shield className="h-3.5 w-3.5 text-purple-500" />
                      <span>Admin Overview</span>
                    </Link>
                    <Link
                      href="/admin/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Platform Settings</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Profile & Settings</span>
                    </Link>
                  </>
                )}

                <button
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
