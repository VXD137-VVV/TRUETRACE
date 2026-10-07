import { UserProfile, Product, VerificationRecord, ScanHistoryItem, PlatformSettings, UserDataStore } from '@/lib/types';

export const USERS_STORAGE_KEY = 'truetrace_users_list';
export const PLATFORM_SETTINGS_KEY = 'truetrace_platform_settings';
export const USER_DATA_PREFIX = 'truetrace_data_';
export const DATA_CHANGED_EVENT = 'truetrace_data_changed';

export const DEFAULT_ADMIN: UserProfile = {
  id: 'admin-001',
  username: 'Alex Vance',
  email: 'admin@truetrace.io',
  role: 'admin',
  status: 'active',
  company: 'TrueTrace Security Labs',
  createdAt: '2025-01-01',
  twoFactorEnabled: true,
  themePreference: 'dark',
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: 'TrueTrace Security Cloud',
  allowRegistration: true,
  allowUserVerification: true,
  defaultTheme: 'dark',
  enableCursorEffects: true,
  enableAnimations: true,
  enableEmailAlerts: true,
  sessionTimeoutMinutes: 60,
};

// Helper to notify all listening components of state updates
export function notifyDataChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
  }
}

// ---------------- USER MANAGEMENT ---------------- //

export function getAllUsers(): UserProfile[] {
  if (typeof window === 'undefined') return [DEFAULT_ADMIN];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // Seed default admin
      const initial = [DEFAULT_ADMIN];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [DEFAULT_ADMIN];
  }
}

export function getUserById(id: string): UserProfile | null {
  const users = getAllUsers();
  return users.find((u) => u.id === id) || null;
}

export function getUserByEmail(email: string): UserProfile | null {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
}

export function saveUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  notifyDataChange();
}

export function updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index >= 0) {
    const updated = { ...users[index], ...updates };
    users[index] = updated;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    notifyDataChange();
    return updated;
  }
  return null;
}

export function deleteUser(id: string): void {
  if (typeof window === 'undefined') return;
  const users = getAllUsers().filter((u) => u.id !== id);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  // Clean up user data
  localStorage.removeItem(`${USER_DATA_PREFIX}${id}`);
  notifyDataChange();
}

// ---------------- USER-SPECIFIC DATA STORE (ISOLATED) ---------------- //

export function getUserData(userId: string): UserDataStore {
  if (typeof window === 'undefined' || !userId) {
    return { products: [], verifications: [], scanHistory: [] };
  }
  try {
    const raw = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
    if (!raw) {
      const empty: UserDataStore = { products: [], verifications: [], scanHistory: [] };
      localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(empty));
      return empty;
    }
    return JSON.parse(raw);
  } catch (e) {
    return { products: [], verifications: [], scanHistory: [] };
  }
}

export function saveUserData(userId: string, data: UserDataStore): void {
  if (typeof window === 'undefined' || !userId) return;
  localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(data));
  notifyDataChange();
}

export function addProduct(userId: string, product: Product): void {
  const current = getUserData(userId);
  current.products.unshift(product);
  saveUserData(userId, current);

  // Synchronize with central server so all connected systems immediately see it
  if (typeof window !== 'undefined') {
    try {
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, userId }),
      }).catch((err) => console.warn('Server sync error for addProduct:', err));
    } catch (e) {}
  }
}

export function updateProduct(userId: string, productId: string, updates: Partial<Product>): void {
  const current = getUserData(userId);
  const index = current.products.findIndex((p) => p.id === productId);
  if (index >= 0) {
    current.products[index] = { ...current.products[index], ...updates };
    saveUserData(userId, current);
  }
}

export function deleteProduct(userId: string, productId: string): void {
  const current = getUserData(userId);
  current.products = current.products.filter((p) => p.id !== productId);
  saveUserData(userId, current);
}

export function addVerification(userId: string, verification: VerificationRecord): void {
  const current = getUserData(userId);
  current.verifications.unshift(verification);

  // Update associated product verification count if matching
  if (verification.productId) {
    const prod = current.products.find((p) => p.id === verification.productId || p.sku === verification.verificationId);
    if (prod) {
      prod.verificationCount += 1;
      prod.lastVerified = 'Just now';
      prod.status = verification.status;
    }
  }

  saveUserData(userId, current);
}

export function addScanHistory(userId: string, scanItem: ScanHistoryItem): void {
  const current = getUserData(userId);
  current.scanHistory.unshift(scanItem);
  saveUserData(userId, current);
}

// ---------------- PLATFORM SETTINGS ---------------- //

