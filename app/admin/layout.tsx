'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={['admin']} fallbackUrl="/dashboard">
      <div className="min-h-screen flex bg-slate-50/50 dark:bg-[#0B1220]">
        <DashboardSidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-64">
          <DashboardHeader onOpenMobileMenu={() => setIsMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
