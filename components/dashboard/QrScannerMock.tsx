'use client';

import React, { useState } from 'react';
import { Camera, RefreshCw, Upload, ShieldCheck, Sparkles, Check, Flashlight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QrScannerMockProps {
  onScanComplete: (code: string) => void;
  isScanning: boolean;
}

export function QrScannerMock({ onScanComplete, isScanning }: QrScannerMockProps) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');

  const presetSamples = [
    { label: 'Sample 1 (Authentic Tourbillon)', code: 'TT-LUX-9941', status: 'authentic' },
    { label: 'Sample 2 (Quantum Audio Headset)', code: 'TT-ELEC-4420', status: 'authentic' },
    { label: 'Sample 3 (Suspicious Handbag)', code: 'TT-BAG-7718', status: 'suspicious' },
    { label: 'Sample 4 (Counterfeit Sneaker)', code: 'TT-SNEAK-3190', status: 'failed' },
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Scanner Viewport Box */}
      <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shadow-2xl shadow-cyan-500/10 flex flex-col items-center justify-center p-6">
        
        {/* Ambient Grid overlay inside camera feed */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(0, 240, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Camera Flashlight Effect if toggled */}
        {flashlightOn && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none transition-opacity" />
        )}

        {/* Viewfinder Target Frame with Corner Brackets */}
        <div className="relative w-64 h-64 border border-cyan-500/30 rounded-2xl flex items-center justify-center p-4">
          {/* Top-Left Corner */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
          {/* Top-Right Corner */}
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
          {/* Bottom-Left Corner */}
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
          {/* Bottom-Right Corner */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />

          {/* Center Target Hologram */}
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="relative">
              <Camera className="h-10 w-10 text-cyan-400/70 animate-pulse" />
              <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-300">
              {isScanning ? 'ANALYZING CRYPTOGRAPHIC TOKEN...' : 'ALIGN QR MICRO-SEAL HERE'}
            </span>
          </div>

          {/* Continuous or Active Scanning Laser Line */}
          <div className="absolute inset-x-2 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00F0FF] animate-scan-line" />
        </div>

        {/* Bottom Camera Controls Bar inside Viewfinder */}
        <div className="absolute bottom-4 inset-x-6 flex items-center justify-between z-10">
          <button
            onClick={() => setFlashlightOn(!flashlightOn)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              flashlightOn
                ? 'bg-amber-400 text-black border-amber-300'
                : 'bg-black/50 border-white/10 text-white/80 hover:bg-black/80'
            }`}
            title="Toggle Flash"
          >
            <Flashlight className="h-4 w-4" />
          </button>

          <span className="text-[10px] font-mono text-cyan-400/80 bg-black/60 px-2.5 py-1 rounded-full border border-cyan-500/20">
            OPTICAL SCANNER ACTIVE
          </span>

          <button
            onClick={() => setCameraFacing(cameraFacing === 'back' ? 'front' : 'back')}
            className="p-2 rounded-xl bg-black/50 border border-white/10 text-white/80 hover:bg-black/80 text-xs transition-colors"
            title="Flip Camera"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Test Presets trigger buttons */}
      <div className="w-full max-w-md space-y-2.5">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Simulate Camera Scan with Sample Tags:</span>
          <span className="text-[10px] text-cyan-500 font-mono">1-CLICK SCAN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presetSamples.map((sample) => (
            <button
              key={sample.code}
              onClick={() => onScanComplete(sample.code)}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-left transition-all text-xs group"
            >
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-500 transition-colors">
                  {sample.code}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                  {sample.label}
                </div>
              </div>
              <span
                className={`h-2 w-2 rounded-full ${
                  sample.status === 'authentic'
                    ? 'bg-emerald-500 shadow-[0_0_6px_#10B981]'
                    : sample.status === 'suspicious'
                    ? 'bg-amber-500 shadow-[0_0_6px_#F59E0B]'
                    : 'bg-rose-500 shadow-[0_0_6px_#F43F5E]'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
