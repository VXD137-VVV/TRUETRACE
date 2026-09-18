'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Eye, ShieldAlert, ArrowRight, Sparkles, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUserData } from '@/lib/data/user-data-context';
import { VerificationRecord } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function RecentVerificationsTable() {
  const router = useRouter();
  const { verifications } = useUserData();
  const [filter, setFilter] = useState<'all' | 'authentic' | 'suspicious' | 'failed' | 'not_found'>('all');
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);

  const filteredRecords = verifications.filter((rec) => {
    if (filter === 'all') return true;
    return rec.status === filter;
  });

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl">
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Verifications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time log of your personal product scan and verification events
          </p>
        </div>

        {verifications.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'authentic', 'suspicious', 'failed'] as const).map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => setFilter(statusKey)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-all ${
                  filter === statusKey
                    ? 'bg-cyan-500 text-white shadow-glow-cyan/30'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {statusKey}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* If No Verifications: Show Clean Empty State */}
      {verifications.length === 0 ? (
        <div className="pt-4">
          <EmptyState
            icon={QrCode}
            title="No verification activity yet"
            description="Your recent verification audits and scan telemetry will appear here in real time as you verify items."
            actionLabel="Verify Your First Product"
            actionIcon={<ShieldCheck className="h-4 w-4" />}
            onAction={() => router.push('/dashboard/verify')}
          />
        </div>
      ) : (
        /* Table of Records */
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Verification ID</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors group"
                >
                  <td className="py-3.5 px-3">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-500 transition-colors">
                        {rec.productName}
                      </div>
                      <div className="text-[10px] text-slate-500">{rec.brand}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      {rec.verificationId}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge status={rec.status} withIcon />
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 uppercase text-[10px] font-semibold">
                    {rec.method || 'Scanner'}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">{rec.scannedAt}</td>
                  <td className="py-3.5 px-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => setSelectedRecord(rec)}
                      leftIcon={<Eye className="h-3.5 w-3.5" />}
                    >
                      Audit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Inspection */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Audit Record: ${selectedRecord.verificationId}`}
          description={`Verified on ${selectedRecord.scannedAt}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedRecord.productName}
                </div>
                <div className="text-slate-500">{selectedRecord.brand}</div>
              </div>
              <Badge status={selectedRecord.status} withIcon />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Verification Method</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                  {selectedRecord.method}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Location Telemetry</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedRecord.location}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedRecord(null)}>
                Close Audit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
