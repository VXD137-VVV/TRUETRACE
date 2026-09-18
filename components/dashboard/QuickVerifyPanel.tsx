'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QrCode, Search, ShieldCheck, ArrowRight, Sparkles, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';

export function QuickVerifyPanel() {
  const router = useRouter();
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [quickId, setQuickId] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickId.trim()) {
      router.push(`/dashboard/verify?id=${encodeURIComponent(quickId.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-cyan-500/20 dark:border-cyan-500/30 shadow-xl bg-gradient-to-r from-cyan-500/5 via-indigo-500/5 to-purple-500/5">
      <div className="absolute right-0 top-0 h-48 w-48 bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        
        {/* Left text */}
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            <Sparkles className="h-3 w-3" />
            <span>Instant Validation Console</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verify a Product
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Scan physical micro-QR codes, upload a QR image, or enter a product serial ID to check authenticity against your inventory.
          </p>
        </div>

        {/* Right CTA Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/verify?mode=scan">
            <Button
              variant="primary"
              size="md"
              leftIcon={<QrCode className="h-4 w-4" />}
              isMagnetic
            >
              Scan QR Code
            </Button>
          </Link>

          <Link href="/dashboard/verify?mode=upload">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<UploadCloud className="h-4 w-4 text-cyan-500" />}
              isMagnetic
            >
              Upload QR Code
            </Button>
          </Link>

          <Button
            variant="outline"
            size="md"
            leftIcon={<Search className="h-4 w-4" />}
            onClick={() => setIsInputModalOpen(true)}
            isMagnetic
          >
            Enter ID
          </Button>
        </div>
      </div>

      {/* Quick Input Modal */}
      <Modal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        title="Enter Product Verification ID"
        description="Verify authenticity and provenance certificate against registered assets"
      >
        <form onSubmit={handleQuickSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Verification Serial ID
            </label>
            <input
              type="text"
              value={quickId}
              onChange={(e) => setQuickId(e.target.value)}
              placeholder="e.g. TT-LUX-9941, TT-ELEC-4420"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsInputModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Proceed to Verify
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
