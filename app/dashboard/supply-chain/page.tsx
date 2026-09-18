'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Truck,
  Building2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Layers,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MOCK_SUPPLY_CHAIN_NODES, MOCK_SUPPLY_CHAIN_STATS } from '@/lib/mock-data/supply-chain';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function SupplyChainPage() {
  const [selectedNode, setSelectedNode] = useState(MOCK_SUPPLY_CHAIN_NODES[0]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Supply Chain Telemetry & Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time custody tracking across manufacturing plants, customs ports, and distribution vaults.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>142 Nodes Synchronized</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Tracking Nodes</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {MOCK_SUPPLY_CHAIN_STATS.activeTrackingNodes}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">In-Transit Items</div>
          <div className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">
            {MOCK_SUPPLY_CHAIN_STATS.inTransitItems.toLocaleString()}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">On-Time Rate</div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {MOCK_SUPPLY_CHAIN_STATS.onTimeTransitRate}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Tamper Blocked</div>
          <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
            {MOCK_SUPPLY_CHAIN_STATS.tamperAttemptsBlocked}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Avg Transit Time</div>
          <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {MOCK_SUPPLY_CHAIN_STATS.avgTransitTime}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Cold Chain Comp.</div>
          <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400">
            {MOCK_SUPPLY_CHAIN_STATS.coldChainCompliance}
          </div>
        </div>
      </div>

      {/* Interactive Global Network Node Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Network Map / Node Canvas Mockup */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 relative overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl min-h-[420px] flex flex-col justify-between">
          <div className="flex items-center justify-between z-10">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Global Cryptographic Custody Network
              </h3>
              <p className="text-xs text-slate-500">Interactive live hub routing topology</p>
            </div>
            <span className="text-xs font-mono bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 px-2.5 py-1 rounded-full">
              LIVE TELEMETRY
            </span>
          </div>

          {/* Map Nodes Simulation */}
          <div className="relative my-8 h-72 w-full rounded-2xl bg-slate-950/90 border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* World Grid Lines */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0, 240, 255, 0.2) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 240, 255, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Glowing connecting vectors */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true">
              <line x1="15%" y1="35%" x2="22%" y2="28%" stroke="rgba(0,240,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="22%" y1="28%" x2="19%" y2="33%" stroke="rgba(0,240,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="22%" y1="28%" x2="30%" y2="32%" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="30%" y1="32%" x2="32%" y2="34%" stroke="rgba(0,240,255,0.5)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="32%" y1="34%" x2="26%" y2="50%" stroke="rgba(244,63,94,0.6)" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="75%" y1="55%" x2="10%" y2="38%" stroke="rgba(0,240,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>

            {/* Render node badges across map coordinates */}
            {MOCK_SUPPLY_CHAIN_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl border text-left transition-all z-20 flex items-center gap-2 group ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-glow-cyan scale-110'
                      : node.status === 'warning'
                      ? 'bg-amber-500/20 border-amber-400 hover:scale-105'
                      : 'bg-black/60 border-white/10 hover:border-cyan-400/60 hover:scale-105'
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      node.status === 'healthy'
                        ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]'
                        : 'bg-amber-400 shadow-[0_0_6px_#F59E0B] animate-ping'
                    }`}
                  />
                  <span className="text-[10px] font-bold text-white whitespace-nowrap hidden sm:inline">
                    {node.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Click any geographic hub above to inspect active telemetry.</span>
            <span className="font-semibold text-cyan-400">Protocol 100% Encrypted</span>
          </div>
        </div>

        {/* Right Column: Active Node Details Card */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-500">
                Selected Hub Telemetry
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  selectedNode.status === 'healthy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {selectedNode.status.toUpperCase()}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedNode.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                {selectedNode.location}
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Hub Role Type</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedNode.type}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Active Shipments</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{selectedNode.activeShipments} Pallets</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Average Dwell Time</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedNode.avgDwellTime}</span>
              </div>
            </div>

            {selectedNode.status === 'warning' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-500" />
                <span>Geographic anomaly flagged: Secondary scans detected without formal boutique release authorization.</span>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => alert(`Node ${selectedNode.name} audit report generated (Simulated)`)}
          >
            Export Node Telemetry
          </Button>
        </div>
      </div>
    </div>
  );
}