export function getPlatformSettings(): PlatformSettings {
  if (typeof window === 'undefined') return DEFAULT_PLATFORM_SETTINGS;
  try {
    const raw = localStorage.getItem(PLATFORM_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(PLATFORM_SETTINGS_KEY, JSON.stringify(DEFAULT_PLATFORM_SETTINGS));
      return DEFAULT_PLATFORM_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PLATFORM_SETTINGS;
  }
}

export function updatePlatformSettings(updates: Partial<PlatformSettings>): PlatformSettings {
  if (typeof window === 'undefined') return DEFAULT_PLATFORM_SETTINGS;
  const current = getPlatformSettings();
  const updated = { ...current, ...updates };
  localStorage.setItem(PLATFORM_SETTINGS_KEY, JSON.stringify(updated));
  notifyDataChange();
  return updated;
}

// ---------------- DYNAMIC STATS CALCULATORS ---------------- //

export function calculateUserStats(userId: string) {
  const data = getUserData(userId);
  const totalProducts = data.products.length;
  const verifiedProducts = data.verifications.filter((v) => v.status === 'authentic').length;
  const flaggedProducts = data.verifications.filter((v) => v.status === 'suspicious' || v.status === 'failed').length;
  const totalAttempts = data.verifications.length;

  const verificationRate = totalAttempts > 0 ? ((verifiedProducts / totalAttempts) * 100).toFixed(1) : '0';

  return {
    totalProducts,
    verifiedProducts,
    flaggedProducts,
    verificationRate: parseFloat(verificationRate),
    totalAttempts,
  };
}

export function calculateGlobalAdminStats() {
  const users = getAllUsers();
  let totalProducts = 0;
  let totalVerifications = 0;
  let flaggedVerifications = 0;
  let verifiedProducts = 0;

  users.forEach((u) => {
    const data = getUserData(u.id);
    totalProducts += data.products.length;
    totalVerifications += data.verifications.length;
    flaggedVerifications += data.verifications.filter((v) => v.status === 'suspicious' || v.status === 'failed').length;
    verifiedProducts += data.verifications.filter((v) => v.status === 'authentic').length;
  });

  const activeUsers = users.filter((u) => u.status === 'active').length;

  return {
    totalUsers: users.length,
    activeUsers,
    totalProducts,
    totalVerifications,
    flaggedVerifications,
    verifiedProducts,
    verificationRate: totalVerifications > 0 ? ((verifiedProducts / totalVerifications) * 100).toFixed(1) : '0',
  };
}

// ---------------- GLOBAL SUPPLY CHAIN PRODUCT MANAGEMENT ---------------- //

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-001-omega',
    sku: 'TT-LUX-9941',
    name: 'Chronograph Tourbillon Elite',
    category: 'Luxury',
    brand: 'Horology Geneva',
    manufacturer: 'Geneva Horology Precision Ltd',
    manufacturingDate: '2026-03-12',
    origin: 'Geneva, Switzerland',
    currentLocation: 'Central Vault Verification Hub',
    status: 'authentic',
    verificationCount: 4,
    lastVerified: '12 minutes ago',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    description: 'Precision handcrafted mechanical watch with dual tourbillon cage and titanium casing.',
    batchNumber: 'BATCH-2026-09A',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TT-LUX-9941',
    securityScore: 99,
    userId: 'admin-001',
    onChainStatus: 'APPROVED',
    vendorWallet: '0x71C8364f3B8820B134D0d32B8180E2e89BfEb950',
    adminApproverWallet: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    creationTxHash: '0x8f7a93b4e72301b3c9d1234567890abcdef1234567890abcdef1234567890abc1',
    approvalTxHash: '0x2d5c89e1a2f30b4c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c',
    approvedAt: '2026-03-14T09:30:00Z',
    specs: {
      'Movement': 'Automatic Calibre 892',
      'Water Resistance': '100m',
      'Ledger State': 'Confirmed On-Chain',
    },
    timeline: [
      {
        id: 't-1',
        title: 'Vendor Genesis Registration',
        status: 'completed',
        timestamp: '12 Mar 2026, 09:15 AM',
        location: 'Geneva Facility, Switzerland',
        handler: 'Horology Geneva (Vendor)',
        notes: 'Signed and registered on TrueTrace smart contract.',
        verifiedBy: '0x71C8364f3B8820B134D0d32B8180E2e89BfEb950',
      },
      {
        id: 't-2',
        title: 'Site Admin Inspection & MetaMask Approval',
        status: 'completed',
        timestamp: '14 Mar 2026, 11:30 AM',
        location: 'Central Vault Hub',
        handler: 'Alex Vance (Site Admin)',
        notes: 'Cryptographic root certificate authenticated on-chain.',
        verifiedBy: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      },
    ],
  },
  {
    id: 'prod-002-pharma',
    sku: 'TT-PHR-5520',
    name: 'CardioShield Nano-Vaccine Batch 44',
    category: 'Pharmaceuticals',
    brand: 'BioHealth Labs',
    manufacturer: 'BioHealth Pharma GmbH',
    manufacturingDate: '2026-04-01',
    origin: 'Frankfurt, Germany',
    currentLocation: 'Cold Storage Transit Bay 3',
    status: 'authentic',
    verificationCount: 0,
    lastVerified: 'Pending Admin Review',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Cold-chain tracked bio-pharmaceutical units requiring continuous temperature telemetry.',
    batchNumber: 'BATCH-2026-V44',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TT-PHR-5520',
    securityScore: 92,
    userId: 'admin-001',
    onChainStatus: 'PENDING_APPROVAL',
    vendorWallet: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
    creationTxHash: '0x4e6b12a3f9c8d7e0123456789abcdef0123456789abcdef0123456789abcdef01',
    specs: {
      'Storage Condition': '-20°C Cold Chain',
      'Regulatory Clearance': 'EMA/FDA Validated',
    },
    timeline: [
      {
        id: 't-1',
        title: 'Vendor Genesis Registration',
        status: 'completed',
        timestamp: '01 Apr 2026, 02:40 PM',
        location: 'Frankfurt Production Plant',
        handler: 'BioHealth Labs (Vendor)',
        notes: 'Batch minted with cold-chain sensor payload on ledger.',
        verifiedBy: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
      },
      {
        id: 't-2',
        title: 'Awaiting Site Admin Cryptographic Acception',
        status: 'in-progress',
        timestamp: 'Pending',
        location: 'Site Admin Queue',
        handler: 'Site Admin Authority',
        notes: 'Waiting for Admin MetaMask verification signature.',
      },
    ],
  },
];

