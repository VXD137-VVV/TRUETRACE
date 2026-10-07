'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/lib/web3/web3-context';
import { getAllGlobalProducts, fetchGlobalProductsFromServer, DATA_CHANGED_EVENT } from '@/lib/data/store';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Truck,
  UserCheck,
  QrCode,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Search,
  Check,
  Send,
  Building2,
} from 'lucide-react';

export default function SupplyChainMappingPage() {
  const { account, isConnected, connectWallet } = useWeb3();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSku, setSelectedSku] = useState<string>('TT-LUX-9941');

  const syncData = async () => {
    const list = await fetchGlobalProductsFromServer();
    if (list && list.length > 0) {
      setProducts(list);
    }
  };

  useEffect(() => {
    const initialList = getAllGlobalProducts();
    setProducts(initialList);
    if (initialList.length > 0 && !initialList.find((p) => p.sku === selectedSku)) {
      setSelectedSku(initialList[0].sku);
    }

    syncData();
    const interval = setInterval(syncData, 2500);
    window.addEventListener(DATA_CHANGED_EVENT, syncData);
    return () => {
      clearInterval(interval);
      window.removeEventListener(DATA_CHANGED_EVENT, syncData);
    };
  }, []);

  const activeProduct = products.find((p) => p.sku === selectedSku) || products[0];

  const isApproved = activeProduct?.onChainStatus === 'APPROVED';
  const isPending = activeProduct?.onChainStatus === 'PENDING_APPROVAL';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            <Layers className="h-4 w-4" />
            <span>End-to-End Cryptographic Provenance Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            TrueTrace Supply Chain Lifecycle Mapping
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            A transparent mapping from <strong>Vendor Genesis</strong> to <strong>Site Admin MetaMask Acceptance</strong>, transit custody handoffs, and <strong>Consumer Verification</strong>.
          </p>
        </div>

        {/* Product Selector Bar */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase">Select Tracked Batch:</span>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {products.map((p) => (
                <option key={p.sku} value={p.sku}>
                  {p.sku} — {p.name} ({p.onChainStatus || 'APPROVED'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/approvals">
              <Button variant="primary" size="sm" leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}>
                Go to Site Admin Approvals
              </Button>
            </Link>
            <Link href={`/verify?sku=${selectedSku}`}>
              <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                Public Verification Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* 4-Step Interactive Supply Chain Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1: Vendor Creation */}
          <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 relative flex flex-col justify-between space-y-4 shadow-lg shadow-cyan-500/5 bg-gradient-to-b from-cyan-500/5 to-transparent">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="h-8 w-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Genesis
                </span>
              </div>

              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm mb-1">
                <Building2 className="h-4 w-4" />
                <span>Vendor Registration</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Vendor signs product batch creation via MetaMask. Generates immutable Genesis record.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] font-mono space-y-1">
                <div className="text-slate-400">Vendor Signer:</div>
                <div className="text-slate-800 dark:text-slate-200 font-bold truncate">
                  {activeProduct?.vendorWallet || '0x71C8364...9B50'}
                </div>
                <div className="text-slate-400 pt-1">Genesis Tx:</div>
                <div className="text-cyan-600 dark:text-cyan-400 truncate">
                  {activeProduct?.creationTxHash?.slice(0, 16) || '0x8f7a93b4...'}...
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-xs pt-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Genesis Confirmed</span>
            </div>
          </div>

          {/* Step 2: Site Admin Acception */}
          <div
            className={`glass-card rounded-3xl p-6 border relative flex flex-col justify-between space-y-4 shadow-lg transition-all ${
              isApproved
                ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent shadow-emerald-500/5'
                : 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-transparent shadow-amber-500/5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isApproved ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                  }`}
                >
                  2
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isApproved
                      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
                      : 'text-amber-500 bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  {isApproved ? 'MetaMask Approved' : 'Pending Action'}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 font-bold text-sm mb-1 ${
                  isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Site Admin Acception</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Site Admin inspects quality, executes cryptographic verification, and signs acceptance via MetaMask.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] font-mono space-y-1">
                <div className="text-slate-400">Admin Authority:</div>
                <div className="text-slate-800 dark:text-slate-200 font-bold truncate">
                  {activeProduct?.adminApproverWallet || 'Awaiting Admin Wallet'}
                </div>
                <div className="text-slate-400 pt-1">Approval Tx:</div>
                <div className="text-emerald-600 dark:text-emerald-400 truncate">
                  {activeProduct?.approvalTxHash ? `${activeProduct.approvalTxHash.slice(0, 16)}...` : 'Pending Signature'}
                </div>
              </div>
            </div>

            {isApproved ? (
              <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-xs pt-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Admin Accepted (On-Chain)</span>
              </div>
            ) : (
              <Link href="/admin/approvals">
                <Button variant="primary" size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold">
                  Sign in Admin Portal
                </Button>
              </Link>
            )}
          </div>

          {/* Step 3: Transit & Custody */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 relative flex flex-col justify-between space-y-4 shadow-lg bg-gradient-to-b from-indigo-500/5 to-transparent">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Custody
                </span>
              </div>

              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
                <Truck className="h-4 w-4" />
                <span>Logistics & Custody</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Carrier handoffs and cold-chain checkpoints are cryptographically timestamped and audited.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] font-mono space-y-1">
                <div className="text-slate-400">Current Location:</div>
                <div className="text-slate-800 dark:text-slate-200 font-bold truncate">
                  {activeProduct?.currentLocation || 'Central Distribution Vault'}
                </div>
                <div className="text-slate-400 pt-1">Condition:</div>
                <div className="text-indigo-500 font-bold">Tamper-Proof Sealed</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-indigo-500 font-semibold text-xs pt-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Custody Verified</span>
            </div>
          </div>

          {/* Step 4: Public Verification */}
          <div className="glass-card rounded-3xl p-6 border border-purple-500/30 relative flex flex-col justify-between space-y-4 shadow-lg bg-gradient-to-b from-purple-500/10 to-transparent">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-sm">
                  4
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Consumer
                </span>
              </div>

              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm mb-1">
                <QrCode className="h-4 w-4" />
                <span>Public Verification</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Consumer or retailer scans QR code to verify entire chain of trust directly from the smart contract.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] font-mono space-y-1">
                <div className="text-slate-400">Authenticity Score:</div>
                <div className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">
                  {activeProduct?.securityScore || 99}% Genuine
                </div>
                <div className="text-slate-400 pt-1">Smart Contract:</div>
                <div className="text-slate-800 dark:text-slate-200 font-mono truncate text-[10px]">
                  0x5FbDB...80aa3
                </div>
              </div>
            </div>

            <Link href={`/verify?sku=${activeProduct?.sku}`}>
              <Button variant="primary" size="sm" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold">
                Run Live Verification
              </Button>
            </Link>
          </div>
        </div>

        {/* Selected Product Journey Timeline Preview */}
        {activeProduct && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Detailed Cryptographic Trail:</span>
                  <span className="text-cyan-500 font-mono">{activeProduct.name}</span>
                </h3>
                <p className="text-xs text-slate-500">Immutable ledger events registered for SKU: {activeProduct.sku}</p>
              </div>

              <img
                src={activeProduct.qrCodeUrl}
                alt="Batch QR Code"
                className="h-16 w-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1"
              />
            </div>

            <div className="space-y-4">
              {activeProduct.timeline.map((step, idx) => (
                <div key={step.id || idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
                  <div className="h-8 w-8 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h4>
                      <span className="text-xs text-slate-400 font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500">{step.notes}</p>
                    <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 pt-1">
                      Validated By: {step.handler}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
