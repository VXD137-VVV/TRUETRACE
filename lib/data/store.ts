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
