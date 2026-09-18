'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Product, VerificationRecord, ScanHistoryItem, UserDataStore } from '@/lib/types';
import {
  getUserData,
  addProduct as storeAddProduct,
  updateProduct as storeUpdateProduct,
  deleteProduct as storeDeleteProduct,
  addVerification as storeAddVerification,
  addScanHistory as storeAddScanHistory,
  calculateUserStats,
  DATA_CHANGED_EVENT,
} from '@/lib/data/store';

interface UserDataContextType {
  products: Product[];
  verifications: VerificationRecord[];
  scanHistory: ScanHistoryItem[];
  stats: {
    totalProducts: number;
    verifiedProducts: number;
    flaggedProducts: number;
    verificationRate: number;
    totalAttempts: number;
  };
  isLoading: boolean;
  addProduct: (productData: Omit<Product, 'id' | 'verificationCount' | 'lastVerified' | 'timeline'> & { timeline?: any[] }) => Promise<Product>;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  recordVerification: (verification: Omit<VerificationRecord, 'id' | 'scannedAt'>) => VerificationRecord;
  recordScanHistory: (scan: Omit<ScanHistoryItem, 'id' | 'date' | 'time' | 'userId' | 'username'>) => ScanHistoryItem;
  findProductBySkuOrId: (query: string) => Product | undefined;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserDataStore>({ products: [], verifications: [], scanHistory: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = () => {
    if (user?.id) {
      const data = getUserData(user.id);
      setUserData(data);
    } else {
      setUserData({ products: [], verifications: [], scanHistory: [] });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
  }, [user?.id]);

  const stats = useMemo(() => {
    if (!user?.id) {
      return { totalProducts: 0, verifiedProducts: 0, flaggedProducts: 0, verificationRate: 0, totalAttempts: 0 };
    }
    return calculateUserStats(user.id);
  }, [user?.id, userData]);

  const addProduct = async (
    productData: Omit<Product, 'id' | 'verificationCount' | 'lastVerified' | 'timeline'> & { timeline?: any[] }
  ): Promise<Product> => {
    if (!user?.id) throw new Error('User must be logged in to add products');

    const generatedId = `prod-${Date.now().toString().slice(-6)}`;
    const newProduct: Product = {
      ...productData,
      id: generatedId,
      verificationCount: 0,
      lastVerified: 'Not verified yet',
      userId: user.id,
      timeline: productData.timeline || [
        {
          id: 'step-1',
          title: 'Genesis Product Registration & Blockchain Mint',
          status: 'completed',
          timestamp: new Date().toLocaleString(),
          location: productData.origin || 'Manufacturing Facility',
          handler: user.username,
          notes: 'Mined into TrueTrace SHA-256 decentralized ledger.',
          verifiedBy: 'TrueTrace Ledger Protocol Node #1',
        },
      ],
    };

    // Save locally for instant UI update
    storeAddProduct(user.id, newProduct);
    loadData();

    // Asynchronously register on backend & mine on blockchain
    try {
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, userId: user.id }),
      }).catch((err) => console.warn('Background blockchain sync:', err));
    } catch (e) {}

    return newProduct;
  };

  const deleteProduct = (productId: string) => {
    if (!user?.id) return;
    storeDeleteProduct(user.id, productId);
    loadData();
    try {
      fetch(`/api/products/${productId}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    if (!user?.id) return;
    storeUpdateProduct(user.id, productId, updates);
    loadData();
  };

  const recordVerification = (
    verification: Omit<VerificationRecord, 'id' | 'scannedAt'>
  ): VerificationRecord => {
    if (!user?.id) throw new Error('User must be logged in to record verification');

    const record: VerificationRecord = {
      ...verification,
      id: `verif-${Date.now().toString().slice(-6)}`,
      scannedAt: 'Just now',
      userId: user.id,
    };

    storeAddVerification(user.id, record);
    loadData();

    // Async sync with backend blockchain verify endpoint
    try {
      fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: verification.verificationId,
          method: verification.method || 'manual',
          user: { id: user.id, username: user.username },
        }),
      }).catch(() => {});
    } catch (e) {}

    return record;
  };

  const recordScanHistory = (
    scan: Omit<ScanHistoryItem, 'id' | 'date' | 'time' | 'userId' | 'username'>
  ): ScanHistoryItem => {
    if (!user?.id) throw new Error('User must be logged in');

    const now = new Date();
    const historyItem: ScanHistoryItem = {
      ...scan,
      id: `scan-${Date.now().toString().slice(-6)}`,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userId: user.id,
      username: user.username,
    };

    storeAddScanHistory(user.id, historyItem);
    loadData();
    return historyItem;
  };

  const findProductBySkuOrId = (query: string): Product | undefined => {
    if (!query) return undefined;
    const clean = query.trim().toUpperCase();
    return userData.products.find(
      (p) => p.sku.toUpperCase() === clean || p.id.toUpperCase() === clean || p.name.toUpperCase().includes(clean)
    );
  };

  return (
    <UserDataContext.Provider
      value={{
        products: userData.products,
        verifications: userData.verifications,
        scanHistory: userData.scanHistory,
        stats,
        isLoading,
        addProduct,
        deleteProduct,
        updateProduct,
        recordVerification,
        recordScanHistory,
        findProductBySkuOrId,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
