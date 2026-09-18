'use client';

import React, { useState, useEffect } from 'react';
import { Package, Search, ExternalLink, ShieldCheck, User, Building2 } from 'lucide-react';
import { getAllUsers, getUserData, DATA_CHANGED_EVENT } from '@/lib/data/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminGlobalProductsPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const loadData = () => {
    const users = getAllUsers();
    const prods: any[] = [];
    users.forEach((u) => {
      const data = getUserData(u.id);
      data.products.forEach((p) => {
        prods.push({
          ...p,
          ownerName: u.username,
          ownerEmail: u.email,
        });
      });
    });
    setAllProducts(prods);
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
  }, []);

  const filtered = allProducts.filter((p) => {
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            <Package className="h-3.5 w-3.5" />
            <span>Multi-Tenant Inventory Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Global Products Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            System-wide overview of all cryptographic product passports registered across all client accounts.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, SKU, tenant owner..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">{filtered.length} total products registered</span>
      </div>

      {allProducts.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-xs text-slate-500 space-y-2">
          <Package className="h-10 w-10 text-slate-400 mx-auto" />
          <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No products registered across tenants yet</p>
          <p>When users add products to their workspaces, they will appear in this administrative ledger.</p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU / Serial</th>
                  <th className="py-3.5 px-4">Tenant Owner</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={prod.image} alt={prod.name} className="h-9 w-9 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{prod.name}</div>
                          <div className="text-[10px] text-slate-500">{prod.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{prod.sku}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-purple-500" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{prod.ownerName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{prod.ownerEmail}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={prod.status} withIcon />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{prod.origin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
