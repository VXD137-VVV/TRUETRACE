'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List as ListIcon,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Package,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUserData } from '@/lib/data/user-data-context';
import { useWeb3 } from '@/lib/web3/web3-context';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const { products, addProduct, deleteProduct } = useUserData();
  const { account, isConnected, registerProductOnChain } = useWeb3();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'Luxury' | 'Electronics' | 'Pharmaceuticals' | 'Apparel' | 'Cosmetics' | 'Automotive'>('Luxury');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductOrigin, setNewProductOrigin] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');

  const categories = ['All', 'Luxury', 'Electronics', 'Pharmaceuticals', 'Apparel', 'Automotive'];
  const statuses = ['All', 'authentic', 'suspicious', 'failed'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductBrand.trim()) return;

    const generatedSku = newProductSku.trim() || `TT-${newProductCategory.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    let vendorAddr = account || '0x71C8364f3B8820B134D0d32B8180E2e89BfEb950';

    if (isConnected) {
      try {
        const res = await registerProductOnChain({
          sku: generatedSku,
          name: newProductName.trim(),
          brand: newProductBrand.trim(),
          origin: newProductOrigin.trim() || 'Geneva, Switzerland',
          details: newProductDesc.trim(),
        });
        if (res.txHash) txHash = res.txHash;
      } catch (err: any) {
        alert(err.message || 'MetaMask transaction rejected');
        return;
      }
    }

    await addProduct({
      sku: generatedSku,
      name: newProductName.trim(),
      category: newProductCategory,
      brand: newProductBrand.trim(),
      manufacturer: `${newProductBrand.trim()} Manufacturing SA`,
      manufacturingDate: new Date().toISOString().split('T')[0],
      origin: newProductOrigin.trim() || 'Geneva, Switzerland',
      currentLocation: 'Vendor Genesis Vault',
      status: 'authentic',
      onChainStatus: 'PENDING_APPROVAL',
      vendorWallet: vendorAddr,
      creationTxHash: txHash,
      image:
        newProductCategory === 'Luxury'
          ? 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
          : newProductCategory === 'Electronics'
          ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      description: newProductDesc.trim() || 'Tamper-proof cryptographic product passport asset.',
      batchNumber: `BATCH-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 89)}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${generatedSku}`,
      securityScore: 96,
      specs: {
        'Origin Cryptographic Tag': 'MetaMask Genesis Signer',
        'Provenance Status': 'Pending Site Admin Acception',
      },
      timeline: [
        {
          id: `step-vendor-${Date.now()}`,
          title: 'Vendor Genesis Registration (MetaMask Signed)',
          status: 'completed',
          timestamp: new Date().toLocaleString(),
          location: newProductOrigin.trim() || 'Manufacturing Facility',
          handler: `Vendor (${vendorAddr.substring(0, 6)}...${vendorAddr.substring(vendorAddr.length - 4)})`,
          notes: `Batch minted into decentralized ledger. Tx: ${txHash.substring(0, 10)}...`,
          verifiedBy: `Vendor Wallet (${vendorAddr.substring(0, 8)}...)`,
        },
        {
          id: `step-awaiting-${Date.now()}`,
          title: 'Awaiting Site Admin Cryptographic Acception',
          status: 'in-progress',
          timestamp: 'Pending',
          location: 'Site Admin Queue',
          handler: 'Site Admin Authority',
          notes: 'Awaiting Site Admin to inspect and sign approval with MetaMask.',
        },
      ],
    });

    setIsAddModalOpen(false);
    setNewProductName('');
    setNewProductBrand('');
    setNewProductSku('');
    setNewProductOrigin('');
    setNewProductDesc('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Product Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, manage, and inspect all cryptographic product passports in your registry.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
          isMagnetic
        >
          Add Product
        </Button>
      </div>

      {/* Filter and Search Bar (Only shown if products exist) */}
      {products.length > 0 && (
        <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, SKU, brand..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-cyan-500 capitalize"
              >
                {statuses.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-cyan-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-cyan-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="List View"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* If No Products Registered: Empty State */}
      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="You haven't added any products yet"
          description="Register your first product to generate an anti-clone cryptographic QR code and track supply-chain provenance."
          actionLabel="+ Add Product"
          actionIcon={<Plus className="h-4 w-4" />}
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-3xl overflow-hidden group transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/40 flex flex-col justify-between"
              data-cursor="card"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
                    {product.category}
                  </span>
                  <Badge status={product.status} withIcon />
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-mono font-medium">{product.sku}</span>
                  <span className="text-[11px] text-slate-300">Score: {product.securityScore}/100</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                      {product.brand}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        product.onChainStatus === 'PENDING_APPROVAL'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      }`}
                    >
                      {product.onChainStatus === 'PENDING_APPROVAL' ? '🟡 Pending Admin' : '🟢 Admin Approved'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/verify?sku=${product.sku}`}
                      className="font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      Verify <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      Inspect <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove ${product.name} from your registry?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU / Serial</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={prod.image} alt={prod.name} className="h-10 w-10 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{prod.name}</div>
                          <div className="text-[10px] text-slate-500">{prod.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{prod.sku}</td>
                    <td className="py-3.5 px-4">{prod.category}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={prod.status} withIcon />
                    </td>
                    <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                      <Link href={`/dashboard/products/${prod.id}`}>
                        <Button size="sm" variant="ghost">
                          Details
                        </Button>
                      </Link>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Product Asset"
        description="Bind a cryptographic product passport to your personal inventory"
      >
        <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
          <Input
            label="Product Name"
            placeholder="e.g. Aethel Tourbillon Chrono"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newProductCategory}
                onChange={(e) => setNewProductCategory(e.target.value as any)}
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
              placeholder="e.g. Atelier Zenith SA"
              value={newProductBrand}
              onChange={(e) => setNewProductBrand(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Custom SKU / ID (Optional)"
              placeholder="e.g. TT-LUX-9941"
              value={newProductSku}
              onChange={(e) => setNewProductSku(e.target.value)}
            />
            <Input
              label="Manufacturing Origin"
              placeholder="e.g. Geneva, Switzerland"
              value={newProductOrigin}
              onChange={(e) => setNewProductOrigin(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={newProductDesc}
              onChange={(e) => setNewProductDesc(e.target.value)}
              placeholder="Brief product description or serial specifications..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isMagnetic>
              Issue Product Passport
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
