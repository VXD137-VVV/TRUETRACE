'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShieldCheck,
  QrCode,
  Download,
  Copy,
  Check,
  Share2,
  MapPin,
  Building2,
  Clock,
  Layers,
  Package,
} from 'lucide-react';
import { useUserData } from '@/lib/data/user-data-context';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products } = useUserData();
  const [copied, setCopied] = useState(false);
  const [serverProduct, setServerProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const productId = params?.id as string;

  React.useEffect(() => {
    if (!productId) return;
    const local = products.find(
      (p) =>
        p.id === productId ||
        p.sku.toUpperCase() === productId.toUpperCase() ||
        p.id.toUpperCase() === productId.toUpperCase()
    );
    if (local) {
      setServerProduct(local);
      setIsLoading(false);
      return;
    }

    // Fallback: fetch from central server database
    fetch('/api/products?t=' + Date.now())
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.products)) {
          const clean = productId.trim().toUpperCase();
          const found = json.products.find(
            (p: any) =>
              p.id.toUpperCase() === clean ||
              p.sku.toUpperCase() === clean ||
              p.name.toUpperCase().includes(clean)
          );
          if (found) {
            setServerProduct(found);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [productId, products]);

  const product = serverProduct || products.find(
    (p) =>
      p.id === productId ||
      p.sku.toUpperCase() === (productId || '').toUpperCase()
  );

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="h-10 w-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Resolving Cryptographic Passport from Ledger...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <Package className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          No registered cryptographic ledger entry matches identifier "{productId}".
        </p>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/products">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Products
            </Button>
          </Link>
          <Link href="/verify">
            <Button variant="primary" size="sm" leftIcon={<ShieldCheck className="h-4 w-4" />}>
              Public Ledger Verifier
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/verify?sku=${product.sku}` : `https://truetrace.io/verify/${product.sku}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back Button and Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {product.name}
              </h1>
              <Badge status={product.status} withIcon />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Unique SKU: <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{product.sku}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopyLink} leftIcon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}>
            {copied ? 'Copied Link' : 'Copy Verify URL'}
          </Button>
          <Link href={`/dashboard/verify?id=${product.sku}`}>
            <Button variant="primary" size="sm" isMagnetic leftIcon={<ShieldCheck className="h-4 w-4" />}>
              Verify Passport
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Overview on Left, QR & Trust Score on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Product Photo, Specs & Metadata */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="sm:col-span-5 relative h-64 sm:h-auto bg-slate-200 dark:bg-slate-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    {product.brand} • {product.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Batch: {product.batchNumber}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Origin</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-cyan-500" />
                      {product.origin}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Location</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                      <Building2 className="h-3 w-3 text-indigo-500" />
                      {product.currentLocation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          {product.specs && (
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-500" />
                Technical & Cryptographic Passport Specs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80"
                  >
                    <span className="text-slate-500 dark:text-slate-400">{key}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supply Chain Timeline */}
          {product.timeline && product.timeline.length > 0 && (
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Supply Chain Custody Timeline
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Immutable milestone logs for this asset
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-indigo-500 before:to-purple-500">
                {product.timeline.map((step: any) => (
                  <div key={step.id} className="relative group">
                    <div className="absolute -left-6 top-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-950 bg-cyan-500 shadow-glow-cyan/50 flex items-center justify-center text-white text-[10px] font-bold">
                      <Check className="h-3 w-3" />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 group-hover:border-cyan-500/40 transition-colors space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {step.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{step.location}</span>
                        <span>•</span>
                        <span>Handler: {step.handler}</span>
                      </div>

                      {step.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800/60">
                          {step.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: QR Code Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 shadow-xl space-y-4 bg-gradient-to-b from-cyan-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Security Index
              </span>
              <Badge status={product.status} withIcon />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">
                {product.securityScore || 99}
              </span>
              <span className="text-sm text-slate-400 font-semibold">/ 100</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Based on single-use rotational token validity and registered provenance.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cryptographic Micro-QR Seal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan with any smartphone or TrueTrace terminal
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md inline-block">
              <img
                src={product.qrCodeUrl}
                alt="Product QR Code"
                className="h-44 w-44 mx-auto"
              />
            </div>

            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 truncate">
              {product.sku}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => alert('Certificate PDF generated (Simulated)')}
                leftIcon={<Download className="h-3.5 w-3.5" />}
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={handleCopyLink}
                leftIcon={<Share2 className="h-3.5 w-3.5" />}
              >
                Share
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
