'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/lib/types';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackUrl?: string;
}

export function RoleGuard({ children, allowedRoles, fallbackUrl }: RoleGuardProps) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Not authenticated or role not allowed
  if (!user || !role || !allowedRoles.includes(role)) {
    const destination = fallbackUrl || (role === 'admin' ? '/admin' : '/dashboard');

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-scaleIn">
        <div className="h-16 w-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-6 shadow-glow-rose/20">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Access Denied
        </h1>
        
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
          You do not have administrative privileges to access this area. Your current role is{' '}
          <span className="font-semibold uppercase text-cyan-600 dark:text-cyan-400">
            {role || 'Guest'}
          </span>.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Link href={destination}>
            <Button variant="primary" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Return to Your Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="md">
              Switch Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
