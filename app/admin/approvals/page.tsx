'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeb3 } from '@/lib/web3/web3-context';
import {
  getAllGlobalProducts,
  adminUpdateProductApproval,
  fetchGlobalProductsFromServer,
  DATA_CHANGED_EVENT,
} from '@/lib/data/store';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Wallet,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminApprovalsPage() {
  const {
    account,
    shortAccount,
    isConnected,
    connectWallet,
    approveProductOnChain,
    networkName,
  } = useWeb3();

  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [processingSku, setProcessingSku] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<{ sku: string; txHash: string; type: 'approved' | 'rejected' } | null>(null);

  const loadData = async () => {
    // 1. Instant local render
    const localList = getAllGlobalProducts();
    if (localList.length > 0) setProducts(localList);
    // 2. Multi-device live server pull
    const serverList = await fetchGlobalProductsFromServer();
    if (serverList && serverList.length > 0) {
      setProducts(serverList);
    }
  };

  useEffect(() => {
    loadData();
    // Real-time synchronization across multiple systems/devices
    const timer = setInterval(loadData, 2500);
    window.addEventListener(DATA_CHANGED_EVENT, loadData);
    return () => {
      clearInterval(timer);
      window.removeEventListener(DATA_CHANGED_EVENT, loadData);
    };
  }, []);

  const handleApprove = async (prod: Product) => {
    if (!isConnected) {
      const addr = await connectWallet();
      if (!addr) return;
    }

    try {
      setProcessingSku(prod.sku);
      setActionSuccess(null);

      // Trigger MetaMask prompt to sign approval
      const result = await approveProductOnChain(
        prod.sku,
        true,
        'Site Admin Cryptographic Verification & Quality Compliance Passed'
      );

      if (result.success) {
        // Update product in global store with Admin wallet and Tx Hash
        adminUpdateProductApproval(
          prod.id,
          true,
          account || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          result.txHash,
          'Site Admin Cryptographic Approval verified and written to ledger.'
        );

        setActionSuccess({
          sku: prod.sku,
          txHash: result.txHash,
          type: 'approved',
        });

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });

        loadData();
      }
    } catch (err: any) {
      console.error('Admin approval failed:', err);
      alert(err.message || 'MetaMask transaction rejected or failed');
    } finally {
      setProcessingSku(null);
    }
  };

  const handleReject = async (prod: Product) => {
    if (!isConnected) {
      const addr = await connectWallet();
      if (!addr) return;
    }

    const reason = prompt('Please enter rejection audit remarks:', 'Failed cryptographic provenance check');
    if (reason === null) return;

    try {
      setProcessingSku(prod.sku);
      const result = await approveProductOnChain(prod.sku, false, reason);
      if (result.success) {
        adminUpdateProductApproval(
          prod.id,
          false,
          account || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          result.txHash,
          reason
        );
        setActionSuccess({
          sku: prod.sku,
          txHash: result.txHash,
          type: 'rejected',
        });
        loadData();
      }
    } catch (err: any) {
      alert(err.message || 'MetaMask signature rejected');
    } finally {
      setProcessingSku(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filter === 'pending') return p.onChainStatus === 'PENDING_APPROVAL';
    if (filter === 'approved') return p.onChainStatus === 'APPROVED';
    return true;
  });

  const pendingCount = products.filter((p) => p.onChainStatus === 'PENDING_APPROVAL').length;
  const approvedCount = products.filter((p) => p.onChainStatus === 'APPROVED').length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Site Admin On-Chain Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            Vendor Product Approvals & MetaMask Signatures
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review vendor submissions, sign cryptographic acceptance transactions through MetaMask, and anchor authenticity on the blockchain.
          </p>
        </div>

        {/* MetaMask Status Box */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="glass-card rounded-2xl px-4 py-2 border border-emerald-500/30 flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Admin Signer Connected</div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{shortAccount}</div>
              </div>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={connectWallet}
              leftIcon={<Wallet className="h-4 w-4 text-amber-300" />}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
            >
              Connect MetaMask as Admin
            </Button>
          )}

          <Link href="/supply-chain">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View Supply Chain Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-sm">
                Batch {actionSuccess.sku} successfully {actionSuccess.type} on Blockchain!
              </div>
              <div className="font-mono text-xs text-slate-500 dark:text-slate-400 break-all">
                MetaMask Signed Tx Hash: {actionSuccess.txHash}
              </div>
            </div>
          </div>
          <Link href={`/verify?sku=${actionSuccess.sku}`}>
            <Button variant="primary" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
              Verify Now
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-amber-500/20 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Pending Admin Approval</div>
            <div className="text-3xl font-extrabold text-amber-500 mt-1">{pendingCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Vendor batches requiring signature</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Approved Batches</div>
            <div className="text-3xl font-extrabold text-emerald-500 mt-1">{approvedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Verified on immutable ledger</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-purple-500/20 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Current Network</div>
            <div className="text-xl font-extrabold text-purple-500 mt-1">{networkName || 'Web3 Ready'}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">MetaMask integration active</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Layers className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All ({products.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'pending'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'approved'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Approved ({approvedCount})
        </button>
      </div>

      {/* Products Approvals Table / Grid */}
      <div className="space-y-4">
        {filteredProducts.map((prod) => {
          const isPending = prod.onChainStatus === 'PENDING_APPROVAL';
          const isApproved = prod.onChainStatus === 'APPROVED';
          const isProcessing = processingSku === prod.sku;

          return (
            <div
              key={prod.id}
              className={`glass-card rounded-2xl p-5 sm:p-6 border transition-all ${
                isPending
                  ? 'border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-500/5'
                  : isApproved
                  ? 'border-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Product Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-16 w-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{prod.name}</h3>
                      <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                        {prod.sku}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          isPending
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                            : isApproved
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                        }`}
                      >
                        {isPending ? '🟡 Pending Admin Acceptance' : isApproved ? '🟢 Approved on Ledger' : '🔴 Rejected'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{prod.description}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                      <span>Brand: <strong className="text-slate-700 dark:text-slate-300">{prod.brand}</strong></span>
                      <span>Origin: <strong className="text-slate-700 dark:text-slate-300">{prod.origin}</strong></span>
                      <span>Batch: <strong className="text-slate-700 dark:text-slate-300">{prod.batchNumber}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Blockchain Proofs & Hashes */}
                <div className="bg-slate-100/60 dark:bg-slate-900/60 rounded-xl p-3 text-xs space-y-1.5 lg:w-96 border border-slate-200/50 dark:border-slate-800/60 font-mono">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Vendor Wallet:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[200px]">
                      {prod.vendorWallet ? `${prod.vendorWallet.slice(0, 10)}...${prod.vendorWallet.slice(-6)}` : '0x71C...9B50'}
                    </span>
                  </div>

                  {prod.adminApproverWallet && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-emerald-500 font-semibold">Admin Approver:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">
                        {prod.adminApproverWallet.slice(0, 10)}...{prod.adminApproverWallet.slice(-6)}
                      </span>
                    </div>
                  )}

                  {prod.approvalTxHash && (
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-purple-400">Approval Tx:</span>
                      <span className="text-purple-600 dark:text-purple-400 truncate max-w-[200px]">
                        {prod.approvalTxHash.slice(0, 14)}...
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {isPending ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isProcessing}
                        onClick={() => handleApprove(prod)}
                        leftIcon={<Check className="h-4 w-4" />}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20"
                      >
                        Accept & Sign (MetaMask)
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => handleReject(prod)}
                        leftIcon={<XCircle className="h-4 w-4" />}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link href={`/verify?sku=${prod.sku}`}>
                        <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                          Verify Provenance
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
