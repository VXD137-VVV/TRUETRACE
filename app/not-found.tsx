'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/auth-context';

export default function NotFound() {
  const { user, role } = useAuth();
  const dashboardHref = role === 'admin' ? '/admin' : '/dashboard';

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-lg w-full border border-cyan-500/20 shadow-2xl space-y-6">
        
        {/* Glowing 404 Icon */}
        <div className="h-20 w-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 mx-auto shadow-glow-cyan/20">
          <ShieldAlert className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
            Error 404 • Ledger Node Missing
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The cryptographic route or record you are requesting could not be located in the TrueTrace network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full" leftIcon={<Home className="h-4 w-4" />}>
              Landing Page
            </Button>
          </Link>
          <Link href={dashboardHref} className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full" isMagnetic leftIcon={<LayoutDashboard className="h-4 w-4" />}>
              {role === 'admin' ? 'Admin Console' : 'Your Dashboard'}
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
