'use client';

import React, { useState } from 'react';
import { useWeb3 } from '@/lib/web3/web3-context';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Wallet, ChevronDown, Check, Copy, ExternalLink, LogOut, Radio } from 'lucide-react';

export function MetaMaskConnectButton({ className = '' }: { className?: string }) {
  const {
    account,
    shortAccount,
    isConnected,
    isConnecting,
    isMetaMaskInstalled,
    networkName,
    balance,
    isAdmin,
    connectWallet,
    disconnectWallet,
  } = useWeb3();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={connectWallet}
        isLoading={isConnecting}
        leftIcon={<Wallet className="h-4 w-4 text-amber-400" />}
        className={`bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 text-white font-semibold shadow-md shadow-orange-500/20 border-0 ${className}`}
      >
        <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
      </Button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-slate-800 dark:text-white transition-all text-xs font-medium backdrop-blur-md"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{shortAccount}</span>

        {isAdmin && (
          <span className="bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 py-0.2 text-[10px] rounded-md font-bold uppercase tracking-wider">
            Admin
          </span>
        )}

        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-2xl p-3 z-50 animate-fadeIn space-y-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">MetaMask Connected</span>
            <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
              <Radio className="h-3 w-3 animate-pulse" /> {networkName}
            </span>
          </div>

          <div className="bg-slate-100/70 dark:bg-slate-800/60 rounded-xl p-2.5">
            <div className="text-[10px] text-slate-400 mb-0.5">Wallet Address</div>
            <div className="font-mono text-xs text-slate-900 dark:text-white truncate font-medium">{account}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Balance: <span className="font-bold text-slate-900 dark:text-white">{balance} ETH</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyAddress}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => {
                disconnectWallet();
                setDropdownOpen(false);
              }}
              className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
