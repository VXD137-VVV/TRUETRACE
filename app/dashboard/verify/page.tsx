'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Camera,
  UploadCloud,
  Loader2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ExternalLink,
  Clock,
  Building2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QrScannerMock } from '@/components/dashboard/QrScannerMock';
import { QrUploadMock } from '@/components/dashboard/QrUploadMock';
import { useUserData } from '@/lib/data/user-data-context';
import { useAuth } from '@/lib/auth/auth-context';
import { getAllGlobalProducts, fetchGlobalProductsFromServer } from '@/lib/data/store';
import confetti from 'canvas-confetti';
import Link from 'next/link';

function extractCleanCode(input: string): string {
  if (!input) return '';
  let s = input.trim();
  if (s.includes('/verify/')) {
    s = s.split('/verify/')[1];
  } else if (s.includes('?id=')) {
    s = s.split('?id=')[1];
  } else if (s.includes('?sku=')) {
    s = s.split('?sku=')[1];
  } else if (s.includes('/')) {
    const parts = s.split('/');
    s = parts[parts.length - 1];
  }
  s = s.split('?')[0].split('&')[0].replace(/\/+$/, '');
  return s.trim().toUpperCase();
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get('id') || searchParams.get('sku') || '';
  const initialId = extractCleanCode(rawId);
  const initialMode = searchParams.get('mode') === 'upload' ? 'upload' : searchParams.get('mode') === 'scan' ? 'scan' : 'input';

  const { products, recordVerification, recordScanHistory, findProductBySkuOrId } = useUserData();
  const { user } = useAuth();

  const [mode, setMode] = useState<'input' | 'scan' | 'upload'>(initialMode);
  const [inputCode, setInputCode] = useState(initialId);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [allBatches, setAllBatches] = useState<any[]>([]);

  const loadBatches = async () => {
    try {
      const serverList = await fetchGlobalProductsFromServer();
      if (serverList && serverList.length > 0) {
        setAllBatches(serverList);
        return serverList;
      }
    } catch (e) {}
    const local = getAllGlobalProducts();
    setAllBatches(local);
    return local;
  };

  useEffect(() => {
    loadBatches();
    if (initialId) {
      handleVerification(initialId, 'manual');
    }
  }, [initialId]);

  const handleVerification = async (codeToVerify: string, method: 'camera' | 'upload' | 'manual' = 'manual') => {
    const clean = extractCleanCode(codeToVerify);
    if (!clean) return;

    setIsVerifying(true);
    setResult(null);

    try {
      // 1. First, call central API verification endpoint (checks ledger & records audit block)
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: clean,
          method,
          user: user ? { id: user.id, username: user.username } : undefined,
        }),
      });

      const json = await res.json();

      if (json.success && json.product) {
        const p = json.product;
        const isApproved = p.onChainStatus === 'APPROVED';

        recordVerification({
          productId: p.id,
          productName: p.name,
          brand: p.brand,
          category: p.category,
          verificationId: p.sku,
          status: 'authentic',
          location: 'TrueTrace Decentralized Node',
          scannedBy: user?.username || 'Authorized User',
          deviceType: method === 'camera' ? 'TrueTrace Optical Scanner' : method === 'upload' ? 'QR File Processor' : 'Web Terminal',
          ipAddress: '127.0.0.1 (Local Session)',
          anomalyScore: 0,
          method,
          riskFactors: ['Valid digital passport signature matched in ledger'],
        });

        recordScanHistory({
          scanCode: p.sku,
          result: 'authentic',
          method,
          productId: p.id,
          productName: p.name,
          details: 'Matched authentic product in TrueTrace blockchain ledger',
        });

        setResult({
          status: 'authentic',
          title: p.name,
          sku: p.sku,
          category: p.category,
          brand: p.brand,
          manufacturer: p.manufacturer,
          origin: p.origin,
          manufacturedDate: p.manufacturingDate,
          securityScore: p.securityScore || 99,
          onChainStatus: p.onChainStatus || 'APPROVED',
          adminApproverWallet: p.adminApproverWallet,
          approvalTxHash: p.approvalTxHash,
          creationTxHash: p.creationTxHash,
          vendorWallet: p.vendorWallet,
          summary: isApproved
            ? '✓ AUTHENTIC PRODUCT — Site Admin Cryptographically Approved via MetaMask signature.'
            : '🟡 VENDOR REGISTERED — Awaiting Site Admin Cryptographic Approval.',
          productId: p.id,
          method,
          blockchainProof: json.blockchainProof,
        });

        if (isApproved) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#38BDF8', '#5B8CFF', '#34D399', '#8B7CFF'],
            });
          } catch (e) {}
        }
        setIsVerifying(false);
        return;
      }
    } catch (e) {
      console.warn('API verify fallback to client store:', e);
    }

    // 2. Client-side fallback if server was temporarily unreachable
    const batches = allBatches.length > 0 ? allBatches : getAllGlobalProducts();
    let matchedProduct = batches.find(
      (p) =>
        p.sku.toUpperCase() === clean ||
        p.id.toUpperCase() === clean ||
        p.sku.toUpperCase().includes(clean) ||
        clean.includes(p.sku.toUpperCase()) ||
        p.name.toUpperCase().includes(clean)
    );

    if (!matchedProduct) {
      matchedProduct = findProductBySkuOrId(clean);
    }

    if (matchedProduct) {
      const isApproved = matchedProduct.onChainStatus === 'APPROVED';
      setResult({
        status: 'authentic',
        title: matchedProduct.name,
        sku: matchedProduct.sku,
        category: matchedProduct.category,
        brand: matchedProduct.brand,
        manufacturer: matchedProduct.manufacturer,
        origin: matchedProduct.origin,
        manufacturedDate: matchedProduct.manufacturingDate,
        securityScore: matchedProduct.securityScore || 99,
        onChainStatus: matchedProduct.onChainStatus || 'APPROVED',
        adminApproverWallet: matchedProduct.adminApproverWallet,
        approvalTxHash: matchedProduct.approvalTxHash,
        creationTxHash: matchedProduct.creationTxHash,
        vendorWallet: matchedProduct.vendorWallet,
        summary: isApproved
          ? '✓ AUTHENTIC PRODUCT — Site Admin Cryptographically Approved via MetaMask signature.'
          : '🟡 VENDOR REGISTERED — Awaiting Site Admin Cryptographic Approval.',
        productId: matchedProduct.id,
        method,
      });

      if (isApproved) {
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } else {
      setResult({
        status: 'not_found',
        title: 'Product Not Found in Ledger',
        sku: clean,
        category: 'Unregistered',
        brand: 'Unknown',
        manufacturer: 'Unrecognized Origin',
        origin: 'Unknown',
        manufacturedDate: 'N/A',
        securityScore: 0,
        summary: '⚠ PRODUCT NOT FOUND — This QR code or serial ID is not associated with a registered product on the blockchain.',
        method,
      });
    }

    setIsVerifying(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerification(inputCode, 'manual');
  };

  const isApproved = result?.onChainStatus === 'APPROVED';
  const isPending = result?.onChainStatus === 'PENDING_APPROVAL';

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>TrueTrace Verification Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Verify Product Authenticity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Scan with optical camera, upload a QR code image, or enter a serial ID to verify against the decentralized cryptographic ledger.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      {!result && (
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-1.5 backdrop-blur-md shadow-sm">
            <button
              onClick={() => setMode('input')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                mode === 'input'
                  ? 'bg-cyan-500 text-white shadow-glow-cyan/20'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Enter ID</span>
            </button>
            <button
              onClick={() => setMode('scan')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                mode === 'scan'
                  ? 'bg-cyan-500 text-white shadow-glow-cyan/20'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>Scan Camera</span>
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                mode === 'upload'
                  ? 'bg-cyan-500 text-white shadow-glow-cyan/20'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload QR</span>
            </button>
          </div>
        </div>
      )}

      {/* Result Card or Input Interfaces */}
      {result ? (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl animate-scaleIn max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div
              className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                result.status === 'authentic'
                  ? isApproved
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 shadow-emerald-500/20'
                    : 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-amber-500/20'
                  : 'bg-rose-500/20 text-rose-500 border border-rose-500/40 shadow-rose-500/20'
              }`}
            >
              {result.status === 'authentic' ? (
                isApproved ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                ) : (
                  <Clock className="h-8 w-8 text-amber-500" />
                )
              ) : (
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {result.status === 'authentic'
                  ? isApproved
                    ? '✓ AUTHENTIC PRODUCT'
                    : '🟡 PENDING ADMIN APPROVAL'
                  : '⚠ PRODUCT NOT FOUND'}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Target Token: {result.sku}
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              result.status === 'authentic'
                ? isApproved
                  ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/30'
                : 'bg-rose-500/10 text-rose-900 dark:text-rose-300 border border-rose-500/30'
            }`}
          >
            {result.summary}
          </div>

          {/* Details Table */}
          {result.status === 'authentic' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Product Name</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{result.title}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Product ID / SKU</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">{result.sku}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Manufacturer</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{result.manufacturer}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Origin</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{result.origin}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Ledger Status</span>
                <span
                  className={`font-semibold uppercase px-2 py-0.5 rounded-md ${
                    isApproved
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {result.onChainStatus}
                </span>
              </div>

              {result.adminApproverWallet && (
                <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs space-y-1">
                  <div className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    Site Admin MetaMask Approver
                  </div>
                  <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all">
                    {result.adminApproverWallet}
                  </div>
                  {result.approvalTxHash && (
                    <div className="text-[10px] text-slate-500 font-mono break-all pt-1 border-t border-cyan-500/10">
                      Approval Tx: {result.approvalTxHash}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setResult(null);
                setInputCode('');
              }}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Verify Another
            </Button>

            <div className="flex items-center gap-2">
              <Link href="/supply-chain">
                <Button variant="outline" size="sm" leftIcon={<Layers className="h-4 w-4" />}>
                  Supply Chain Map
                </Button>
              </Link>

              {isPending && (
                <Link href="/admin/approvals">
                  <Button variant="primary" size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-bold">
                    Approve as Admin
                  </Button>
                </Link>
              )}

              {result.productId && (
                <Link href={`/dashboard/products/${result.productId}`}>
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Product Passport
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : mode === 'input' ? (
        /* ID Input Mode */
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-cyan-500/20 shadow-2xl space-y-6">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Enter Product ID, SKU, or Paste QR URL to Verify
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="e.g. 22ggtty, TT-LUX-9941, Phone..."
                  className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 px-4 py-3.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isVerifying}
                  isMagnetic
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Verify Now
                </Button>
              </div>
            </div>
          </form>

          {/* Quick links to all registered batches */}
          {allBatches.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Registered Blockchain Batches (Click to verify instantly across devices):
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {allBatches.map((p) => {
                  const isApp = p.onChainStatus === 'APPROVED';
                  return (
                    <button
                      key={p.sku || p.id}
                      onClick={() => {
                        setInputCode(p.sku);
                        handleVerification(p.sku, 'manual');
                      }}
                      className={`px-3 py-1.5 rounded-xl border font-mono transition-colors flex items-center gap-1.5 ${
                        isApp
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                      }`}
                    >
                      <span>{isApp ? '🟢' : '🟡'}</span>
                      <span>{p.sku}</span>
                      <span className="font-sans text-[11px] opacity-75">({p.name})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : mode === 'scan' ? (
        /* Camera Scanner Mode */
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-cyan-500/20 shadow-2xl">
          <QrScannerMock
            isScanning={isVerifying}
            onScanComplete={(code) => handleVerification(code, 'camera')}
          />
        </div>
      ) : (
        /* Upload QR Image Mode */
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-cyan-500/20 shadow-2xl">
          <QrUploadMock
            isProcessing={isVerifying}
            onProcessComplete={(code) => handleVerification(code, 'upload')}
          />
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
