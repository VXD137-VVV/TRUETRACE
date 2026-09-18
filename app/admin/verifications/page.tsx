'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Download, Eye, AlertTriangle, User } from 'lucide-react';
import { getAllUsers, getUserData, DATA_CHANGED_EVENT } from '@/lib/data/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminGlobalVerificationsPage() {
  const [allVerifs, setAllVerifs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadData = () => {
    const users = getAllUsers();
    const verifs: any[] = [];
    users.forEach((u) => {
      const data = getUserData(u.id);
      data.verifications.forEach((v) => {
        verifs.push({
          ...v,
          scannedByUsername: u.username,
          scannedByEmail: u.email,
        });
      });
    });
    setAllVerifs(verifs);
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
  }, []);

  const filtered = allVerifs.filter((v) => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesSearch =
      v.productName.toLowerCase().includes(search.toLowerCase()) ||
      v.verificationId.toLowerCase().includes(search.toLowerCase()) ||
      v.scannedByUsername.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Global Threat Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            System-Wide Verification Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Aggregated audit trail of all optical scans, image uploads, and serial validations across all tenants.
          </p>
        </div>

        {allVerifs.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => alert('Exporting platform audit log...')}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export Global Log
          </Button>
        )}
      </div>

      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, product, user..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'authentic', 'not_found', 'suspicious'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-glow-purple/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
              }`}
            >
              {st === 'not_found' ? 'Not Found' : st}
            </button>
          ))}
        </div>
      </div>

      {allVerifs.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-xs text-slate-500 space-y-2">
          <ShieldCheck className="h-10 w-10 text-slate-400 mx-auto" />
          <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No platform verification events recorded</p>
          <p>Scans performed by tenants will be automatically aggregated and indexed here.</p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Verification Token / ID</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Verdict</th>
                  <th className="py-3.5 px-4">Executed By</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                      {v.verificationId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {v.productName}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={v.status} withIcon />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{v.scannedByUsername}</span>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] text-slate-500 font-semibold">
                      {v.method}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{v.scannedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
