'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Layers,
  Cpu,
  Hash,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Lock,
  Unlock,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import confetti from 'canvas-confetti';

export default function BlockchainExplorerPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<any | null>(null);
  const [tamperMessage, setTamperMessage] = useState<string | null>(null);

  const fetchBlockchain = async () => {
    try {
      const res = await fetch('/api/blockchain');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error('Failed to fetch blockchain', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchain();
    const interval = setInterval(fetchBlockchain, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTamper = async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tamper', blockIndex: 1, fakeData: 'MALICIOUS_COUNTERFEIT_DATA_INJECTED' }),
      });
      const json = await res.json();
      setTamperMessage(json.message);
      await fetchBlockchain();
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' }),
      });
      const json = await res.json();
      setTamperMessage(null);
      await fetchBlockchain();
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMine = async () => {
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mine' }),
      });
      const json = await res.json();
      alert(json.message);
      await fetchBlockchain();
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const chain = data?.chain || [];
  const isValid = data?.isChainValid !== false;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-0.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
            <Cpu className="h-3.5 w-3.5" />
            <span>Decentralized SHA-256 Consensus Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Blockchain Ledger Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time inspection of immutable blocks, cryptographic hash linkages, and proof-of-authenticity transactions.
          </p>
        </div>

        {/* Live Network Health Status */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-bold ${
              isValid
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-glow-emerald/20'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40 shadow-glow-rose/30 animate-pulse'
            }`}
          >
            {isValid ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>LEDGER INTEGRITY: 100% VALID</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                <span>TAMPER DETECTED: CHAIN BROKEN</span>
              </>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={fetchBlockchain} leftIcon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Evaluator / Viva Demo Panel */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-cyan-500/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Live Evaluation & Viva Demonstration Tool
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Test Cryptographic Immutability & Tamper Detection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              Demonstrate to judges how an unauthorized hacker injection immediately breaks the mathematical SHA-256 hash linkage, proving why blockchain eliminates counterfeit fraud.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isValid ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTamper}
                isLoading={isActionLoading}
                className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 text-xs"
                leftIcon={<Unlock className="h-3.5 w-3.5" />}
              >
                Simulate Malicious Tampering
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleRestore}
                isLoading={isActionLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                leftIcon={<Lock className="h-3.5 w-3.5" />}
              >
                Restore Ledger Integrity
              </Button>
            )}
          </div>
        </div>

        {/* Warning Banner if tampered */}
        {!isValid && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-3 animate-scaleIn">
            <ShieldAlert className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">CRYPTOGRAPHIC VERIFICATION FAILURE DETECTED!</div>
              <p className="mt-1 text-rose-700 dark:text-rose-400 leading-relaxed">
                {data?.validationError || 'Block hash mismatch! A record in the database was altered without meeting consensus proof-of-work difficulty.'}
              </p>
              <div className="mt-2 text-[11px] font-mono bg-black/40 text-rose-300 p-2 rounded-lg inline-block border border-rose-500/30">
                Hash Linkage Compromised at Block #{data?.tamperedBlockIndex || 1}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold uppercase text-slate-500">Mined Blocks</span>
          <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
            {chain.length}
          </div>
          <div className="text-[11px] text-slate-500">Linked by SHA-256</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold uppercase text-slate-500">Proof-of-Work Target</span>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
            00...
          </div>
          <div className="text-[11px] text-slate-500">Difficulty {data?.difficulty || 2} Leading Zeros</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold uppercase text-slate-500">Registered Assets</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {data?.totalRegisteredAssets || 0}
          </div>
          <div className="text-[11px] text-slate-500">Digital Passports Minted</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold uppercase text-slate-500">Audit Scans Sealed</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {data?.totalAudits || 0}
          </div>
          <div className="text-[11px] text-slate-500">Transactions on Chain</div>
        </div>
      </div>

      {/* Visual Chain of Blocks */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-500" />
            Immutable Block Sequence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any block to inspect its Merkle root, cryptographic nonce, and transaction receipts.
          </p>
        </div>

        {/* Connected Block Cards */}
        <div className="space-y-4">
          {chain.map((block: any, idx: number) => {
            const isGenesis = block.index === 0;
            const isBlockTampered = !isValid && data?.tamperedBlockIndex === block.index;

            return (
              <div key={block.index} className="relative">
                {/* Visual Connector Line between blocks */}
                {idx > 0 && (
                  <div className="flex justify-center py-1">
                    <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500">
                      <span className="h-4 w-0.5 bg-gradient-to-b from-cyan-500 to-indigo-500" />
                      <span className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        SHA-256 LINKAGE HASH
                      </span>
                      <span className="h-4 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500" />
                    </div>
                  </div>
                )}

                <div
                  onClick={() => setSelectedBlock(block)}
                  className={`glass-card rounded-3xl p-6 border transition-all duration-300 cursor-pointer hover:-translate-y-1 group ${
                    isBlockTampered
                      ? 'border-rose-500/80 bg-rose-500/5 shadow-glow-rose/20'
                      : isGenesis
                      ? 'border-cyan-500/40 bg-cyan-500/5 shadow-glow-cyan/10'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/40'
                  }`}
                  data-cursor="card"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Block Number & Badge */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center font-extrabold text-sm text-white ${
                          isBlockTampered
                            ? 'bg-rose-600 shadow-glow-rose'
                            : isGenesis
                            ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-glow-cyan'
                            : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                        }`}
                      >
                        #{block.index}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {isGenesis ? 'Genesis Protocol Block' : `Consensus Block #${block.index}`}
                          </h3>
                          {isGenesis && (
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                              ROOT GENESIS
                            </span>
                          )}
                          {isBlockTampered && (
                            <span className="text-[10px] bg-rose-500/20 text-rose-500 font-bold px-2 py-0.5 rounded-full border border-rose-500/40 animate-pulse">
                              TAMPERED
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {new Date(block.timestamp).toLocaleString()} • Nonce: <span className="font-mono text-cyan-500">{block.nonce}</span>
                        </span>
                      </div>
                    </div>

                    {/* Middle: Hashes */}
                    <div className="flex-1 max-w-xl space-y-1.5 text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="w-24 text-[10px] uppercase font-bold text-slate-400">Previous Hash:</span>
                        <span className="truncate max-w-sm bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-[11px]">
                          {block.previousHash || '0000000000000000000000000000000000000000000000000000000000000000'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-24 text-[10px] uppercase font-bold text-cyan-500">Block Hash:</span>
                        <span className="truncate max-w-sm bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-bold text-[11px]">
                          {block.hash}
                        </span>
                      </div>
                    </div>

                    {/* Right: Transactions Count & Action */}
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {block.transactions?.length || 0} Transactions
                        </span>
                        <span className="text-[10px] text-slate-500">Validated</span>
                      </div>

                      <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                        Inspect
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Details Modal */}
      {selectedBlock && (
        <Modal
          isOpen={!!selectedBlock}
          onClose={() => setSelectedBlock(null)}
          title={`Block #${selectedBlock.index} Cryptographic Payload`}
          description={`Mined at ${new Date(selectedBlock.timestamp).toLocaleString()}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Full SHA-256 Hash:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold break-all">{selectedBlock.hash}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Previous Block Hash:</span>
                <span className="text-slate-600 dark:text-slate-300 break-all">{selectedBlock.previousHash}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-400">Mining Nonce:</span> {selectedBlock.nonce}
                </div>
                <div>
                  <span className="text-slate-400">Difficulty:</span> {selectedBlock.difficulty}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                Transactions ({selectedBlock.transactions?.length || 0})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedBlock.transactions?.map((tx: any) => (
                  <div key={tx.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase text-[10px]">
                        {tx.type}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{tx.sku}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">{tx.productName}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      <span>Actor: {tx.actor}</span>
                      <span>•</span>
                      <span>Location: {tx.location}</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 truncate pt-1">
                      Sig: {tx.signature}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelectedBlock(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