export function getAllGlobalProducts(): Product[] {
  if (typeof window === 'undefined') return SEED_PRODUCTS;
  const users = getAllUsers();
  const allProds: Product[] = [];

  users.forEach((u) => {
    const data = getUserData(u.id);
    if (data.products && data.products.length > 0) {
      allProds.push(...data.products);
    }
  });

  if (allProds.length === 0) {
    // Seed to admin-001
    const adminData = getUserData('admin-001');
    adminData.products = [...SEED_PRODUCTS];
    saveUserData('admin-001', adminData);
    return SEED_PRODUCTS;
  }

  return allProds;
}

export function findGlobalProductBySku(sku: string): Product | null {
  const prods = getAllGlobalProducts();
  const cleanSku = sku.trim().toUpperCase();
  return prods.find((p) => p.sku.toUpperCase() === cleanSku || p.id === sku) || null;
}

export function adminUpdateProductApproval(
  productId: string,
  approved: boolean,
  adminWallet: string,
  txHash: string,
  notes?: string
): Product | null {
  if (typeof window === 'undefined') return null;
  const users = getAllUsers();

  for (const u of users) {
    const data = getUserData(u.id);
    const prodIndex = data.products.findIndex((p) => p.id === productId || p.sku === productId);
    if (prodIndex >= 0) {
      const prod = data.products[prodIndex];
      const newStatus = approved ? 'APPROVED' : 'REJECTED';
      const timestamp = new Date().toISOString();

      prod.onChainStatus = newStatus;
      prod.adminApproverWallet = adminWallet;
      prod.approvalTxHash = txHash;
      prod.approvedAt = timestamp;
      prod.lastVerified = 'Just now (Admin Approved)';

      const stepId = `step-admin-${Date.now()}`;
      const newStep = {
        id: stepId,
        title: approved ? 'Site Admin Verified & Approved on MetaMask' : 'Rejected by Site Admin',
        status: (approved ? 'completed' : 'pending') as 'completed' | 'in-progress' | 'pending',
        timestamp: new Date().toLocaleString(),
        location: 'TrueTrace Security Validator',
        handler: `Site Admin (${adminWallet.substring(0, 6)}...${adminWallet.substring(adminWallet.length - 4)})`,
        notes: notes || (approved ? `Cryptographic approval signed via MetaMask. Blockchain Tx: ${txHash.substring(0, 10)}...` : 'Batch rejected during audit review.'),
        verifiedBy: `Admin Authority (${adminWallet.substring(0, 8)}...)`,
      };

      // Replace or update timeline
      if (prod.timeline && prod.timeline.length > 1 && prod.timeline[1].title.includes('Awaiting')) {
        prod.timeline[1] = newStep;
      } else {
        prod.timeline = prod.timeline || [];
        prod.timeline.push(newStep);
      }

      data.products[prodIndex] = prod;
      saveUserData(u.id, data);
      notifyDataChange();

      // Synchronize with central backend server across all connected systems
      try {
        fetch('/api/products/approval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: prod.id,
            sku: prod.sku,
            approved,
            adminWallet,
            txHash,
            notes,
          }),
        }).catch((err) => console.warn('Failed to sync approval to server:', err));
      } catch (e) {}

      return prod;
    }
  }

  // If not found in local user, still attempt to sync to central server database
  try {
    fetch('/api/products/approval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        sku: productId,
        approved,
        adminWallet,
        txHash,
        notes,
      }),
    }).catch((err) => console.warn('Direct server approval sync:', err));
  } catch (e) {}

  return null;
}

export async function fetchGlobalProductsFromServer(): Promise<Product[]> {
  if (typeof window === 'undefined') return getAllGlobalProducts();
  try {
    const res = await fetch('/api/products?t=' + Date.now(), { cache: 'no-store' });
    const json = await res.json();
    if (json.success && Array.isArray(json.products) && json.products.length > 0) {
      // Synchronize to local user data store so offline components also have it
      const adminData = getUserData('admin-001');
      adminData.products = json.products;
      saveUserData('admin-001', adminData);
      return json.products;
    }
  } catch (err) {
    console.warn('Network sync notice: Using cached products:', err);
  }
  return getAllGlobalProducts();
}


