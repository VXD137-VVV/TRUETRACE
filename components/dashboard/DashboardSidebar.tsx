'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  History,
  GitBranch,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
  Sliders,
  Lock,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function DashboardSidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = role === 'admin';

  const userNavItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/dashboard/products', icon: Package },
    { label: 'Verify Product', href: '/dashboard/verify', icon: ShieldCheck, badge: 'Live' },
    { label: 'Blockchain Ledger', href: '/dashboard/blockchain', icon: Cpu, badge: 'SHA-256' },
    { label: 'Scan History', href: '/dashboard/history', icon: History },
    { label: 'Supply Chain', href: '/dashboard/supply-chain', icon: GitBranch },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminNavItems = [
    { label: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'User Management', href: '/admin/users', icon: Users, badge: 'Master' },
    { label: 'Blockchain Ledger', href: '/admin/blockchain', icon: Cpu, badge: 'Consensus' },
    { label: 'Global Products', href: '/admin/products', icon: Package },
    { label: 'Verification Logs', href: '/admin/verifications', icon: ShieldCheck },
    { label: 'Supply Chain', href: '/dashboard/supply-chain', icon: GitBranch },
    { label: 'Platform Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Platform Settings', href: '/admin/settings', icon: Sliders },
    { label: 'Security Admin', href: '/admin/security', icon: Lock },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const username = user?.username || 'User';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0B1220]/95 backdrop-blur-xl transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Logo & Role Badge */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 overflow-hidden">
            <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-md ${
              isAdmin ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-gradient-to-tr from-cyan-500 to-blue-600'
            }`}>
              {isAdmin ? <Shield className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  True<span className="gradient-text">Trace</span>
                </span>
                <span className={`text-[9px] font-extrabold uppercase tracking-widest ${
                  isAdmin ? 'text-purple-500' : 'text-cyan-500'
                }`}>
                  {isAdmin ? 'ADMIN CONSOLE' : 'USER WORKSPACE'}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-2.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 select-none',
                  isActive
                    ? isAdmin
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold shadow-sm border border-purple-500/30'
                      : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold shadow-sm border border-cyan-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full shadow-[0_0_8px] ${
                    isAdmin ? 'bg-purple-400 shadow-purple-500' : 'bg-cyan-400 shadow-cyan-500'
                  }`} />
                )}
                <Icon
                  className={cn(
                    'h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110',
                    isActive
                      ? isAdmin ? 'text-purple-500' : 'text-cyan-500'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  )}
                />
                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        isAdmin ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Bar: Theme & User Info */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 p-3 space-y-2">
          {!isCollapsed ? (
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <ThemeToggle />
            </div>
          )}

          <div
            className={cn(
              'flex items-center gap-3 rounded-xl p-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800',
              isCollapsed && 'justify-center p-1.5'
            )}
          >
            <div className={`relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ${
              isAdmin ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-gradient-to-tr from-cyan-500 to-blue-600'
            }`}>
              {username.charAt(0).toUpperCase()}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {username}
                </div>
                <div className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 truncate uppercase">
                  {role || 'user'}
                </div>
              </div>
            )}

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
