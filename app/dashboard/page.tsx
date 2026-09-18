'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useUserData } from '@/lib/data/user-data-context';
import { StatCardsGrid } from '@/components/dashboard/StatCardsGrid';
import { QuickVerifyPanel } from '@/components/dashboard/QuickVerifyPanel';
import { RecentVerificationsTable } from '@/components/dashboard/RecentVerificationsTable';
import { Sparkles, ShieldCheck, Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { products, addProduct } = useUserData();
  const rawUsername = user?.username || 'User';
  const uppercaseUsername = rawUsername.toUpperCase();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<'Luxury' | 'Electronics' | 'Pharmaceuticals' | 'Apparel' | 'Cosmetics' | 'Automotive'>('Luxury');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [origin, setOrigin] = useState('');
  const [description, setDescription] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !brand.trim()) return;

    const generatedSku = sku.trim() || `TT-${category.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addProduct({
      sku: generatedSku,
      name: productName.trim(),
      category,
      brand: brand.trim(),
      manufacturer: `${brand.trim()} Manufacturing Corp`,
      manufacturingDate: new Date().toISOString().split('T')[0],
      origin: origin.trim() || 'Geneva, Switzerland',
      currentLocation: 'Central Vault Warehouse',
      status: 'authentic',
      image:
        category === 'Luxury'
          ? 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
          : category === 'Electronics'
          ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      description: description.trim() || 'Cryptographically verified registered asset.',
      batchNumber: `BATCH-${new Date().getFullYear()}-01`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://truetrace.io/verify/${generatedSku}`,
      securityScore: 99,
      specs: {
        'Origin Standard': 'ISO/IEC 27001 Cryptographic RoT',
        'Ledger State': 'Genesis Registered',
      },
    });

    setIsAddModalOpen(false);
    setProductName('');
    setBrand('');
    setSku('');
    setOrigin('');
    setDescription('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner with Dynamic Username Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-0.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Workspace Ledger Synchronized</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            WELCOME TO TRUETRACE,{' '}
            <span className="gradient-text">{uppercaseUsername}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's your product verification overview and live supply chain telemetry.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Product
          </Button>
          <Link href="/dashboard/verify">
            <Button variant="primary" size="sm" isMagnetic leftIcon={<ShieldCheck className="h-4 w-4" />}>
              Verify Product
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Dynamic User KPI Stat Cards */}
      <StatCardsGrid />

      {/* If No Products: Attractive Empty State Banner */}
      {products.length === 0 && (
        <div className="glass-card rounded-3xl p-8 border border-cyan-500/30 shadow-xl bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 flex-shrink-0">
              <Package className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Your verification journey starts here
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mt-0.5">
                Add your first product asset or scan a physical micro-QR code to begin tracking provenance.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            isMagnetic
          >
            Add Your First Product
          </Button>
        </div>
      )}

      {/* Quick Verify Prominent Action Panel */}
      <QuickVerifyPanel />

      {/* Recent Verifications Live Feed Table */}
      <RecentVerificationsTable />

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Product Asset"
        description="Add a new product to your personal TrueTrace registry"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <Input
            label="Product Name"
            placeholder="e.g. Aethel Tourbillon Watch"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="Luxury">Luxury</option>
                <option value="Electronics">Electronics</option>
                <option value="Pharmaceuticals">Pharmaceuticals</option>
                <option value="Apparel">Apparel</option>
                <option value="Automotive">Automotive</option>
              </select>
            </div>

            <Input
              label="Brand / Manufacturer"
              placeholder="e.g. Aethel Horology"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Custom SKU / ID (Optional)"
              placeholder="e.g. TT-LUX-9941"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <Input
              label="Origin City / Country"
              placeholder="e.g. Geneva, Switzerland"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief product description or serial specs..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isMagnetic>
              Save & Issue Passport
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
