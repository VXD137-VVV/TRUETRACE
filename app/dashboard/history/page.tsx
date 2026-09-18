'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  Search,
  Filter,
  Download,
  Eye,
  ShieldCheck,
  Calendar,
  MapPin,
  Smartphone,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUserData } from '@/lib/data/user-data-context';
import { ScanHistoryItem } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function ScanHistoryPage() {
  const router = useRouter();
  const { scanHistory } = useUserData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'authentic' | 'suspicious' | 'failed' | 'not_found'>('all');
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);

  const filteredLogs = scanHistory.filter((rec) => {
    const matchesStatus = statusFilter === 'all' || rec.result === statusFilter;
    const matchesSearch =
      rec.scanCode.toLowerCase().includes(search.toLowerCase()) ||
      (rec.productName && rec.productName.toLowerCase().includes(search.toLowerCase())) ||
      (rec.details && rec.details.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    alert('Scan history CSV exported (Simulated)');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Verification Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chronological audit log of all scans performed in your account.
          </p>
        </div>

        {scanHistory.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={exportCSV}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export CSV
          </Button>
        )}
      </div>

      {/* Filter and Search */}
      {scanHistory.length > 0 && (
        <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU, product name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {(['all', 'authentic', 'not_found', 'suspicious'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-cyan-500 text-white shadow-glow-cyan/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'not_found' ? 'Not Found' : st}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History Records or Empty State */}
      {scanHistory.length === 0 ? (
        <EmptyState
          icon={History}
          title="No scans yet"
          description="Your scan history is currently empty. Each time you scan or upload a QR code, an immutable timestamped log will be recorded here."
          actionLabel="Start Verifying Products"
          actionIcon={<QrCode className="h-4 w-4" />}
          onAction={() => router.push('/dashboard/verify')}
        />
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Scanned Token / SKU</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Result Verdict</th>
                  <th className="py-3.5 px-4">Scan Method</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                      {log.scanCode}
                    </td>
                    <td className="py-3.5 px-4">
                      {log.productName ? (
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{log.productName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unregistered Asset</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={log.result} withIcon />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 uppercase text-[10px] font-semibold">
                      {log.method}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {log.date} at {log.time}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setSelectedScan(log)}
                        leftIcon={<Eye className="h-3.5 w-3.5" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Detail Modal */}
      {selectedScan && (
        <Modal
          isOpen={!!selectedScan}
          onClose={() => setSelectedScan(null)}
          title={`Scan Audit Log: ${selectedScan.scanCode}`}
          description={`Recorded on ${selectedScan.date} at ${selectedScan.time}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedScan.productName || selectedScan.scanCode}
                </div>
                <div className="text-slate-500 font-mono text-[11px]">{selectedScan.scanCode}</div>
              </div>
              <Badge status={selectedScan.result} withIcon />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-500 block">Scan Method & Account:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                {selectedScan.method} • Operator: {selectedScan.username}
              </span>
              <p className="text-slate-500 mt-1">{selectedScan.details}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelectedScan(null)}>
                Close Log
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
