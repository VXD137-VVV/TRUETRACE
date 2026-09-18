'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck, AlertTriangle, XCircle, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PRESET_TEST_VERIFICATIONS } from '@/lib/mock-data/verifications';

export function LiveVerificationWidget() {
  const [query, setQuery] = useState('TT-LUX-9941');
  const [activeResult, setActiveResult] = useState<typeof PRESET_TEST_VERIFICATIONS.authentic | null>(
    PRESET_TEST_VERIFICATIONS.authentic
  );
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (idToTest?: string) => {
    const id = (idToTest || query).trim().toUpperCase();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (id.includes('LUX') || id === 'TT-LUX-9941') {
        setActiveResult(PRESET_TEST_VERIFICATIONS.authentic);
      } else if (id.includes('BAG') || id === 'TT-BAG-7718') {
        // @ts-ignore
        setActiveResult(PRESET_TEST_VERIFICATIONS.suspicious);
      } else {
        // @ts-ignore
        setActiveResult(PRESET_TEST_VERIFICATIONS.failed);
      }
    }, 600);
  };

  const setSample = (id: string) => {
    setQuery(id);
    handleVerify(id);
  };

  return (
    <section id="product" className="py-20 relative overflow-hidden bg-slate-100/50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Try Live Verification Simulator
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Test how TrueTrace cryptographic validator processes sample product identifiers with real-time risk scoring.
          </p>
        </div>

        {/* Interactive Search Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-cyan-500/30 shadow-2xl">
          {/* Input Box & Action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter verification ID (e.g. TT-LUX-9941)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none text-sm font-mono transition-all"
              />
            </div>
            <Button
              onClick={() => handleVerify()}
              isLoading={isVerifying}
              variant="primary"
              size="lg"
              className="sm:w-44"
              isMagnetic
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Verify Now
            </Button>
          </div>

          {/* Quick Presets */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Try Test Presets:</span>
            <button
              onClick={() => setSample('TT-LUX-9941')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors font-mono"
            >
              ✓ Authentic (TT-LUX-9941)
            </button>
            <button
              onClick={() => setSample('TT-BAG-7718')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors font-mono"
            >
              ⚠ Suspicious (TT-BAG-7718)
            </button>
            <button
              onClick={() => setSample('TT-0000-XX')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors font-mono"
            >
              ✕ Counterfeit (TT-0000-XX)
            </button>
          </div>

          {/* Live Result Area */}
          {activeResult && !isVerifying && (
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {activeResult.title}
                    </h3>
                    <Badge status={activeResult.status} withIcon />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activeResult.brand} • <span className="font-mono">{activeResult.id}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Security Score</div>
                    <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                      {activeResult.securityScore} / 100
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Summary Banner */}
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm mb-6 ${
                  activeResult.status === 'authentic'
                    ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                    : activeResult.status === 'suspicious'
                    ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20'
                }`}
              >
                {activeResult.summary}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {activeResult.details.map((detail, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between"
                  >
                    <span className="text-slate-500 dark:text-slate-400">{detail.label}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
