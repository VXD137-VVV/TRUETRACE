'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Github, Twitter, Linkedin, Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer id="about" className="relative border-t border-slate-200/80 dark:border-slate-800/80 pt-16 pb-12 overflow-hidden bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/60 dark:border-slate-800/60">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                True<span className="gradient-text">Trace</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              TrueTrace provides enterprise product authenticity verification, anti-counterfeit protection, and unbroken supply chain transparency.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Security Validation Services Operational</span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-cyan-500 transition-colors">
                  Enterprise Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/verify" className="hover:text-cyan-500 transition-colors">
                  Instant Verification Simulator
                </Link>
              </li>
              <li>
                <Link href="/dashboard/products" className="hover:text-cyan-500 transition-colors">
                  Product Registry
                </Link>
              </li>
              <li>
                <Link href="/dashboard/supply-chain" className="hover:text-cyan-500 transition-colors">
                  Supply Chain Telemetry
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Industries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Industries
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">Luxury Timepieces & Fashion</span></li>
              <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">BioPharma & Cold Chain</span></li>
              <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">High-Tech Electronics</span></li>
              <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">Automotive & Aerospace</span></li>
            </ul>
          </div>

          {/* Column 4: Compliance & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">SOC 2 Type II</span></li>
              <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">ISO/IEC 27001</span></li>
              <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">GS1 Digital Standards</span></li>
              <li><span className="hover:text-cyan-500 transition-colors cursor-pointer">Privacy & Data Governance</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} TrueTrace Security Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Security Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
