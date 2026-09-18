'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QrCode, Search, ShieldCheck, Sparkles, ArrowRight, Camera, UploadCloud, Loader2, RotateCcw, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { QrScannerMock } from '@/components/dashboard/QrScannerMock';
import { QrUploadMock } from '@/components/dashboard/QrUploadMock';
import { useUserData } from '@/lib/data/user-data-context';
import { useAuth } from '@/lib/auth/auth-context';
import confetti from 'canvas-confetti';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const initialMode = searchParams.get('mode') === 'upload' ? 'upload' : searchParams.get('mode') === 'scan' ? 'scan' : 'input';

  const { products, recordVerification, recordScanHistory, findProductBySkuOrId } = useUserData();
  const { user } = useAuth();

  const [mode, setMode] = useState<'input' | 'scan' | 'upload'>(initialMode);
  const [inputCode, setInputCode] = useState(initialId);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    if (initialId) {
      handleVerification(initialId, 'manual');
    }
  }, [initialId]);

  const handleVerification = (codeToVerify: string, method: 'camera' | 'upload' | 'manual' = 'manual') => {
    const clean = codeToVerify.trim().toUpperCase();
    if (!clean) return;

    setIsVerifying(true);
    setResult(null);

    setTimeout(() => {
      setIsVerifying(false);

      // Check if product exists in currently logged-in user's products
      const matchedProduct = findProductBySkuOrId(clean);

      if (matchedProduct) {
        // Authentic match found in user's registry!
        const verificationRecord = recordVerification({
          productId: matchedProduct.id,
          productName: matchedProduct.name,
          brand: matchedProduct.brand,
          category: matchedProduct.category,
          verificationId: matchedProduct.sku,
          status: 'authentic',
          location: 'Personal Account Node',
          scannedBy: user?.username || 'Authorized User',
          deviceType: method === 'camera' ? 'TrueTrace Optical Scanner' : method === 'upload' ? 'QR File Processor' : 'Web Terminal',
          ipAddress: '127.0.0.1 (Local Session)',
          anomalyScore: 0,
          method,
          riskFactors: ['Valid digital passport signature matched in registry'],
        });

        recordScanHistory({
          scanCode: matchedProduct.sku,
          result: 'authentic',
          method,
          productId: matchedProduct.id,
          productName: matchedProduct.name,
          details: 'Matched authentic product in user registry',
        });

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
          summary: '✓ AUTHENTIC PRODUCT — This cryptographic micro-seal is registered in your account and matches the origin passport.',
          productId: matchedProduct.id,
          method,
        });

        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#38BDF8', '#5B8CFF', '#34D399', '#8B7CFF'],
          });
        } catch (e) {}
      } else {
        // Product NOT found in user's registry
        recordVerification({
          productName: 'Unregistered / Unknown QR Asset',
          brand: 'Unrecognized Entity',
          category: 'Unknown',
          verificationId: clean,
          status: 'not_found',
          location: 'Public Scan Point',
          scannedBy: user?.username || 'User',
          deviceType: method === 'camera' ? 'Optical Scanner' : method === 'upload' ? 'QR File Processor' : 'Web Console',
          ipAddress: '127.0.0.1',
          anomalyScore: 88,
          method,
          riskFactors: ['Token identifier not found in your registered product database'],
        });

        recordScanHistory({
          scanCode: clean,
          result: 'not_found',
          method,
          details: 'QR token not associated with any product in this account',
        });

        setResult({
          status: 'not_found',
          title: 'Product Not Found in Account',
          sku: clean,
          category: 'Unregistered',
          brand: 'Unknown',
          manufacturer: 'Unrecognized Origin',
          origin: 'Unknown',
          manufacturedDate: 'N/A',
          securityScore: 0,
          summary: '⚠ PRODUCT NOT FOUND — This QR code or serial ID is not associated with a registered product in your account.',
          method,
        });
      }
    }, 600);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerification(inputCode, 'manual');
  };

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
          Scan with optical camera, upload a QR code image, or enter a serial ID to verify against your registered inventory.
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
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 shadow-emerald-500/20'
                  : 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-amber-500/20'
              }`}
            >
              {result.status === 'authentic' ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {result.status === 'authentic' ? '✓ AUTHENTIC PRODUCT' : '⚠ PRODUCT NOT FOUND'}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Target Token: {result.sku}
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              result.status === 'authentic'
                ? 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/30'
            }`}
          >
            {result.summary}
          </div>

          {/* Details Table */}
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
              <span className="text-slate-500">Verification Method</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{result.method}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
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

            {result.productId && (
              <Link href={`/dashboard/products/${result.productId}`}>
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View Product Passport
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : mode === 'input' ? (
        /* ID Input Mode */
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-cyan-500/20 shadow-2xl space-y-6">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Enter Product ID / SKU to Verify
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="e.g. TT-LUX-9941, TT-ELEC-4420"
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

          {/* Quick links to user's existing products if any */}
          {products.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Your Registered Products (Click to auto-verify):
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setInputCode(p.sku);
                      handleVerification(p.sku, 'manual');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 font-mono transition-colors"
                  >
                    ✓ {p.name} ({p.sku})
                  </button>
                ))}
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
